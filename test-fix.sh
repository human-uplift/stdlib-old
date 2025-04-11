#!/bin/bash
#
# Script to test the fix for issue #2096
# This script demonstrates how the original and fixed find commands behave

# Set up the example directory from the repository
REPO_ROOT="/tmp/stdlib-issue"
EXAMPLE_PKG="lib/node_modules/@stdlib/repl"

echo "Testing with package: ${EXAMPLE_PKG}"
echo "---------------------------------"

cd "${REPO_ROOT}"

echo "Original command (maxdepth 2):"
find "${EXAMPLE_PKG}" -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/' | sort -u

echo "
Number of test files found: $(find "${EXAMPLE_PKG}" -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/' | wc -l)
"

echo "Fixed command (nested test directories):"
find "${EXAMPLE_PKG}" -wholename '**/test/**/test*.js' | grep -v '/fixtures/' | sort -u

echo "
Number of test files found: $(find "${EXAMPLE_PKG}" -wholename '**/test/**/test*.js' | grep -v '/fixtures/' | wc -l)
"

echo "Test files in nested directories that would be missed by the original command:"
diff <(find "${EXAMPLE_PKG}" -maxdepth 2 -wholename '**/test/test*.js' | grep -v '/fixtures/' | sort -u) <(find "${EXAMPLE_PKG}" -wholename '**/test/**/test*.js' | grep -v '/fixtures/' | sort -u) | grep ">" | sed 's/> //'