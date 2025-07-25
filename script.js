"use strict";
// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    transactions: [
        200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 1000, -349, 3248,
    ],
    interestRate: 1.2, // %
    pin: 1111,

    transactionsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-05-27T17:01:17.194Z",
        "2020-07-11T23:36:17.929Z",
        "2020-07-12T10:51:36.790Z",
        "2025-07-23T23:36:17.929Z",
        "2025-07-20T10:51:36.790Z",
        "2025-07-15T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    transactionsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

// const account3 = {
//     owner: "Steven Thomas Williams",
//     transactions: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
// };

// const account4 = {
//     owner: "Sarah Smith",
//     transactions: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
// };

const accounts = [account1, account2];

// select all the needed DOM elements
const [loginUserEl, loginPINEl] = document.querySelectorAll(".login-input");
const transactionsEl = document.querySelector(".transactions");
const loginDate = document.querySelector(".login-date");
const currentBalanceEl = document.querySelector(".current-balance");
const depositedEl = document.querySelector(".deposited");
const withdrawaledEl = document.querySelector(".withdrawaled");
const interestsEl = document.querySelector(".interests");
const welcomeEl = document.querySelector(".welcome");
const userInterface = document.querySelector(".user-interface");
const transferInputName = document.querySelector(".transfer-input-name");
const transferInputAmount = document.querySelector(".transfer-input-amount");
const loanInput = document.querySelector(".loan-input");
const closeInputUsername = document.querySelector(".close-input-username");
const closeInputPIN = document.querySelector(".close-input-pin");
const timerEl = document.querySelector(".timer");

const btnCheck = document.querySelector(".btn-check");
const btnTransfer = document.querySelector(".btn-transfer");
const btnLoan = document.querySelector(".btn-loan");
const btnClose = document.querySelector(".btn-close");
const btnSort = document.querySelector(".btn-sort-transactions");

// utility variables
let currentAccount;
let currentOrder = false;

// utility functions
const tDNum = num => `${num}`.padStart(2, "0");
const setDate = function (account, date, includeTime = false) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    if (includeTime) {
        return Intl.DateTimeFormat(account.locale, options).format(date);
    }
    return new Intl.DateTimeFormat(account.locale).format(date);
};
const daysPassed = (start, end) => Math.round((end - start) / 1000 / 60 / 60 / 24);
const setCurrency = function (locale, currency, num) {
    const options = {
        style: "currency",
        currency: currency,
    };
    return new Intl.NumberFormat(locale, options).format(num);
};
const setHourMin = (locale, time) =>
    new Intl.DateTimeFormat(locale, {
        minute: "numeric",
        second: "numeric",
    }).format(time);

// display the transactions of the account
const displayTransactions = function (account, sort) {
    transactionsEl.innerHTML = "";
    account.transactionsInfo = account.transactions.map((transaction, i) => ({
        transaction,
        date: account.transactionsDates[i],
    }));
    account.sortedTransactionsInfo = account.transactionsInfo
        .slice()
        .sort((a, b) => a.transaction - b.transaction);
    const trans = sort ? account.sortedTransactionsInfo : account.transactionsInfo;
    trans.forEach(function ({ transaction, date }, i) {
        const time = new Date(date);
        const dif = daysPassed(time, new Date());
        let dateSet = `${dif} days ago`;
        if (dif === 0) {
            dateSet = "now";
        } else if (dif === 1) {
            dateSet = "yesterday";
        } else if (dif > 7) {
            dateSet = setDate(account, time);
        }
        const type = transaction > 0 ? "deposit" : "withdrawal";
        const transactionRow = `
            <div class="transaction">
                <p class="transaction-state transaction-state-${type}">${
            i + 1
        } ${type}</p>
                <p class="transaction-date">${dateSet}</p>
                <p class="transaction-amount">${setCurrency(
                    account.locale,
                    account.currency,
                    transaction
                )}</p>
            </div>
        `;
        transactionsEl.insertAdjacentHTML("afterbegin", transactionRow);
    });
};

// calculation and display the current balance
const calcDisplayBalance = function (account) {
    account.balance = account.transactions.reduce((sum, cur) => sum + cur, 0);
    currentBalanceEl.textContent = setCurrency(
        account.locale,
        account.currency,
        account.balance
    );
    const date = new Date();
    loginDate.textContent = setDate(account, date, true);
};

