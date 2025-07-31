#!/bin/bash
# Script to help update container tool version in nix

set -euo pipefail

VERSION=${1:-}

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 0.3.1"
    exit 1
fi

echo "Fetching container version $VERSION..."

# Download the pkg file to get its hash
URL="https://github.com/apple/container/releases/download/$VERSION/container-$VERSION-installer-signed.pkg"
TEMP_FILE="/tmp/container-$VERSION.pkg"

echo "Downloading from $URL..."
if ! curl -L -o "$TEMP_FILE" "$URL"; then
    echo "Failed to download container $VERSION. Make sure the version exists."
    exit 1
fi

# Get the sha256 hash
HASH=$(nix-hash --type sha256 --flat "$TEMP_FILE")
NIX_HASH=$(nix hash to-sri --type sha256 "$HASH")

echo ""
echo "Version: $VERSION"
echo "SHA256: $NIX_HASH"
echo ""
echo "Add this to infra/nix/container-tool-flexible.nix:"
echo "    \"$VERSION\" = \"$NIX_HASH\";"

# Cleanup
rm -f "$TEMP_FILE"