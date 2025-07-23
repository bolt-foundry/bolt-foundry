{
  description = "Bolt-Foundry unified dev environment";

  ########################
  ## 1. Inputs
  ########################
  inputs = {
    nixpkgs.url          = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url      = "github:numtide/flake-utils";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/1e968849c167dd400b51e2d87083d19242c1c315";
  };

  ########################
  ## 2. Outputs
  ########################
  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable, ... }:
    let
      ##################################################################
      # 2a.  Package sets - Now directly defined
      ##################################################################
      
      mkBaseDeps = { pkgs, system }:
        let
          unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
        in
        [
          unstable.deno  # Use deno from unstable
        ];

      # everythingExtra = "stuff on top of base"
      mkEverythingExtra = { pkgs, system }:
        let
          lib = pkgs.lib;
          unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
        in
        [
          pkgs.unzip
          pkgs.jupyter
          pkgs.jq
          pkgs.sapling
          pkgs.gh
          pkgs.python311Packages.tiktoken
          pkgs.nodejs_22
          pkgs._1password-cli
          pkgs.typescript-language-server
          pkgs.ffmpeg
        ] ++ lib.optionals (!pkgs.stdenv.isDarwin) [
          # Linux-only packages
          pkgs.chromium
        ];

      ##################################################################
      # 2b.  Helpers
      ##################################################################
      # mkShellWith extras → dev-shell whose buildInputs = baseDeps ++ extras
      mkShellWith = { pkgs, system
        , extras ? [ ]
        , hookName ? "Shell"
        , env ? { }
        , shellHookExtra ? ""
        }:
      let
        baseDeps = mkBaseDeps { inherit pkgs system; };
      in
      pkgs.mkShell
      (env // {
        buildInputs = baseDeps ++ extras;
        shellHook = ''
          # nice banner
          echo -e "\e[1;34m[${hookName}]\e[0m  \
          base:${toString (map (p: p.name or "<pkg>") baseDeps)}  \
          extras:${toString (map (p: p.name or "<pkg>") extras)}"

          # --- your custom logic ---
          export PATH="$PWD/infra/bin:$PATH"   # prepend ./infra/bin
          if ! command -v deno >/dev/null; then
            echo "Installing deno user tools…"
            # runs once per machine-wide cache; cheap if already installed
            deno install --allow-read --allow-write --allow-env -q -f https://deno.land/x/denon/denon.ts
          fi

          # Set DENO_DIR to keep cache out of repo
          export DENO_DIR="${builtins.getEnv "HOME"}/.cache/deno"

          # Load .env.local if it exists
          if [ -f ".env.local" ]; then
            echo "Loading environment from .env.local..."
            set -a  # automatically export all variables
            source .env.local
            set +a
            echo "Environment loaded from .env.local"
          else
            echo "No .env.local found. Run 'bff inject-secrets' to create it from 1Password."
          fi

          ${shellHookExtra}
        '';
      });
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

        # FlakeHub-cached build packages
        packages = rec {
          # Build the main web application
          web = pkgs.stdenv.mkDerivation {
            pname = "bolt-foundry-web";
            version = "0.1.0";
            src = ./.;
            nativeBuildInputs = with pkgs; [ pkgs.deno ];
            buildPhase = ''
              export DENO_DIR=$TMPDIR/deno_cache
              deno task build:web
            '';
            installPhase = ''
              mkdir -p $out/bin
              cp build/web $out/bin/ || echo "No web binary found"
              cp -r static $out/ || echo "No static directory found"
            '';
          };

          # Build the marketing site
          boltfoundry-com = pkgs.stdenv.mkDerivation {
            pname = "boltfoundry-com";
            version = "0.1.0";
            src = ./.;
            nativeBuildInputs = with pkgs; [ pkgs.deno ];
            buildPhase = ''
              export DENO_DIR=$TMPDIR/deno_cache
              deno task build:boltfoundry-com
            '';
            installPhase = ''
              mkdir -p $out/bin
              cp build/boltfoundry-com $out/bin/ || echo "No boltfoundry-com binary found"
            '';
          };

          # OCI container image for codebot isolation
          codebot-container = pkgs.dockerTools.buildImage {
            name = "bft-codebot";
            tag = "latest";
            
            # Use the everything dev shell environment as base
            contents = let
              baseDeps = mkBaseDeps { inherit pkgs system; };
              extraDeps = mkEverythingExtra { inherit pkgs system; };
              unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
            in
            baseDeps ++ extraDeps ++ [
              # Add Claude Code CLI via npm package in container
              (pkgs.buildEnv {
                name = "claude-code-env";
                paths = [
                  unstable.nodejs_22
                  (pkgs.runCommand "claude-code-cli" {} ''
                    mkdir -p $out/bin
                    echo '#!/bin/sh' > $out/bin/claude-code
                    echo 'exec ${unstable.nodejs_22}/bin/npx @anthropic-ai/claude-code "$@"' >> $out/bin/claude-code
                    chmod +x $out/bin/claude-code
                  '')
                ];
              })
              # Essential shell utilities
              pkgs.coreutils
              pkgs.bash
              pkgs.git
            ];
            
            config = {
              # Set up working directory
              WorkingDir = "/workspace";
              
              # Environment variables
              Env = [
                "PATH=/bin:/usr/bin"
                "DENO_DIR=/tmp/deno_cache"
                "HOME=/root"
              ];
              
              # Default shell
              Cmd = [ "/bin/bash" ];
            };
          };
        };
      });
}
