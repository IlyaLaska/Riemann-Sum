//TODO How to change threadcount from index.js?
//TODO Probable have to replace __filename for workers with string of code
'use strict';

const calc = require('./integralCalculator');
const parallel = require('./parallel');

const range = [2, 3];
const step1 = 0.001, step2 = 0.0001;

const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));
const antiderivative = (x) => Math.sqrt(Math.pow(x, 2) + 9) + 9 / Math.sqrt(Math.pow(x, 2) + 9);

console.log("RESULT SEQUENTIAL 1: ", calc.findIntegral(step1, range, func));
console.log("RESULT SEQUENTIAL 2: ", calc.findIntegral(step2, range, func));
parallel.parallelCalculator(step1, range, func, 10).then(value => {
    console.log("RESULT PARALLEL 1: ", value);
})