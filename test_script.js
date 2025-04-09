#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a nested test structure
const testDir = 'test_verification';
const nestedTestDir = path.join(testDir, 'nested1', 'nested2', 'test');

// Remove previous test directory if it exists
if (fs.existsSync(testDir)) {
    execSync(`rm -rf ${testDir}`);
}

// Create directories
fs.mkdirSync(nestedTestDir, { recursive: true });

// Create a nested test file
const testContent = `
'use strict';

// MODULES //

var tape = require('tape');

// TESTS //

tape('nested test runs', function test(t) {
    t.ok(true, 'nested test is found and executed');
    t.end();
});
`;

fs.writeFileSync(path.join(nestedTestDir, 'test.js'), testContent);

// Show original command's behavior (with -maxdepth 2)
console.log('Old behavior (with -maxdepth 2):');
try {
    const oldResult = execSync(`find ${testDir} -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/'`).toString();
    console.log(oldResult || '(no tests found)');
} catch (e) {
    console.log('(no tests found)');
}

// Show new command's behavior (without -maxdepth 2)
console.log('\nNew behavior (with -type f and no depth limit):');
try {
    const newResult = execSync(`find ${testDir} -type f -wholename '**/test/test*.js' | grep -v '/fixtures/'`).toString();
    console.log(newResult || '(no tests found)');
} catch (e) {
    console.log('(no tests found)');
}

// Run the actual test to verify it works
console.log('\nRunning the nested test with the new approach:');
try {
    const testResult = execSync(`NODE_PATH=. tape ${testDir}/nested1/nested2/test/test.js`).toString();
    console.log(testResult);
} catch (e) {
    console.log('Error running test:', e.message);
}
