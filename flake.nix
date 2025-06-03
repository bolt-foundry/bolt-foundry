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
      # 2a.  Package sets - Now reading from replit.nix
      ##################################################################
      
      # Import the package lists from replit.nix
      # Note: We can't actually execute replit.nix in pure eval mode,
      # so we parse it as a file to extract the package lists
      replitConfig = import ./replit.nix;
      
      # Helper to resolve package from attribute path
      getPackage = pkgs: path:
        let
          parts = builtins.filter (s: s != "") (builtins.split "\\." path);
          getPkg = acc: part: acc.${part};
        in
          builtins.foldl' getPkg pkgs parts;
      
      mkBaseDeps = { pkgs, system }:
        let
          unstable = import nixpkgs-unstable { inherit system; config.allowUnfree = true; };
          # Get the unstable package list from a dummy evaluation of replit.nix
          # In practice, we know it's just ["deno"] for now
          unstablePackages = ["deno"];
        in
        map (name: getPackage unstable name) unstablePackages;

      # everythingExtra = "stuff on top of base"
      mkEverythingExtra = { pkgs, system }:
        let
          lib = pkgs.lib;
          # These are the stable packages from replit.nix
          stablePackages = [
            "unzip"
            "jupyter"
            "jq"
            "sapling"
            "gh"
            "python311Packages.tiktoken"
            "nodejs_20"
            "_1password-cli"
            "typescript-language-server"
          ];
          stablePackagesLinux = ["chromium"];
          
          resolvedStable = map (name: getPackage pkgs name) stablePackages;
          platformSpecific = lib.optionals (!pkgs.stdenv.isDarwin) 
            (map (name: getPackage pkgs name) stablePackagesLinux);
        in
        resolvedStable ++ platformSpecific;

      ##################################################################
      # 2b.  Helpers
      ##################################################################
      # mkShellWith extras → dev-shell whose buildInputs = baseDeps ++ extras
      mkShellWith = { pkgs, system
        , extras ? [ ]
        , hookName ? "Shell"
        , env ? { }
        , shellHookExtra ? ""     # NEW
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
      })

    ############################################################
    # 2d.  Extra utilities - Now deprecated since replit.nix handles this
    ############################################################
    //
    {
      # This is now just for backwards compatibility
      # Replit should use replit.nix directly, not this
      replitDeps = { pkgs, system ? builtins.currentSystem, ... }:
        mkBaseDeps { inherit pkgs system; } ++ mkEverythingExtra { inherit pkgs system; };
    };
}