{
  description = "Bolt-Foundry unified dev environment (flake + Replit)";

  ########################
  ## 1. Inputs
  ########################
  inputs = {
    nixpkgs.url     = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url = "github:numtide/flake-utils";
  };

  ########################
  ## 2. Outputs
  ########################
  outputs = { self, nixpkgs, flake-utils, ... }:
    let
      ####################
      # mkDeps — common package list
      ####################
      mkDeps = { pkgs, system }:
        let
          unstablePkgs = import (builtins.fetchTarball {
            url    = "https://github.com/NixOS/nixpkgs/archive/5b0bc905a940438854c6f4e9d1947d7ce5ad7a88.tar.gz";
            sha256 = "17bz4ns251l05apaayx4q7zlrva48gajgg5fym70f1i7656fx0jz";
          }) { inherit system; config.allowUnfree = true; };
          lib = pkgs.lib;
        in
        [
          pkgs.unzip
          pkgs.jupyter
          pkgs.jq
          pkgs.sapling
          pkgs.gh
          pkgs.python311Packages.tiktoken
          unstablePkgs.deno
          pkgs.nodejs_20
          pkgs._1password-cli
        ]
        ++ lib.optionals (!pkgs.stdenv.isDarwin) [ pkgs.chromium ];
    in

    ############################################################
    # 2a. Per-system outputs (devShells, packages, …)
    ############################################################
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = mkDeps { inherit pkgs system; };
        };
      })

    ############################################################
    # 2b. Extra top-level utilities merged in
    ############################################################
    //
    {
      # Replit (or anything else) can call this with its own ‘pkgs’
      #   The “...” swallows any extra arguments Replit passes.
      replitDeps = { pkgs, system ? builtins.currentSystem, ... }:
        mkDeps { inherit pkgs system; };
    };
}
