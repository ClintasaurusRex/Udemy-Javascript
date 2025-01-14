'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${
      index + 1
    }  ${type}</div>          
          <div class="movements__value"> ${movement}€ </div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

/////////////////////////////////////////////////

/////////////////////////// Reducer //////////////////////////////////////////
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance} €`;
};
// calcDisplayBalence(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`; // 5020€

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`; // 1180€

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr); // [2.4, 5.4, 36, 0.84, 15.6]
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`; // 59.4€
};
// calcDisplaySummary(account1.movements);

//////////////////////////////////////////// Compute usernames //////////////////////////////////////////////////

const user = 'Steven Thomas Williams'; // stw

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0]) // This returns an array with letters at index 0 (awesome)
//     .join(''); // stw
//   return username;
// };
// console.log(createUsernames(accounts)); // stw

createUsernames(accounts);
// console.log(accounts);

/////////////////////////////////////////////// EVENT HANDLER /////////////////////////

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  // Optional chaining, This will only look for the right pin IF the account exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('LOGIN');
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('REQUESTED');

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ADD movement
    currentAccount.movements.push(amount);

    // Update UI

    updateUI(currentAccount);
    console.log(amount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (!receiverAcc) {
    alert('The account your trying to transfer to does not exist');
  }

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  console.log(amount, receiverAcc);
});

////////////////////////// The findIndex Method ///////////////////////
// This method will ONLY return the index of the element in the array

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('DELETE');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    // Delete accout
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginPin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];
/*
// SLICE
console.log(arr.slice(2)); // ['c', 'd', 'e']
console.log(arr.slice(2, 4)); // ['c', 'd'] the 4 tells js where to stop
console.log(arr.slice(-2)); // ['d', 'e']
console.log(arr.slice(-1)); // ['e']
console.log(arr.slice(1, -2)); // ['b', 'c']
console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e']
console.log([...arr]); // ['a', 'b', 'c', 'd', 'e']

// SPLICE - this mutates the original array
// console.log(arr.splice(2)); // ['c', 'd', 'e']
arr.splice(-1);
arr.splice(1, 2); // The second argument is how many elements we want to delete
console.log(arr); // ['a', 'b', 'c', 'd']
// REVERSE --  This mutates the original array as well
let arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse()); // ['f', 'g', 'h', 'i', 'j']
console.log(arr2);

// CONCAT - Joins two arrays together and returns a new array without mutating the original array
const letters = arr.concat(arr2);
console.log(letters); // ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
console.log([...arr, ...arr2]); // same result - store in a variable if needed

// JOIN - Joins all elements of an array into a string and returns the string without mutating the original array
console.log(letters.join(' - ')); // a - b - c - d - e - f - g - h - i - j

/////////////////////////////////////////////////////////////////////////////////

// NEW at() METHOD - returns the element at the specified index in the array without mutating the original array
const arr = [23, 11, 64];
console.log(arr[0]); // 23
console.log(arr.at(0)); // 23

// Getting the last element
console.log(arr[arr.length - 1]); // 64 - always subtract 1 from the length
console.log(arr.slice(-1)); // [64] - copies the array with only the last number
console.log(arr.at(-1)); // 64

console.log('Clint'.at(0)); // C


////////////////////////////////////////////////////////////////

// The forEach Method - This is a method that is used to iterate over an array and perform a function on each element in the array. It is a higher order function.

// Continue and Break functions dont work with forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited: $${movement}`);
  } else {
    console.log(`You withdrew: $${Math.abs(movement)}`);
}
}
console.log('------------------- forEACH -------------------------');

movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited: $${movement}`);
  } else {
    console.log(`You withdrew: $${Math.abs(movement)}`);
}
});
// You deposited: $200
// You deposited: $450
// You withdrew: $400 ... and so on and so on

console.log(
  '----------------------- Counter entries -----------------------------------'
);
// // .entries() returns an array of [key, value] pairs, allowing us to destructure both the index and movement values in the for...of loop

for (const [index, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited: $${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew: $${Math.abs(movement)}`);
  }
}

console.log('-------------- forEach with counter ----------------------------');
// First param ALWAYS needs to be current element
// Second will ALWAYS be the index
// Third will ALWAYS be the entire array we are looping over

movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited: $${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew: $${Math.abs(movement)}`);
  }
});


//////////////////////////////////////////////////////////////////////////

// forEach with maps and sets

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// USD: United States dollar
// EUR: Euro
// GBP: Pound sterling

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`); // Set(3) {'USD', 'GBP', 'EUR'}
});

// SET -- dont have keys or indexs so dont try to get em
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${_}: ${value}`);
});

*/
//////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

