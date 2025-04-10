#!/bin/bash

# Create a test directory structure that mimics the stdlib structure
mkdir -p test_pkg/lib/node_modules/@stdlib/test-package/test/integration
mkdir -p test_pkg/lib/node_modules/@stdlib/test-package/lib

# Create test files
echo "console.log('Top level test');" > test_pkg/lib/node_modules/@stdlib/test-package/test/test.js
echo "console.log('Nested test');" > test_pkg/lib/node_modules/@stdlib/test-package/test/integration/test.js
touch test_pkg/lib/node_modules/@stdlib/test-package/lib/index.js

# Create versions of the script to test
mkdir -p test_pkg/original test_pkg/modified

# Create the original version (with -maxdepth 2)
cat > test_pkg/original/find_tests.sh << 'EOF'
#!/bin/bash
directories="lib/node_modules/@stdlib/test-package"
files=$(find ${directories} -maxdepth 2 -wholename '*/test/test*.js' | grep -v '/fixtures/' | sort -u) || true
echo "Original version (with -maxdepth 2) finds:"
echo "$files"
EOF
chmod +x test_pkg/original/find_tests.sh

# Create the modified version (with more complex path pattern)
cat > test_pkg/modified/find_tests.sh << 'EOF'
#!/bin/bash
directories="lib/node_modules/@stdlib/test-package"
files=$(find ${directories} \( -path '*/test/test*.js' -o -path '*/test/*/test*.js' \) | grep -v '/fixtures/' | sort -u) || true
echo "Modified version (with improved path matching) finds:"
echo "$files"
EOF
chmod +x test_pkg/modified/find_tests.sh

# Run both scripts and show the difference
cd test_pkg
original/find_tests.sh
modified/find_tests.sh
