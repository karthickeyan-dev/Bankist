"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: "John Snow",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
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

const accounts = [account1, account2];

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

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${movement.toFixed(2)}₹</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${acc.balance.toFixed(2)}₹`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}₹`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}₹`;
  labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
};

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);
  //Display Balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
};

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

//Login function

let currentAcc;

btnLogin.addEventListener("click", function (e) {
  //To prevent form from submitting and reloading the page
  e.preventDefault();
  currentAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome Back, ${
      currentAcc.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
    //Update UI
    updateUI(currentAcc);
  }
});

//Transfer Money

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc, currentAcc);
  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAcc);
    //Clear input fields
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();
  }
});

//Request Loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAcc.movements.some((mov) => mov >= 0.1 * loanAmount)
  ) {
    //Add Loan amount to movement
    currentAcc.movements.push(loanAmount);
    //Clear input fields
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    // Update UI
    updateUI(currentAcc);
  }
});

//Close Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAcc.username
    );
    accounts.splice(index, 1);
    //Clear input fields
    inputCloseUsername.value = inputClosePin.value = "";
    inputCloseUsername.blur();
    inputClosePin.blur();
    //Hide UI
    containerApp.style.opacity = 0;
  }
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAcc, sorted);
});
///////////////////////////////////////////////////////////////////////

//// CHALLENGE #1

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

//// Finding max using reduce (NOTE - accumulator should be assigned to 1st value of array to avoid errors)

// const max = account1.movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   account1.movements[0]
// );
// console.log(max);

//// CHALLENGE #2

// const calcAverageHumanAge = function (dogAges) {
//   const avgHumanAge = dogAges
//     .map((age) => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   console.log(avgHumanAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const totalDeposits = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);

// // const totalDeposits = accounts.reduce(
// //   (acc, account) =>
// //     acc +
// //     account.movements.reduce((acc, mov) => (mov > 0 ? acc + mov : acc), 0),
// //   0
// // );

// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => (mov >= 1000 ? ++acc : acc), 0);

// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (acc, mov) => {
//       // mov > 0 ? (acc.deposits += mov) : (acc.withdrawals += mov);
//       acc[mov > 0 ? "deposits" : "withdrawals"] += mov;
//       return acc;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(totalDeposits);
// console.log(numDeposits1000);
// console.log(deposits, withdrawals);

// const convertTitleCase = function (title) {
//   const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];
//   return title
//     .toLowerCase()
//     .split(" ")
//     .map((word, i) =>
//       exceptions.includes(word) && i !== 0
//         ? word
//         : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(" ");
// };

// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("and here is another TITLE with ANOther examPLE"));

//// CHALLENGE #4

// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];

// dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// dogs.forEach(
//   (dog) =>
//     (dog.withinLimit =
//       dog.curFood > 0.9 * dog.recFood && dog.curFood < 1.1 * dog.recFood
//         ? true
//         : false)
// );

// console.log(dogs);

// dogs.forEach((dog) => {
//   if (dog.owners.includes("Sarah")) {
//     console.log(
//       `${
//         dog.withinLimit
//           ? "Eating within recommended limit"
//           : "Not eating within the recommended limit"
//       }`
//     );
//   }
// });

// const ownersEatTooMuch = dogs
//   .filter((dog) => dog.curFood > dog.recFood)
//   .flatMap((dog) => dog.owners);

// const ownersEatTooLittle = dogs
//   .filter((dog) => dog.curFood < dog.recFood)
//   .flatMap((dog) => dog.owners);

// console.log(ownersEatTooMuch, ownersEatTooLittle);

// console.log(
//   `${ownersEatTooMuch.join(" and ").concat("'s")} dogs eat too much!`
// );
// console.log(`${ownersEatTooLittle.join(" and ")}'s dogs eat too little!`);

// console.log(dogs.some((dog) => dog.curFood === dog.recFood));
// console.log(dogs.some((dog) => dog.withinLimit));

// console.log(dogs.filter((dog) => dog.withinLimit));

// console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));

// const randomInt = (max, min) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// console.log(randomInt(0, 10));
