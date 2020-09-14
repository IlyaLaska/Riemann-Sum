'use strict';

const calc = require('./integralCalculator');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

// const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));
//
// const range = [2, 3];
// const step1 = 0.001, step2 = 0.0001;
//
// const roundTo = 10000;
//
// // let threadCount = 10;
// const threadCount = 10;
// const threadStep = (range[1] - range[0]) / threadCount;

// const startPoint = workerData;
// const endPoint = Math.round((workerData + threadStep) * roundTo) / roundTo;
// console.log("QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", eval(workerData.fun));
parentPort.postMessage(calc.findIntegral(workerData.stepSize, workerData.rangeArr, eval(workerData.fun)));
// return Promise.reject("Worker thread")