"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "John Snow",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">2 ${type}</div>
      <div class="movements__value">${movement}₹</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${balance}₹`;
};
calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcomes = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * 1.2) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}₹`;
  labelSumOut.textContent = `${Math.abs(outcomes)}₹`;
  labelSumInterest.textContent = `${interest}₹`;
};
calcDisplaySummary(account1.movements);

const deposits = account1.movements.filter((movement) => movement > 0);
const withdrawals = account1.movements.filter((movement) => movement < 0);

// console.log(account1.movements, deposits, withdrawals);

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createUsername(accounts);

///////////////////////////////////////////////////////////////////////

//* CHALLENGE #1

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, 3);
//   const dogsAll = dogsJuliaCorrected.concat(dogsKate);
//   dogsAll.forEach(function (dogAge, i) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         dogAge >= 3 ? `an adult and is ${dogAge} years old` : `still a puppy 🐶`
//       }`
//     );
//   });
// };

// checkDogs(dogsJulia, dogsKate);

//? Finding max using reduce (NOTE - accumulator should be assigned to 1st value of array to avoid errors)

// const max = account1.movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   account1.movements[0]
// );
// console.log(max);

//* CHALLENGE #2

// const calcAverageHumanAge = function (dogAges) {
//   const filteredHumanAge = dogAges
//     .map((age) => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter((age) => age >= 18);
//   const avgHumanAge =
//     filteredHumanAge.reduce((acc, age) => acc + age, 0) /
//     filteredHumanAge.length;
//   console.log(avgHumanAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