adult over 3 years and puppy under

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // dogsJulia.slice(1,3)
  
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  
  console.log(dogs);
  
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is and adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
  }
});
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log('----------------------- TEST 2 --------------------------');
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const nums = [1, 4, 3, 2, 5];

console.log(nums.map(num => num * 2));
console.log(nums.filter(num => num > 2));
console.log(nums.reduce((acc, curr) => acc + curr, 0));

///////////////////////////////////////////////////////////////////

// The Map method is a method that takes an array and transforms it into a new array. It takes a callback function as an argument and applies that callback function to each element in the array. The callback function can take up to three arguments: the current element, the index of the current element, and the array itself. The callback function returns the new value for the current element in the new array.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// Without arrow function
// const movementsUSD = movements.map(function (movement) {
//   return (movement * eurToUsd).toFixed(2);
// });
  
// With arrow function
const movementsUSDarrow = movements.map(movement => movement * eurToUsd);
  
console.log(movements);
console.log('arrow', movementsUSDarrow);
  
const movementUSDfor = [];
for (const mov of movements) movementUSDfor.push(mov * eurToUsd);
console.log(movementUSDfor);
  
const movmentDescriptions = movements.map((mov, i, arr) => {
    // With ternary operator
//   return `Movement ${i + 1}: You ${
//     mov > 0 ? 'deposited' : 'withdrew'
//   } $${Math.abs(mov)}`;
//   
//   // Without ternary operator
//   // if (mov > 0) {
//     //   return `Movement ${i + 1}: You deposited $${mov}`;
//     // } else {
//       //   return `Movement ${i + 1}: You withdrew $${Math.abs(mov)}`;
//       // }
//     });
//     console.log(movmentDescriptions);
//     
//     // movementsUSD.forEach(converted =>
//       //   console.log(`The coverted amount is $${converted}`)
//       // );
//       
//       // The filter method is a method that takes an array and returns a new array with only the elements that pass a certain condition. It takes a callback function as an argument and applies that callback function to each element in the array. The callback function can take up to three arguments: the current element, the index of the current element, and the array itself. The callback function returns a boolean value that determines whether the current element should be included in the new array.
  //       const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
  //       
  //       const deposits = movements.filter(function (movement, index) {
  //         return movement > 0;
  //       });
        console.log(movements);
        console.log(deposits);
        
        const depositFor = [];
        for (const mov of movements) if (mov > 0) depositFor.push(mov);
        console.log(depositFor);
        
        const withdrawls = movements.filter(mov => mov < 0);
        // .forEach(withdrawl => console.log(`You withdrew ${withdrawl}`));
        console.log(withdrawls);
        
        
        // The reduce method is a method that takes an array and reduces it to a single value. It takes a callback function as an argument and applies that callback function to each element in the array. The callback function can take up to four arguments: the accumulator, the current element, the index of the current element, and the array itself. The callback function returns the new value for the accumulator. The reduce method can also take an optional initial value for the accumulator.
        const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
        
        // Accumulator -> Snowball
        const balence = movements.reduce(function (acc, cur, i, arr) {
          console.log(`Iteration ${i}: ${acc}`);
          const total = acc + cur;
          return total;
        }, 0);
        console.log(balence); // 3840
        
        // In arrow function
        const balenceArrow = movements.reduce((acc, cur) => acc + cur, 0);
        console.log('Arrow function:', balenceArrow);
        
        let balence2 = 0;
        for (const mov of movements) balence2 += mov;
        console.log(balence2);
        
        // Maximum value of the movements array
        
        const max = movements.reduce((acc, mov) => {
          if (acc > mov) {
            return acc;
          } else {
            return mov;
        }
      }, movements[0]);
      console.log(max); // 3000
      
      // Coding Challenge #2
      
      /* 
      Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
      
      Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
      
      1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
      2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
      3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
      4. Run the function for both test datasets
      
      TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
      TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
      
      GOOD LUCK 😀
      */
/*
     const calcAverageHumanAge = function (ages) {
       const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
       const adults = humanAges.filter(age => age >= 18);
       // console.log(humanAges);
       // console.log(adults);
       
       const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
       return average;
      };
      const arr1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
      const arr2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
      console.log(arr1, arr2);
      
      /////////////////// Chaining Methods /////////////////////////////////////
      
      const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
      const eurToUsd = 1.1;
      
      // PIPELINE
      const totalDepositsUSD = movements
      .filter(mov => mov > 0)
      .map((mov, i, arr) => {
        // console.log(arr); // [200, 450, 3000, 70, 1300]
        return mov * eurToUsd;
      })
      // .map(mov => mov * eurToUsd)
      .reduce((acc, mov) => acc + mov, 0);
      console.log(Math.trunc(totalDepositsUSD)); // 5522
      
      ////////////////////////// Coding Challenge 3 ////////////////////////////////////
      
      const calcAverageHumanAge = ages =>
        ages
      .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
      .filter(age => age >= 18)
      .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
      
      const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
      const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
      console.log(avg1, avg2);
      
      
      //////////////// Find Method ///////////////////////
      
      // Used to retrieve one element of an array based on an condition
      const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
      
      // returns first element that satisfies the condition
      const firstWithdrawl = movements.find(mov => mov < 0);
      console.log(movements);
      console.log(firstWithdrawl);
      
      console.log(accounts);
      
      let account = accounts.find(acc => (acc.owner = 'Jessica Davis'));
      
      
      /////////////////////// ///////////////////////////////////////////////////////////
      // The new findLast and findLastIndex Methods
      // the finndLast method is the opposite of the find method. It returns the last element that satisfies the condition
      // The findLastIndex method is the opposite of the findIndex method. It returns the index of the last element that satisfies the condition
      
      const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
      console.log(movements);
      const lastWithdrawal = movements.findLast(mov => mov < 0);
      console.log(lastWithdrawal); // -130
      
      const latestLargeMovementIndex = movements.findLastIndex(mov => mov > 2000);
      console.log(
        `Your lastest large movement was ${
          movements.length - latestLargeMovementIndex
        } movements ago`
      ); // Your lastest large movement was 7 movements ago
      

///////////////////////////////////////////////////////////////////////////////////
// some AND every METHOD

// some method checks if at least one element in the array satisfies the condition
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY
// only returns true if every elements in the array satisfies the condition
console.log(movements.every(mov => mov > 0)); // false
console.log(account4.movements.every(mov => mov > 0)); // true

// Seperate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit)); // true
console.log(movements.every(deposit)); // false
console.log(movements.filter(deposit)); //  [200, 450, 3000, 70, 1300]


//////////////////////////////////////////////////////////////////////////////////////
// Flat and FlatMap ***********************

// The flat method is used to flatten an array of arrays into a single array. It is used to flatten an array of arrays into a single array.

// The flatMap method is used to flatten an array of arrays into a single array. It is used to flatten an array of arrays into a single array.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log(arr.flat()); // [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); // The 2 in this map tells js to go 2 levels deep into the array

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, cur) => acc + cur, 0);

// flat Method
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);

// flatMap method
const overallBalance2 = accounts
  .flatMap(acc => acc.movements) // Same result as about - flatMap can only go one level deep
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);
*/
///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:


const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

console.table(breeds);

const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('fetch') && breed.activities.includes('running')
).breed;
console.log(dogBothActivities);

const allActivities = breeds.flatMap(breed => breed.activities.flat());
console.log(allActivities);

const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming')) // looks for the dogs that like swimming
      .flatMap(breed => breed.activities) // Shows the other activities they like
      .filter(activity => activity !== 'swimming') // Takes swimming out of the other activities they loke
  ),
];
console.log(swimmingAdjacent);

