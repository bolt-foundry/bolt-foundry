# This is the build setup for the Skia static lib used in canvex.
# Follow the instructions at https://skia.org/docs/user/build/
# This script is specifically the "gn gen" step.

set -e # exit on error

echo "This is the build setup for Skia on Linux x86_64."
echo "You must execute this script in the skia checkout dir."
echo "See: https://skia.org/docs/user/build/"
echo " make sure to use commit-id 3c8855f36d5efbd65224b84917d385548b8ff1ba for skia "

# verify commit-id
COMMIT_ID=$(git rev-parse --short HEAD)
VALID_COMMIT_ID="3c8855f36d"

if [[ \"${COMMIT_ID}\" != \"${VALID_COMMIT_ID}\" ]];then
   echo " we are currently using 3c8855f36d commit id of skia "
   exit 1
fi

# sync repo to get external dependencies
python3 tools/git-sync-deps
echo " repo sync complete "

bin/gn gen ../gn_out/Static --args='is_official_build=true cc="clang" cxx="clang++" skia_enable_pdf=false skia_enable_gpu=false skia_enable_svg=false skia_use_libwebp_decode=false skia_use_libwebp_encode=false skia_use_dng_sdk=false skia_use_system_libjpeg_turbo=false skia_use_system_harfbuzz=false skia_use_system_libpng=false skia_use_system_icu=false skia_use_fontconfig=false'

echo "Your build is ready. Now run: "
echo "  ninja -C ../gn_out/Static"
echo
echo "When the build completes, copy the new libskia.a (from gn_out/Static) into canvex/skia/lib-static/linux-x64"
