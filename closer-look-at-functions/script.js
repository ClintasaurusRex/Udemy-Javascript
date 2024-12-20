'use strict';

//////////////////////////////// The call and apply methods
const lufthanasa = {
  airline: 'Lufthanasa',
  iataCode: 'LH',
  bookings: [],
  book: function (flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}-${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthanasa.book(239, 'Clint Hiles');
lufthanasa.book(456, 'Jonas Smedthman');
console.log(lufthanasa.bookings);

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};

const book = lufthanasa.book; // taking the book function from luftanasa and placing it inside a variable for use
// book(12, 'Steben choip'); // doesnt work because it doesnt have access to the this..

book.call(eurowings, 23, 'Jackie Q');
console.log(eurowings.bookings);

book.call(lufthanasa, 239, 'Mary Cooper');
console.log(lufthanasa.bookings);

const swiss = {
  airline: 'Swiss Air Lines',
  iataCode: 'LX',
  bookings: [],
};

book.call(swiss, 583, 'Mary Cooper');
console.log(swiss.bookings);

// Apply Method

const flightData = [583, 'George Cooper'];
book.apply(swiss, flightData);
console.log(swiss.bookings);

book.call(swiss, ...flightData); // this is the same as: book.apply(swiss, flightData);
console.log(swiss.bookings);

////////////////////////////////// Bind method
// this wont return the function it will return a new function
// This code creates a new function by using the bind method on the book function, setting it to always use eurowings as its this context.

// The purpose of this code is to create a permanent connection between the book function and the eurowings object. Think of it like creating a dedicated booking function specifically for Eurowings airline

const bookEW = book.bind(eurowings);
const bookLH = book.bind(lufthanasa);
const bookLS = book.bind(swiss);
bookEW(23, 'Steven Williams');

const bookEW23 = book.bind(eurowings, 23); // this allows us too change things as needed
bookEW23('Clinton Arneson-Hiles');
bookEW23('Martha Cooper');

// With Event Listeners

lufthanasa.planes = 300;
lufthanasa.buyPlane = function () {
  console.log(this);

  this.planes++;
  console.log(this.planes);
};

document
  .querySelector('.buy')
  .addEventListener('click', lufthanasa.buyPlane.bind(lufthanasa));

// Partial Application

const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

const addVAT = addTax.bind(null, 0.23);
// const addTax = (rate, value) => value + value * rate; < this is what this func is doing meow

console.log(addVAT(100));

const addTaxRate = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};

const VAT2 = addTaxRate(0.23);
console.log(VAT2(100));

///////////////////// Functions returning functions
/*
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};

const greeterHey = greet('Hey');
greeterHey('Clint');
greeterHey('Steven');

greet('Hello')('Jonas');

// Challenge

const greetArr = greeting => name => console.log(`${greeting} ${name}`);

greetArr('Hi')('You');
/*
///////////////////// Functions accepting callback functions
/*
const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase();
};

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

// Higher order function because it takes in a function fn
const transformer = function (str, fn) {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);

  console.log(`Transformed by: ${fn.name}`);
};

transformer('Javascript is the best', upperFirstWord);
transformer('Javascript is the best', oneWord);

// JS uses callbacks all the time
const high5 = function () {
  console.log('High Five 🖐️');
};
document.body.addEventListener('click', high5);
['Jonas', 'Martha', 'Adam'].forEach(high5);
*/
//////////////////////// First class and High order functions
//                                   FIRST CLASS FUNCTIONS
// JS treats functions as first-class citizens
// This means that functions are simply values
// Functions are just another type of object
// Store functions in variables or properties
// Pass functions as arguments to OTHER functions
// Return functions FROM functions
// Call methods on functions

//                                  HIGHER ORDER FUNCTIONS

// A function that receives another functions as an argument, that returns a new functions or both
// This is only possible because of first-class functions

///////////////////////// How passing arguments wors: Value vs Reference
/*
const flight = 'LH234';
const clint = {
  name: 'Clint Arneson-Hiles',
  passport: 3930293945,
};

const checkIn = function (flightNum, passenger) {
  flightNum = 'Lh999';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 3930293945) {
    alert('Checked in');
  } else {
    alert('Wrong passport');
  }
};
// checkIn(flight, clint);
// console.log(flight);
// console.log(clint);

const newPassport = function (person) {
  person.passport = Math.trunc(Math.random() * 10000000000);
};

newPassport(clint);
checkIn(flight, clint);
*/
///////////////////////////// Default Values
/*
const bookings = [];

const createBooking = function (
  flightNum,
  numOfPassengers = 1,
  price = 199 * numOfPassengers
) {
  // numOfPassengers = numOfPassengers || 1; ES5 way, ugly
  // price = price | 199;

  const booking = {
    flightNum,
    numOfPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH123', 2, 800);
createBooking('LH123', 2);
createBooking('LH123', 5);
createBooking('LH123', undefined, 1000); // {flightNum: 'LH123', numOfPassengers: 1, price: 1000}
*/
/*
for (const booking of bookings) {
  // console.log(booking.flightNum, booking.numOfPassengers, booking.price);
  console.log(
    `Flight:${booking.flightNum} has ${booking.numOfPassengers} passengers. $${booking.price}`
  );
}
for (const [key, value] of Object.entries(bookings[0])) {
  console.log(key, ':', value);
}
*/
