# GitHub Workflow Tests

> Tests for GitHub workflow scripts.

## Test for Run Affected Tests Script

The `test_run_affected_tests.js` file tests the `.github/workflows/scripts/run_affected_tests` script to ensure it properly finds and includes test files in nested test directories.

This test demonstrates that the fix for issue #2096 properly addresses the bug where tests in nested directories were not being properly discovered and executed by the CI workflow.

The test:
1. Creates a mock package directory with test files at various nesting levels
2. Creates some fixture directories that should be excluded
3. Executes a simplified version of the `run_affected_tests` script
4. Verifies that test files at all levels are found, while fixture test files are excluded

### Running the test

```bash
npm test -- "test/scripts/github/workflows/test_run_affected_tests.js"
```
