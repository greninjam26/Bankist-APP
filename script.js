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
const btnCheck = document.querySelector(".btn-check");
const transactionsEl = document.querySelector(".transactions");
const currentBalanceEl = document.querySelector('.current-balance');

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
                <p class="transaction-amount">${transaction} €</p>
            </div>
        `;
        console.log(transactionRow);
        transactionsEl.insertAdjacentHTML("afterbegin", transactionRow);
    });
};
displayTransactions(account1.transactions);

// calculation and display the current balance
const calcDisplayBalance = function (account) {
    account.balance = account.transactions.reduce((sum, cur) => sum+cur, 0);
    currentBalanceEl.textContent = account.balance + "€";
}
calcDisplayBalance(accounts[0]);

// create the username for the account
const createUsername = function (account) {
    account.username = account.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
};
accounts.forEach(createUsername);

btnCheck.addEventListener("click", function () {
    console.log(loginUserEl.value);
    console.log(loginPINEl.value);
});
