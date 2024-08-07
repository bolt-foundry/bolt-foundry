#!/usr/bin/env bash

echo "This script will install dependencies needed by vcsrender and build the tool."

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Installing Mac dependencies..."
  # install package if not already available
  brew install webp jpeg-turbo argp-standalone meson 2>/dev/null && true
fi

set -e
BFROOT="${BF_PATH:-../../../..}"  # default is four levels down if BF_PATH not set
echo "BFROOT: $BFROOT"
VCSROOT=$BFROOT/thirdParty/daily-vcs-main
VCSRENDERPATH=$VCSROOT/server-render/vcsrender

# install VCS JS tools
echo "Installing VCS base dependencies..."
pushd .
cd $VCSROOT/js
yarn
popd

pushd .
cd $VCSROOT/cut-transcript-tools
npm i
popd

# install vcsrender C++ tool
echo "Building vcsrender..."
pushd .
cd $VCSRENDERPATH

#ensure the symlink to canvex subproject is in place
if ! [ -d "subprojects/canvex" ]; then
  ln -s ../../canvex subprojects/canvex
fi

meson setup build
ninja -C build
popd

# done
echo "Install complete."
echo
echo "You can test it with:"
echo "    npm run render ../example-data/short_clip.mp4"
echo
echo "The render output should appear in ../example-data/short_clip_render.mp4"
echo
