#!/bin/bash
# Script to build Apple container tool from source

set -euo pipefail

VERSION=${1:-0.3.0}
BUILD_DIR="/tmp/container-build"

echo "Building Apple container tool version $VERSION..."

# Clone the repository
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi

git clone --depth 1 --branch "$VERSION" https://github.com/apple/container.git "$BUILD_DIR"
cd "$BUILD_DIR"

# Build using Swift
swift build -c release

# Copy binary to local bin
mkdir -p ~/bin
cp .build/release/container ~/bin/container-$VERSION

echo "Container tool built and installed to ~/bin/container-$VERSION"
echo "Add ~/bin to your PATH or alias container=~/bin/container-$VERSION"