const calcDisplaySummery = function (account) {
    account.deposits = account.transactions
        .filter(cur => cur > 0)
        .reduce((acc, sum) => acc + sum, 0);
    depositedEl.textContent = setCurrency(
        account.locale,
        account.currency,
        account.deposits
    );

    account.withdrawals = Math.abs(
        account.transactions.filter(cur => cur < 0).reduce((acc, sum) => acc + sum, 0)
    );
    withdrawaledEl.textContent = setCurrency(
        account.locale,
        account.currency,
        account.withdrawals
    );

    account.interests = account.transactions
        .filter(cur => cur > 0)
        .map(cur => (cur * account.interestRate) / 100)
        .filter(cur => cur >= 1)
        .reduce((acc, cur) => acc + cur, 0);
    interestsEl.textContent = setCurrency(
        account.locale,
        account.currency,
        account.interests
    );
};

// create the username for the account
const createUsername = function (account) {
    account.username = account.owner
        .toLowerCase()
        .split(" ")
        .map(name => name[0])
        .join("");
};
accounts.forEach(createUsername);

// search for an account
const searchAccount = function (inputUsername) {
    return accounts.find(account => account.username === inputUsername);
};

// update the UI
const updateUI = function (account, order) {
    displayTransactions(account, order);
    calcDisplayBalance(account);
    calcDisplaySummery(account);
};

// SKIP LOGIN
// userInterface.style.opacity = 1;
// currentAccount = account1;
// updateUI(currentAccount, currentOrder);

// login
btnCheck.addEventListener("click", function (e) {
    // stops the form from reloading the page
    e.preventDefault();
    currentAccount = searchAccount(loginUserEl.value);
    if (currentAccount?.pin === +loginPINEl.value) {
        // display welcome
        welcomeEl.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        // display the page
        userInterface.style.opacity = 1;
        updateUI(currentAccount, currentOrder);
        // clear the username and PIN
        loginUserEl.value = loginPINEl.value = "";
        loginPINEl.blur();
        // WITH DATE
        // const timerTime = new Date(10 * 60 * 1000);
        // const timer = setInterval(() => {
        //     timerTime.setSeconds(timerTime.getSeconds() - 1);
        //     timerEl.textContent = setHourMin(currentAccount.locale, timerTime);
        //     if (timerTime.getMinutes() === 0 && timerTime.getSeconds() === 0) {
        //         clearInterval(timer);
        //         userInterface.style.opacity = 0;
        //     }
        // }, 1000);
        // WITH MATH
        let timerTime = 10*60;
        const timer = setInterval(() => {
            timerEl.textContent = `${tDNum(Math.floor(--timerTime / 60))}:${tDNum(
                timerTime % 60
            )}`;
            if (timerTime === 0) {
                clearInterval(timer);
                userInterface.style.opacity = 0;
            }
        }, 1000);
        // when this is checked the first time it is false, then it is never checked again
        // if (timerTime.getMinutes() === 0 && timerTime.getSeconds() === 0) {
        //     console.log("?");
        //     clearInterval(timer);
        //     userInterface.style.opacity = 0;
        // }
    }
});

// transfer
btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const transferAmount = +transferInputAmount.value;
    const transferAccount = searchAccount(transferInputName.value);
    if (
        transferAccount &&
        transferAmount > 0 &&
        currentAccount.balance >= transferAmount &&
        transferAccount !== currentAccount
    ) {
        transferAccount.transactions.push(transferAmount);
        transferAccount.transactionsDates.push(new Date().toISOString());
        currentAccount.transactions.push(-transferAmount);
        currentAccount.transactionsDates.push(new Date().toISOString());
        updateUI(currentAccount, currentOrder);
    }
    transferInputAmount.value = "";
    transferInputName.value = "";
    transferInputAmount.blur();
});

// get a loan
// this bank will only give a loan when you have a deposit of at least 10% of the loan amount
btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    const loanAmount = Math.floor(loanInput.value);
    loanInput.value = "";
    loanInput.blur();
    const loanTimer = setTimeout(() => {
        currentAccount.transactions.push(loanAmount);
        currentAccount.transactionsDates.push(new Date().toISOString());
        updateUI(currentAccount, currentOrder);
    }, 3000);
    if (
        loanAmount <= 0 ||
        currentAccount.transactions.every(transaction => transaction < loanAmount * 0.1)
    ) {
        clearTimeout(loanTimer);
    }
});

// close account
btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    if (
        currentAccount.username === closeInputUsername.value &&
        currentAccount.pin === +closeInputPIN.value
    ) {
        accounts.splice(
            accounts.findIndex(account => account === currentAccount),
            1
        );
        userInterface.style.opacity = 0;
    }
    closeInputPIN = closeInputUsername = "";
    closeInputPIN.blur();
});

// sort button
btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayTransactions(currentAccount, (currentOrder = !currentOrder));
});
