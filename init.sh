#! /bin/bash
if [ ! -d "bolt-foundry" ]; then
    sl clone https://github.com/bolt-foundry/bolt-foundry.git
    cd bolt-foundry
    direnv allow
fi
