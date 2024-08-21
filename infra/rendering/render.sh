#! /bin/bash
cd $BF_PATH/packages/vcs/cli-render/bf-vcscut-tools
direnv allow
eval "$(direnv export bash)"
yarn install
./install_and_build_vcsrender.sh
npm run render $1
