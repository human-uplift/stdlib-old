'use strict';

var path = require('path');
var abs = require('./lib/node_modules/@stdlib/math/base/special/abs');
var gasum = require('./lib/node_modules/@stdlib/blas/base/gasum');

function getter(data, idx) {
    return data[idx];
}

// Test regular array
var x1 = [1.0, -2.0, 3.0, -4.0, 5.0];
var sum1 = gasum(x1.length, x1, 1);
console.log('Regular array sum:', sum1);
if (sum1 !== 15.0) {
    console.error('Test failed for regular array');
    process.exit(1);
}

// Test accessor array
var xAccessor = {
    'data': [1.0, -2.0, 3.0, -4.0, 5.0],
    'accessors': [getter],
    'accessorProtocol': 'fake'
};
var sum2 = gasum(xAccessor.data.length, xAccessor, 1);
console.log('Accessor array sum:', sum2);
if (sum2 !== 15.0) {
    console.error('Test failed for accessor array');
    process.exit(1);
}

// Test ndarray accessor
var sum3 = gasum.ndarray(xAccessor.data.length, xAccessor, 1, 0);
console.log('Ndarray accessor sum:', sum3);
if (sum3 !== 15.0) {
    console.error('Test failed for ndarray accessor');
    process.exit(1);
}

// Test strided accessor
var xStrided = {
    'data': [1.0, -2.0, 3.0, -4.0, 5.0, -6.0],
    'accessors': [getter],
    'accessorProtocol': 'fake'
};
var sum4 = gasum(3, xStrided, 2);
console.log('Strided accessor sum:', sum4);
if (sum4 !== 9.0) {
    console.error('Test failed for strided accessor');
    process.exit(1);
}

// Test ndarray strided accessor
var sum5 = gasum.ndarray(3, xStrided, 2, 0);
console.log('Ndarray strided accessor sum:', sum5);
if (sum5 !== 9.0) {
    console.error('Test failed for ndarray strided accessor');
    process.exit(1);
}

console.log('All tests passed successfully!');