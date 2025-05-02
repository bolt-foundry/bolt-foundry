{
  description = "Bolt-Foundry unified dev environment (flake + Replit)";

  ########################
  ## 1. Inputs
  ########################
  inputs = {
    nixpkgs.url     = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/086a1ea6747bb27e0f94709dd26d12d443fa4845";
  };

  ########################
  ## 2. Outputs
  ########################
  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable, ... }:
    let
      ####################
      # mkDeps — common package list
      ####################
      mkDeps = { pkgs, system }:
        let
          unstablePkgs  = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
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
