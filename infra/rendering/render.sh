#! /bin/bash
cd $BF_PATH/packages/vcs/cli-render/bf-vcscut-tools
eval "$(direnv export bash)"
direnv allow
yarn install
./install_and_build_vcsrender.sh
npm run render $1