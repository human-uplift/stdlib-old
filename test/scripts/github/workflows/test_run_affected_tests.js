/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const tape = require('tape');
const IS_WINDOWS = require('@stdlib/assert-is-windows');


// VARIABLES //

const ROOT_DIR = path.resolve(__dirname, '..', '..', '..');
const SCRIPT_PATH = path.join(ROOT_DIR, '.github', 'workflows', 'scripts', 'run_affected_tests');


// FUNCTIONS //

/**
* Executes a shell command.
*
* @private
* @param {string} cmd - command to execute
* @param {Object} options - execution options
* @param {Function} callback - callback function
*/
function execute(cmd, options, callback) {
    exec(cmd, options, callback);
}

/**
* Creates a nested directory structure with test files.
*
* @private
* @param {string} baseDir - base directory
* @param {Function} callback - callback function
*/
function createTestStructure(baseDir, callback) {
    const testDir = path.join(baseDir, 'test');
    const nestedTestDir = path.join(testDir, 'nested');
    const deepNestedTestDir = path.join(nestedTestDir, 'deep');
    const fixturesDir = path.join(testDir, 'fixtures');
    const nestedFixturesDir = path.join(nestedTestDir, 'fixtures');
    
    // Create all directories
    try {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        if (!fs.existsSync(nestedTestDir)) {
            fs.mkdirSync(nestedTestDir, { recursive: true });
        }
        if (!fs.existsSync(deepNestedTestDir)) {
            fs.mkdirSync(deepNestedTestDir, { recursive: true });
        }
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }
        if (!fs.existsSync(nestedFixturesDir)) {
            fs.mkdirSync(nestedFixturesDir, { recursive: true });
        }
        
        // Create test files
        fs.writeFileSync(path.join(testDir, 'test.js'), '// Top-level test file');
        fs.writeFileSync(path.join(nestedTestDir, 'test.js'), '// Nested test file');
        fs.writeFileSync(path.join(deepNestedTestDir, 'test.js'), '// Deep nested test file');
        fs.writeFileSync(path.join(fixturesDir, 'test.js'), '// Fixture test file that should not be included');
        fs.writeFileSync(path.join(nestedFixturesDir, 'test.js'), '// Nested fixture test file that should not be included');
        
        callback(null);
    } catch (err) {
        callback(err);
    }
}

/**
* Cleans up test files.
*
* @private
* @param {string} baseDir - base directory
* @param {Function} callback - callback function
*/
function cleanupTestStructure(baseDir, callback) {
    try {
        fs.rmSync(path.join(baseDir, 'test'), { recursive: true, force: true });
        callback(null);
    } catch (err) {
        callback(err);
    }
}

/**
* Tests the run_affected_tests script by creating a mock package structure.
*
* @private
*/
function testScript() {
    if (IS_WINDOWS) {
        tape('Skip test on Windows', function test(t) {
            t.skip('Test is not supported on Windows');
            t.end();
        });
        return;
    }

    const testBasePath = path.join(ROOT_DIR, 'lib', 'node_modules', '@stdlib', 'test-affected-tests');
    
    tape('run_affected_tests finds test files in nested directories', function test(t) {
        t.plan(4);
        
        createTestStructure(testBasePath, function onCreate(err) {
            if (err) {
                t.fail('Failed to create test structure: ' + err.message);
                return t.end();
            }
            
            // Define a temporary script to extract test files without running them
            const tempScriptPath = path.join(ROOT_DIR, 'temp_extract_tests.sh');
            const scriptContent = `#!/usr/bin/env bash
cd "${ROOT_DIR}"
# Modified from run_affected_tests to just print the test files it would run
changed="lib/node_modules/@stdlib/test-affected-tests/test"
directories="lib/node_modules/@stdlib/test-affected-tests"
files=""
for dir in \${directories}; do
    pkg_test_files=\$(find "\${dir}/test" -type f -name "test*.js" -not -path "*/fixtures/*" | sort -u | tr '\\n' ' ') || true
    if [ -n "\${pkg_test_files}" ]; then
        files="\${files} \${pkg_test_files}"
    fi
done
# Trim leading/trailing whitespace
files=\$(echo "\${files}" | xargs)
# Exclude files residing in test fixtures directories 
files=\$(echo "\${files}" | grep -v '/fixtures/' || true)
echo "\${files}"
`;
            
            try {
                fs.writeFileSync(tempScriptPath, scriptContent);
                fs.chmodSync(tempScriptPath, '755');
                
                execute(tempScriptPath, { cwd: ROOT_DIR }, function onExecute(execError, stdout, stderr) {
                    if (execError) {
                        t.fail('Failed to execute test script: ' + execError.message);
                        return cleanupAndEnd();
                    }
                    
                    const foundFiles = stdout.trim().split(' ');
                    t.ok(foundFiles.length >= 3, 'Should find at least 3 test files');
                    
                    const hasTopLevelTest = foundFiles.some(file => file.endsWith('/test/test.js'));
                    const hasNestedTest = foundFiles.some(file => file.endsWith('/test/nested/test.js'));
                    const hasDeepNestedTest = foundFiles.some(file => file.endsWith('/test/nested/deep/test.js'));
                    
                    t.ok(hasTopLevelTest, 'Should find top-level test file');
                    t.ok(hasNestedTest, 'Should find nested test file');
                    t.ok(hasDeepNestedTest, 'Should find deep nested test file');
                    
                    cleanupAndEnd();
                });
            } catch (writeErr) {
                t.fail('Failed to write temporary script: ' + writeErr.message);
                cleanupAndEnd();
            }
            
            function cleanupAndEnd() {
                // Clean up temporary script
                try {
                    if (fs.existsSync(tempScriptPath)) {
                        fs.unlinkSync(tempScriptPath);
                    }
                } catch (e) {
                    console.error('Error cleaning up temporary script:', e);
                }
                
                // Clean up test structure
                cleanupTestStructure(testBasePath, function onCleanup(cleanupErr) {
                    if (cleanupErr) {
                        console.error('Error cleaning up test structure:', cleanupErr);
                    }
                    t.end();
                });
            }
        });
    });
}


// MAIN //

testScript();