// 6.
console.log(breeds.every(breed => breed.averageWeight > 10));

// 7.
console.log(breeds.some(breed => breed.activities.length >= 3));

// BONUS
const fetchWeights = breeds
  .filter(breed => breed.activities.includes('fetch'))
  .map(breed => breed.averageWeight);
const heaviestFetchBreed = Math.max(...fetchWeights);

console.log(fetchWeights);
console.log(heaviestFetchBreed);

///////////////////////////////////////////////////////////////////////////////

// Sorting arrays
// sortting arrays is not a good idea with numbers because it will sort the numbers as strings
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

console.log(owners.sort()); // This mutates the original array BE CAREFUL
console.log(owners);

// numbers
console.log(movements);

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);
// Ascending order
const sorted1 = movements.sort((a, b) => a - b);
console.log(sorted); //[-650, -400, -130, 70, 200, 450, 1300, 3000]

// Descending order

// console.log(movements.sort((a, b) => b - a)); // [3000, 1300, 450, 200, 70, -130, -400, -650]


///////////////////////////////////////////////////////////////////////////////

// Array Grouping: Grouping data based on some criteria and then performing operations on that data. This is useful for analyzing and summarizing data.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// groupBy() works like the groupBy() function in SQL databases. It takes an array of objects and a key, and returns an object where the keys are the unique values of the specified key, and the values are arrays of objects that have that key-value pair. example: groupBy(movements, 'type');

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawal'
); // {deposits: Array(5), withdrawal: Array(3)}

