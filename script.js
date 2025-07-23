"use strict";
// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: "Jessica Davis",
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Steven Thomas Williams",
    transactions: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Sarah Smith",
    transactions: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// select all the needed DOM elements
const [loginUserEl, loginPINEl] = document.querySelectorAll(".login-input");
const transactionsEl = document.querySelector(".transactions");
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

const btnCheck = document.querySelector(".btn-check");
const btnTransfer = document.querySelector(".btn-transfer");
const btnLoan = document.querySelector(".btn-loan");
const btnClose = document.querySelector(".btn-close");

// display the transactions of the account
const displayTransactions = function (transactions) {
    transactionsEl.innerHTML = "";
    transactions.forEach(function (transaction, i) {
        const type = transaction > 0 ? "deposit" : "withdrawal";
        const transactionRow = `
            <div class="transaction">
                <p class="transaction-state transaction-state-${type}">${
            i + 1
        } ${type}</p>
                <p class="transaction-date">later</p>
                <p class="transaction-amount">${transaction}€</p>
            </div>
        `;
        console.log(transactionRow);
        transactionsEl.insertAdjacentHTML("afterbegin", transactionRow);
    });
};

// calculation and display the current balance
const calcDisplayBalance = function (account) {
    account.balance = account.transactions.reduce((sum, cur) => sum + cur, 0);
    currentBalanceEl.textContent = `${account.balance}€`;
};

const calcDisplaySummery = function (account) {
    account.deposits = account.transactions
        .filter((cur) => cur > 0)
        .reduce((acc, sum) => acc + sum, 0);
    depositedEl.textContent = account.deposits + "€";

    account.withdrawals = Math.abs(
        account.transactions.filter((cur) => cur < 0).reduce((acc, sum) => acc + sum, 0)
    );
    withdrawaledEl.textContent = account.withdrawals + "€";

    account.interests = account.transactions
        .filter((cur) => cur > 0)
        .map((cur) => (cur * account.interestRate) / 100)
        .filter((cur) => cur >= 1)
        .reduce((acc, cur) => acc + cur, 0);
    interestsEl.textContent = account.interests + "€";
};

// create the username for the account
const createUsername = function (account) {
    account.username = account.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
};
accounts.forEach(createUsername);

// search for an account
const searchAccount = function (inputUsername) {
    return accounts.find((account) => account.username === inputUsername);
};

// update the UI
const updateUI = function (account) {
    displayTransactions(account.transactions);
    calcDisplayBalance(account);
    calcDisplaySummery(account);
};

// login
let currentAccount;
btnCheck.addEventListener("click", function (e) {
    // stops the form from reloading the page
    e.preventDefault();
    console.log(loginUserEl.value);
    currentAccount = searchAccount(loginUserEl.value);
    console.log(currentAccount);
    if (currentAccount?.pin === Number(loginPINEl.value)) {
        console.log("hi");
        // display welcome
        welcomeEl.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        // display the page
        userInterface.style.opacity = 1;
        updateUI(currentAccount);
        // clear the username and PIN
        loginUserEl.value = loginPINEl.value = "";
        loginPINEl.blur();
    }
});

// transfer
btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const transferAmount = Number(transferInputAmount.value);
    const transferAccount = searchAccount(transferInputName.value);
    if (
        transferAccount &&
        transferAmount > 0 &&
        currentAccount.balance >= transferAmount &&
        transferAccount !== currentAccount
    ) {
        transferAccount.transactions.push(transferAmount);
        currentAccount.transactions.push(-transferAmount);
        updateUI(currentAccount);
    }
    transferInputAmount.value = "";
    transferInputName.value = "";
    transferInputAmount.blur();
});
