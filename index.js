'use strict';

const calc = require('./integralCalculator');
const prl = require('./parallel');

const range = [2, 3];
const step1 = 0.001, step2 = 0.0001, step3 = 0.01;

const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));
const antiderivative = (x) => Math.sqrt(Math.pow(x, 2) + 9) + 9 / Math.sqrt(Math.pow(x, 2) + 9);

const antider = antiderivative(3)-antiderivative(2);
const sequential = [calc.findIntegral(step1, range, func), calc.findIntegral(step2, range, func)];
let parallel = [];

prl.parallelCalculator(step1, range, func, 20).then(value => {
    parallel[0] = value;
}).then(v => {
    prl.parallelCalculator(step2, range, func, 5).then(value => {
        parallel[1] = value;
    }).then( v => {
        console.log("CALCULATION RESULTS:");
        console.log('FROM ANTIDERIVATIVE:               ', antider);
        console.log(`RESULT SEQUENTIAL (step = ${step1}):  `, sequential[0], ` Diff: ${Math.abs(antider - sequential[0]).toFixed(10)}`);
        console.log(`RESULT SEQUENTIAL (step = ${step2}): `, sequential[1], `Diff: ${Math.abs(antider - sequential[1]).toFixed(10)}`);
        console.log(`RESULT PARALLEL (step = ${step1}):    `, parallel[0], ` Diff: ${Math.abs(antider - parallel[0]).toFixed(10)}`);
        console.log(`RESULT PARALLEL (step = ${step2}):   `, parallel[1], `Diff: ${Math.abs(antider - parallel[1]).toFixed(10)}`);


    });
});
