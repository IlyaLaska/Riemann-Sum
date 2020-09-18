'use strict';
const calc = require('./integralCalculator');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const ROUND_TO = 10000;


const parallelCalculator = (step, range, func, threadCount) => {
    const threadStep = (range[1] - range[0]) / threadCount;
    let pos = range[0];
    let endPoint;
    if (isMainThread) {
        return new Promise((resultToReturn, rejectToReturn) => {

            let promiseArray = [];
            for (let i = 0; i < threadCount; i++) {
                promiseArray[i] = new Promise((resolve, reject) => {
                    endPoint = Math.round((pos + threadStep) * ROUND_TO) / ROUND_TO;
                    const worker = new Worker('./worker.js', {
                        workerData: {
                            stepSize: step,
                            rangeArr: [pos, endPoint],
                            fun: func.toString(),
                        }
                    })
                    worker.on('message', resolve);
                    worker.on('error', reject);
                    worker.on('exit', (code) => {
                        if (code !== 0)
                            reject(new Error(`Worker stopped with exit code ${code}`));
                    });
                })
                pos = endPoint;
            }
            Promise.all(promiseArray).then(values => {

                resultToReturn(values.reduce((a, b) => a + b, 0));
            })
        })
    }
}

module.exports = {parallelCalculator}