console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';

  if (movementCount >= 4) return 'active';

  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});
console.log(groupedByActivity); // {very active: Array(3), active: Array(1)}

// const groupedByType = Object.groupBy(accounts, acc => acc.type);
const groupedByType = Object.groupBy(accounts, ({ type }) => type); // with destructing
console.log(groupedByType); // {premium: Array(2), standard: Array(1), basic: Array(1)}


//////////////////////////////////////////////////////////////////////
/// More ways of creating and filling arrays

const arr = [1, 2, 3, 4, 5, 6, 7];

// Empty arrays + fill method
const x = new Array(7);
console.log(x);

// x.fill(1);
x.fill(1, 3, 5); // [empty × 3, 1, 1, empty × 2]
console.log(x);

arr.fill(23, 4, 6);
console.log(arr); // [1, 2, 3, 4, 23, 23, 7] mutates original array

// Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y); // [1, 1, 1, 1, 1, 1, 1]

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z); // [1, 2, 3, 4, 5, 6, 7] use _ where cur goes as its a throw away parameter

const randomDiceRoll = Array.from(
  { length: 10 },
  cur => Math.trunc(Math.random(cur) * 20) + 1
);
console.log(randomDiceRoll); // [5, 5, 5, 1, 2, 6, 6, 5, 1, 3]

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI); // [1300, 70, -130, -650, 3000, -400, 450, 200]

  // const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  // console.log(movementsUI2);
});

const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
console.log(numbers); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

//////////////////////////////////////////////////////////////////////////

// Non- Destructive alternatives toReversed, toSorted, toSpliced

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements); // [200, 450, -400, 3000, -650, -130, 70, 1300]

// reversed method is destructive so if a slice method is in front of it the original will be untouched

// toReversed method
const reversedMovements = movements.toReversed();
console.log(reversedMovements);

// toSorted Mehtod (sort), toSpliced (splice)

// movements[1] = 2000;
const newMovements = movements.with(1, 2000);
console.log(newMovements);
// console.log(movements); // [200, 2000, -400, 3000, -650, -130, 70, 1300]

///////////////////////////////////////////////////////////////////////////////////

// 1.
// Array Methods practice
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);

console.log(bankDepositSum);

// 2.
// How many deposits have been with at least 1000

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

// Prefix operator
let a = 10;
console.log(++a);

// 3. Creating an object with reduce

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);

      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals); // {deposits: 25180, withdrawals: -7340}

// 4. Create a simple function to convert a string to a titleCase

// This is a nice title => This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');

  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not to long'));
console.log(convertTitleCase('and here is another title with and EXAMPLE'));
*/

// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/

// - Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recFood = Math.floor(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
  `Sarah's dog eats too ${
    sarahDog.curFood > sarahDog.recFood ? 'much' : 'little'
  }`
);

// 3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).

const ownersTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
const ownersTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersTooMuch);
console.log(ownersTooLittle);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersTooMuch.join(' and ')}'s dogs are eating to much`);
console.log(`${ownersTooLittle.join(' and ')}'s dogs are eating to little`);

// 5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)

console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
const checkIfOk = dog =>
  dog.curFood < dog.recFood * 1.1 && dog.curFood > dog.recFood * 0.9;
console.log(dogs.every(checkIfOk));

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
const dogsEatOk = dogs.filter(checkIfOk);
console.log(dogsEatOk);

// 8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating

const groupByTooMuchTooLittle = Object.groupBy(dogs, dog => {
  if (dog.curFood > dog.recFood) {
    return 'Too Much';
  } else if (dog.curFood < dog.recFood) {
    return 'Too little';
  } else {
    return 'exact';
  }
});
console.log(groupByTooMuchTooLittle);

// 9. Group the dogs by the number of owners they have
const groupByNumOfOwners = Object.groupBy(
  dogs,
  dog => `${dog.owners.length} - owners`
);
console.log(groupByNumOfOwners);

//0. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

const dogsSorted = dogs.toSorted((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
