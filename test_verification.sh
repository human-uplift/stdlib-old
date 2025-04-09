#!/usr/bin/env bash

# Test script to verify fix for nested test directories using the exact patterns from the CI script

# Define directories to search
directories="lib/node_modules/@stdlib/mock-package"

# Find test files with original pattern (with maxdepth 2)
echo "Original pattern (with maxdepth 2):"
original_files=$(find ${directories} -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/' | sort -u)
echo "$original_files"
echo ""

# Find test files with fixed pattern (without maxdepth limit)
echo "Fixed pattern (without maxdepth limit):"
fixed_files=$(find ${directories} -wholename '**/test/test*.js' | grep -v '/fixtures/' | sort -u)
echo "$fixed_files"
