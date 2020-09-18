'use strict';

const calc = require('./integralCalculator');
const prl = require('./parallel');

const range = [2, 3];
const step1 = 0.001, step2 = 0.0001;
const threads1 = 5, threads2 = 20;

const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));
const antiderivative = (x) => Math.sqrt(Math.pow(x, 2) + 9) + 9 / Math.sqrt(Math.pow(x, 2) + 9);

const antider = antiderivative(3) - antiderivative(2);
let sequential = [calc.findIntegral(step2, range, func)];
let seqTimes = [[], []];
let parTimes = [[[], []], [[], []]];
let parallel = [];

seqTimes[0][0] = process.hrtime();
sequential[0] = calc.findIntegral(step1, range, func);
seqTimes[0][1] = process.hrtime(seqTimes[0][0]);

seqTimes[1][0] = process.hrtime();
sequential[1] = calc.findIntegral(step2, range, func);
seqTimes[1][1] = process.hrtime(seqTimes[0][0]);

parTimes[0][0][0] = process.hrtime();//step, thread, start-stop
prl.parallelCalculator(step1, range, func, threads1).then(value => {
    parallel[0] = value;
    parTimes[0][0][1] = process.hrtime(parTimes[0][0][0]);
}).then(() => {
    parTimes[0][1][0] = process.hrtime();//step, thread, start-stop
    prl.parallelCalculator(step1, range, func, threads2).then(() => {
        // parallel[0] = value;
        parTimes[0][1][1] = process.hrtime(parTimes[0][1][0]);
    }).then(() => {
        parTimes[1][0][0] = process.hrtime();//step, thread, start-stop
        prl.parallelCalculator(step2, range, func, threads1).then(value => {
            parallel[1] = value;
            parTimes[1][0][1] = process.hrtime(parTimes[1][0][0]);
        }).then(() => {
            parTimes[1][1][0] = process.hrtime();//step, thread, start-stop
            prl.parallelCalculator(step2, range, func, threads2).then(() => {
                // parallel[1] = value;
                parTimes[1][1][1] = process.hrtime(parTimes[1][1][0]);
            }).then(() => {
                showResults();
            });
        });
    })
});

function showResults() {
    console.log("CALCULATION RESULTS:");
    console.log('FROM ANTIDERIVATIVE:'.padEnd(35, ' '), antider.toFixed(14));
    console.log(`RESULT SEQUENTIAL (step = ${step1}):`.padEnd(35, ' '), sequential[0].toFixed(14).padEnd(20, ' '), `Diff: ${Math.abs(antider - sequential[0]).toFixed(10)}`);
    console.log(`RESULT SEQUENTIAL (step = ${step2}):`.padEnd(35, ' '), sequential[1].toFixed(14).padEnd(20, ' '), `Diff: ${Math.abs(antider - sequential[1]).toFixed(10)}`);
    console.log(`RESULT PARALLEL (step = ${step1}):`.padEnd(35, ' '), parallel[0].toFixed(14).padEnd(20, ' '), `Diff: ${Math.abs(antider - parallel[0]).toFixed(10)}`);
    console.log(`RESULT PARALLEL (step = ${step2}):`.padEnd(35, ' '), parallel[1].toFixed(14).padEnd(20, ' '), `Diff: ${Math.abs(antider - parallel[1]).toFixed(10)}`);
    console.log('\nEXECUTION TIMES:');
    // console.log(seqTimes);
    console.log(`SEQUENTIAL (step = ${step1}):`.padEnd(40, ' '), `${seqTimes[0][1][1] / 1000000} ms`);
    console.log(`SEQUENTIAL (step = ${step2}):`.padEnd(40, ' '), `${seqTimes[1][1][1] / 1000000} ms`);
    // console.dir(parTimes, {depth: null});
    const accelCoefs = [
        (seqTimes[0][1][1] / 1000000) / (parTimes[0][0][1][1] / 1000000),
        (seqTimes[0][1][1] / 1000000) / (parTimes[0][1][1][1] / 1000000),
        (seqTimes[1][1][1] / 1000000) / (parTimes[1][0][1][1] / 1000000),
        (seqTimes[1][1][1] / 1000000) / (parTimes[1][1][1][1] / 1000000)];
    const effCoefs = [
        accelCoefs[0]/threads1,
        accelCoefs[1]/threads2,
        accelCoefs[2]/threads1,
        accelCoefs[3]/threads2];
    console.log(`PARALLEL (step = ${step1}, threads = ${threads1}):`.padEnd(40, ' '), `${parTimes[0][0][1][1] / 1000000} ms`.padEnd(15, ' '),
        `ACCEL. COEF.: ${accelCoefs[0]}`.padEnd(40, ' '),
        `EFFICIENCY COEF: ${effCoefs[0]}`);
    console.log(`PARALLEL (step = ${step1}, threads = ${threads2}):`.padEnd(40, ' '), `${parTimes[0][1][1][1] / 1000000} ms`.padEnd(15, ' '),
        `ACCEL. COEF.: ${accelCoefs[1]}`.padEnd(40, ' '),
        `EFFICIENCY COEF: ${effCoefs[1]}`);
    console.log(`PARALLEL (step = ${step2}, threads = ${threads1}):`.padEnd(40, ' '), `${parTimes[1][0][1][1] / 1000000} ms`.padEnd(15, ' '),
        `ACCEL. COEF.: ${accelCoefs[2]}`.padEnd(40, ' '),
        `EFFICIENCY COEF: ${effCoefs[2]}`);
    console.log(`PARALLEL (step = ${step2}, threads = ${threads2}):`.padEnd(40, ' '), `${parTimes[1][1][1][1] / 1000000} ms`.padEnd(15, ' '),
        `ACCEL. COEF.: ${accelCoefs[3]}`.padEnd(40, ' '),
        `EFFICIENCY COEF: ${accelCoefs[3]}`);
}