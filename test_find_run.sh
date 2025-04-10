#!/bin/bash

# Directory to search
dir="lib/node_modules/@stdlib/math/base/special/sin"

# Use the same pattern as in the script
files=$(find ${dir} \( -path "*/test/test*.js" -o -path "*/test/**/test*.js" \) | grep -v '/fixtures/' | sort -u | tr '\n' ' ') || true

echo "All found test files:"
echo "${files}"

if echo "${files}" | grep -q "nested_dir/test.test.js"; then
    echo "SUCCESS: Nested test file was found!"
else
    echo "FAILURE: Nested test file was not found."
fi
