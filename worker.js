'use strict';

const calc = require('./integralCalculator');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

parentPort.postMessage(calc.findIntegral(workerData.stepSize, workerData.rangeArr, eval(workerData.fun)));