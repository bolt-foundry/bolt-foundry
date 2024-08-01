# This is the build setup for the Skia static lib used in canvex.
# Follow the instructions at https://skia.org/docs/user/build/
# This script is specifically the "gn gen" step.
#
# NOTE: uses homebrew.
# To install dependencies:
#  brew install libpng giflib libjpeg-turbo webp icu4c
#  

set -e # exit on error

echo "This is the build setup for Skia on macOS"
echo "You must execute this script in the skia checkout dir."
echo "See: https://skia.org/docs/user/build/"
echo " make sure to use commit-id 3c8855f36d5efbd65224b84917d385548b8ff1ba for skia "

HOMEBREW_BASE=$(brew --prefix)
EXTRA_CFLAGS="[\"-I${HOMEBREW_BASE}/opt/jpeg-turbo/include\", \"-I${HOMEBREW_BASE}/include/harfbuzz\", \"-I${HOMEBREW_BASE}/include\"]"
EXTRA_LDFLAGS="[\"-L${HOMEBREW_BASE}/opt/jpeg-turbo/lib\", \"-L${HOMEBREW_BASE}/lib\"]"


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

bin/gn gen ../gn_out/Static --args="is_official_build=true skia_enable_pdf=false skia_enable_gpu=false skia_enable_svg=false skia_use_libwebp_decode=false skia_use_libwebp_encode=false skia_use_dng_sdk=false skia_use_system_icu=false skia_use_system_libpng=false extra_cflags_cc=${EXTRA_CFLAGS}  extra_ldflags=${EXTRA_LDFLAGS}"

# -- alternative version that uses libjpeg-turbo from homebrew:
#bin/gn gen ../gn_out/Static --args="is_official_build=true skia_enable_pdf=false skia_enable_gpu=false skia_enable_svg=false skia_use_libwebp_decode=false skia_use_libwebp_encode=false skia_use_dng_sdk=false skia_use_system_icu=false extra_cflags_cc=${EXTRA_CFLAGS}  extra_ldflags=${EXTRA_LDFLAGS}"

echo "Your build is ready. Now run: "
echo "  ninja -C ../gn_out/Static"
echo
echo "When the build completes, copy the new libskia.a (from gn_out/Static) into canvex/skia/lib-static/mac-arm64 or canvex/skia/lib-static/mac-x64"
