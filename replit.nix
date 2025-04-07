{ pkgs, system ? builtins.currentSystem }:
let
  unstablePkgs = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/5b0bc905a940438854c6f4e9d1947d7ce5ad7a88.tar.gz";
    sha256 = "17bz4ns251l05apaayx4q7zlrva48gajgg5fym70f1i7656fx0jz";
  }) { inherit system; };
in
{
  deps = [
    pkgs.unzip
    pkgs.jupyter
    pkgs.jq
    pkgs.sapling
    pkgs.gh
    pkgs.python311Packages.tiktoken
    unstablePkgs.deno
    pkgs.nodejs_20
    pkgs.chromium
  ];
}
