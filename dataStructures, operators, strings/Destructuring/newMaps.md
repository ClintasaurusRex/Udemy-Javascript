```js
/////////////////////////// MAPS

const rest = new Map();
rest.set('name', 'Classico Italiano');
rest.set(1, 'Firenze, Italy');
console.log(rest.set(2, 'Lisbon, Portugal'));

rest
  .set('categories', ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'])
  .set('open', 11)
  .set('close', 23)
  .set(true, 'We are open')
  .set(false, 'We are closed');

// Use .get() to retreive data
console.log(rest.get('name')); // Classico Italiano
console.log(rest.get(true)); // We are open

const time = 8;
const isOpen = rest.get(time > rest.get('open') && time < rest.get('close'));
console.log(isOpen); // We are closed

console.log(rest.has('categories'));
rest.delete(2);
// rest.clear();
const arr = [1, 2];
rest.set(arr, 'Test'); // you can use and array as a key
rest.set(document.querySelector('h1'), 'Heading');
console.log(rest); // Lisbon has a key of 2 which was selected and deleted
console.log(rest.size); // 7 items

console.log(rest.get(arr));

//////////////////////////// MAPS iteration

const question = new Map([
  ['question', 'What is the best programming language in the world?'],
  [1, 'C'],
  [2, 'Java'],
  [3, 'Javascript'],
  ['correct', 3],
  [true, 'Correct :)'],
  [false, 'Try again'],
]);
console.log(question);

// convert object to map
console.log(Object.entries(openingHours));
const hoursMap = new Map(Object.entries(openingHours));
console.log(hoursMap);

// Quiz app
console.log(question.get('question'));

for (const [key, value] of question) {
  if (typeof key === 'number') console.log(`Answer ${key}: ${value}`);
}

// const answer = Number(prompt('Your answer'));
const answer = 3;
console.log(answer);

console.log(question.get(question.get('correct') === answer));

// Convert map to array
console.log([...question]);
// console.log(question.entries());
console.log(...question.keys());
console.log(...question.values());
```
