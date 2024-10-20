{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgsForSystem = nixpkgsSource:
          let
            filteredSrc = builtins.filterSource
              (path: type: baseName: ! (builtins.match ".*/\\.sl" baseName != null))
              ./.;

            overlayedNixpkgs = import nixpkgsSource {
              inherit system filteredSrc;
              overlays = [ (import ./infra/nixpkgs/overlay.nix) ];
              config.allowUnfree = true;
            };
          in
          overlayedNixpkgs;

        pkgs = pkgsForSystem nixpkgs;
        unstablePkgs = pkgsForSystem nixpkgs-unstable;

        sharedPackages = with pkgs; [
          unstablePkgs.deno
          ffmpeg
          yarn
          nodejs_22
        ];

        defaultPackages = with pkgs; [
          watchman
          sapling
          gh
          jupyter
        ];

        devShellPackages = with pkgs; [
          jq
          unstablePkgs.livekit-cli  # Use pkgs instead of overlayedNixpkgs
        ];

        deployPackages = with pkgs; [
          direnv
        ];
      in
      rec {
        packages.default = pkgs.buildEnv {
          name = "defaultPackage";
          paths = sharedPackages ++ defaultPackages;
        };

        packages.deploy = pkgs.buildEnv {
          name = "deploy";
          paths = deployPackages ++ sharedPackages;
        };

        devShells.default = pkgs.mkShell {
          nativeBuildInputs = sharedPackages ++ devShellPackages ++ defaultPackages;
        };
      }
    );
}