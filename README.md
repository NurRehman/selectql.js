# SelectQL.js

SelectQL.js is inspired by Structured Query Language (SQL) for accessing and manipulating Objects in an easy and familiar way. It supports complex **Objects** and **Arrays** using Builder Design Pattern.

## Install

`npm install selectql.js --save`

## Usage
You may use Arrays or Objects to select and manipulate in well known SQL like syntax that uses builder patterns.

` 
const { SelectQL, Operators } = require('selectql.js');

let cities = [
  { name: 'Los Angeles', population: 3792621, winner: 5 },
  { name: 'New York', population: 8175133, winner: 4 },
  { name: 'Chicago', population: 2695598, winner: 8 },
  { name: 'Houston', population: 2099451, winner: 9 },
  { name: 'Philadelphia', population: 1526006, winner: 1 },
];`

`let denver = [{ name: 'Denver', population: 715522, winner: 8 }];

Enum should be followed in order to properly chain the functions.

enum Operators {
        EQUAL = '==',
        NOT_EQUAL = '!=',
        GREATER_THAN = '>',
        GREATER_EQUAL = '>=',
        LESS_THEN = '<',
        LESS_THEN_EQUAL = '<=',
}

let selectQl = new SelectQL(cities)
  .where('name', Operators.NOT_EQUAL, 'New York') // Will filter to make sure 'New York' should filtered
  .and('population', Operators.LESS_THEN, '5526006') // Will filtered the population less than 5526006
  .and('winner', Operators.GREATER_EQUAL, 15) // will only return if winner value more than 15
  .ifEmptyThen(denver) // if everything is empty, client can provide default object like array
  .build();
  
  console.log(selectQl, 'sq'); // Will returned denver array
  `


Working DEMO: https://typescript-a3w8i1.stackblitz.io


