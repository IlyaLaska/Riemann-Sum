'use strict';
const calc = require('./integralCalculator');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const range = [2, 3];
const step1 = 0.001, step2 = 0.0001;

const func = (x) => Math.pow(x, 3) / Math.sqrt(Math.pow((Math.pow(x, 2) + 9), 3));

const roundTo = 10000;

// let threadCount = 10;
const threadCount = 10;
const threadStep = (range[1] - range[0]) / threadCount;

const parallelCalculator = (step, range, func, threadCount) => {
    let pos = range[0];
    if (isMainThread) {
        return new Promise((resultToReturn, rejectToReturn) => {

        let promiseArray = [];
        for (let i = 0; i < threadCount; i++) {
            promiseArray[i] = new Promise((resolve, reject) => {
                const worker = new Worker(__filename, {
                    workerData: pos
                })
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0)
                        reject(new Error(`Worker stopped with exit code ${code}`));
                });
            })//.then(value => {console.log('AA', value)},
            //     reason => {});
            // pos += threadStep;
            pos = Math.round((pos + threadStep) * roundTo) / roundTo;
        }
        Promise.all(promiseArray).then(values => {
            // let ass = 0;
            // for (let val of values) {
            //     console.log('V: ', val);
            //     ass += val;
            //     console.log('A: ', ass);
            // }
            console.log("RESULT PARALLEL  : ", values.reduce((a, b) => a + b, 0));
            resultToReturn(values.reduce((a, b) => a + b, 0));
        })
        })
    } else {
        const startPoint = workerData;
        const endPoint = Math.round((workerData + threadStep) * roundTo) / roundTo;
        parentPort.postMessage(calc.findIntegral(step, [startPoint, endPoint], func));
        return Promise.reject("Worker thread")
    }

}

parallelCalculator(step2, range, func, 10).then(v => {/*console.log("RESULT PARALLEL 1: ", v)*/}, r => {})
//     .then(value => {
//     console.log("RESULT PARALLEL 1: ", value);
//     return true;
// }, reason => {})
    // console.log(reason);
// }).then( val => {
//         // console.log('V: ', val)
//     if (val) console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//     // console.log(step2);
//         if (val) parallelCalculator(step2, range, func)
//             .then(value => {
//                 console.log("RESULT PARALLEL 2: ", value);
//             }, reason => {
//                 console.log(reason);
//             })
//     }
// )

module.exports = {parallelCalculator}