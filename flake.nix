{
  description = "Bolt-Foundry unified dev environment (flake + Replit)";

  ########################
  ## 1. Inputs
  ########################
  inputs = {
    nixpkgs.url          = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url      = "github:numtide/flake-utils";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/086a1ea6747bb27e0f94709dd26d12d443fa4845";
  };

  ########################
  ## 2. Outputs
  ########################
  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable, ... }:
    let
      ##################################################################
      # 2a.  Package sets
      ##################################################################
      mkBaseDeps = { pkgs, system }:
        let
          unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
        in
        [ unstable.deno ];

      # everythingExtra = “stuff on top of base”
      mkEverythingExtra = { pkgs, system }:
        let
          unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
          lib = pkgs.lib;
        in
        [
          pkgs.unzip
          pkgs.jupyter
          pkgs.jq
          pkgs.sapling
          pkgs.gh
          pkgs.python311Packages.tiktoken
          pkgs.nodejs_20
          pkgs._1password-cli
        ] ++ lib.optionals (!pkgs.stdenv.isDarwin) [ pkgs.chromium ];

      ##################################################################
      # 2b.  Helpers
      ##################################################################
      # mkShellWith extras → dev-shell whose buildInputs = baseDeps ++ extras
      mkShellWith = { pkgs, system, extras ? [ ], hookName ? "Shell" }:
        let
          baseDeps = mkBaseDeps { inherit pkgs system; };
        in
        pkgs.mkShell {
          buildInputs = baseDeps ++ extras;
          shellHook = ''
            echo -e "\e[1;34m[${hookName}]\e[0m  base:${toString (map (p: p.name or "<pkg>") baseDeps)}  extras:${toString (map (p: p.name or "<pkg>") extras)}"
          '';
        };
    in

    ############################################################
    # 2c.  Per-system dev shells
    ############################################################
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };

        everythingExtra = mkEverythingExtra { inherit pkgs system; };
      in {
        devShells = rec {
          # canonical minimal environment
          base            = mkShellWith { inherit pkgs system; hookName = "Base shell"; };

          # codex = same as base
          codex           = mkShellWith { inherit pkgs system; hookName = "Codex shell"; };

          # full tool-chain variants
          everything      = mkShellWith { inherit pkgs system; extras = everythingExtra; hookName = "Everything shell"; };
          replit          = mkShellWith { inherit pkgs system; extras = everythingExtra; hookName = "Replit shell"; };
          github-actions  = mkShellWith { inherit pkgs system; extras = everythingExtra; hookName = "GitHub-Actions shell"; };

          # legacy alias
          default         = everything;
        };
      })

    ############################################################
    # 2d.  Extra utilities (unchanged)
    ############################################################
    //
    {
      replitDeps = { pkgs, system ? builtins.currentSystem, ... }:
        mkBaseDeps { inherit pkgs system; } ++ mkEverythingExtra { inherit pkgs system; };
    };
}