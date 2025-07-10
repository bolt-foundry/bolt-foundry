#!/usr/bin/env bash
# Test shell integration scripts

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"

echo "Testing shell integration scripts..."

# Test 1: init-secrets.sh can be sourced
echo "Test 1: Sourcing init-secrets.sh..."
(
    # Source in a way that allows the script to complete even without auth
    source "$PACKAGE_DIR/scripts/init-secrets.sh" 2>/dev/null || true
    
    # The function should still be exported even if auth fails
    if type -t bf_refresh_secrets &>/dev/null; then
        echo "✓ bf_refresh_secrets function is available"
    else
        echo "✗ bf_refresh_secrets function not found"
        exit 1
    fi
)

# Test 2: bf-env script exists and is executable
echo "Test 2: Checking bf-env..."
if [ -x "$PACKAGE_DIR/scripts/bf-env" ]; then
    echo "✓ bf-env is executable"
else
    echo "✗ bf-env is not executable"
    exit 1
fi

# Test 3: bf-env shows help
echo "Test 3: bf-env --help..."
if "$PACKAGE_DIR/scripts/bf-env" --help | grep -q "bf-env - Run commands with"; then
    echo "✓ bf-env help works"
else
    echo "✗ bf-env help failed"
    exit 1
fi

# Test 4: Check symlink in infra/bin
echo "Test 4: Checking infra/bin symlink..."
SYMLINK_PATH="$PACKAGE_DIR/../../infra/bin/bf-env"
if [ -L "$SYMLINK_PATH" ]; then
    echo "✓ bf-env symlink exists in infra/bin"
else
    echo "✗ bf-env symlink missing in infra/bin"
    # Not a failure - just informational
fi

echo
echo "All shell integration tests passed!"