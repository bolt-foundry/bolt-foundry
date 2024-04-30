#! /bin/bash

cd $BF_PATH
deno run -A npm:relay-compiler lsp --output=verbose ./relay.config.json