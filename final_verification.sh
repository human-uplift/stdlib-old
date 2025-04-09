#!/usr/bin/env bash

# Final test verification script

# Define directories to search
directories="lib/node_modules/@stdlib/mock-package"

# Find test files with original pattern
echo "Original pattern (with maxdepth 2 and -wholename):"
original_files=$(find ${directories} -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/' | sort -u)
echo "$original_files"
echo ""

# Find test files with our new pattern
echo "New pattern (with -path '**/test*/test*.js'):"
new_files=$(find ${directories} -path '**/test*/test*.js' | grep -v '/fixtures/' | sort -u)
echo "$new_files"
