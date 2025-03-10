{
  description = "Cross-platform Nix flake referencing replit.nix, importing .replit env, and ignoring symlinked directories";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        filteredSrc = pkgs.lib.cleanSourceWith {
          src = ./.;
          filter = path: type: !(type == "symlink" && builtins.readDir path != {});
        };

        # Import the .replit file as TOML and extract its "env" section
        replitEnv =
          if builtins.pathExists (filteredSrc + "/.replit")
          then let
            parsed = builtins.fromTOML (builtins.readFile (filteredSrc + "/.replit"));
          in if builtins.hasAttr "env" parsed then parsed.env else {} else {};

        # Generate export statements for each key in the "env" section, ignoring HISTFILE
        envExports = builtins.foldl' (acc: key:
          if key == "HISTFILE"
          then acc
          else acc + "export " + key + "=" + toString replitEnv.${key} + "\\n"
        ) "" (builtins.attrNames replitEnv);

        # Safely import replit.nix if it exists
        replitDeps =
          if builtins.pathExists (filteredSrc + "/replit.nix")
          then let
            replitImport = import (filteredSrc + "/replit.nix") { inherit pkgs system; };
          in if builtins.hasAttr "deps" replitImport then replitImport.deps else [] else [];
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
          ] ++ replitDeps;

          shellHook = ''
            echo "Entering development environment for $(uname -s) on ${system}"
            # Inject environment variables from the .replit file, except HISTFILE
            ${envExports}
            if command -v deno &> /dev/null && [ -z "$CI" ]; then
              echo "Setting up Deno..."
              deno --version
            fi
          '';
        };
      }
    );
}