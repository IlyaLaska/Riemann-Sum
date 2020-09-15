//TODO this file calculates everything twice - once from external call, once internally
'use strict';
const calc = require('./integralCalculator');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

// const range = [2, 3];
// const step1 = 0.001, step2 = 0.0001, step3 = 0.01;
//
// const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));

const ROUND_TO = 10000;

// let threadCount = 10;
// const threadCount = 10;

// console.log("MaIN: ", isMainThread);

const parallelCalculator = (step, range, func, threadCount) => {
    // console.log("IN PARALLEL_CALCULATOR FUNCTION");
    const threadStep = (range[1] - range[0]) / threadCount;
    // console.log('Thread Step: ', threadStep);
    let pos = range[0];
    let endPoint;
    if (isMainThread) {
        // console.log("IS MAIN T")
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
                // pos = Math.round((pos + threadStep) * roundTo) / roundTo;
            }
            Promise.all(promiseArray).then(values => {
                // let ass = 0;
                // for (let val of values) {
                //     console.log('V: ', val);
                //     ass += val;
                //     console.log('A: ', ass);
                // }
                // console.log("RESULT PARALLEL  :   ", values.reduce((a, b) => a + b, 0));
                resultToReturn(values.reduce((a, b) => a + b, 0));
            })
        })
    }// else {//TODO WON'T TRIGGER
    //     console.log("NEVER HERE")
    //     const startPoint = workerData;
    //     const endPoint = Math.round((workerData + threadStep) * roundTo) / roundTo;
    //     parentPort.postMessage(calc.findIntegral(step, [startPoint, endPoint], func));
    //     return Promise.reject("Worker thread")
    // }

}

    // parallelCalculator(step2, range, func, 10).then(v => {console.log("RESULT PARALLEL 1: ", v);
    // return v;
    // }, r => {
    // })
        // .then(value => {
        //     console.log("RESULT PARALLEL 2: ", value);
        //     return true;
        // }, reason => {
        // })

module.exports = {parallelCalculator}