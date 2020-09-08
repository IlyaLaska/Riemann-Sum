'use strict';

const findIntegral = (step, range, func) => {
    let offset = Math.pow(10, step.toString().split('.')[1].length) || 0
    // console.log("Start Point: ", range[0]);
    // console.log("End Point: ", range[1]);
    let pos = range[0];
    let adder = 0;
    let counter = 0;
    while (pos < range[1]) {
        adder += func(pos);
        pos += step;
        pos = Math.round(pos * offset) / offset;
        ++counter;
    }
    // console.log(pos);
    return step * adder;
}

module.exports = {findIntegral};