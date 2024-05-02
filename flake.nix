{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable }:
    let

      pkgsForSystem = system: nixpkgsSource:
        let
          filteredSrc = builtins.filterSource
            (path: type: baseName: ! (builtins.match ".*/\\.sl" baseName != null))
            ./.;

          overlayedNixpkgs = import nixpkgsSource {
            inherit system filteredSrc;

            overlays = [ ];
            config.allowUnfree = true;
          };
        in
        overlayedNixpkgs;

    in
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = pkgsForSystem system nixpkgs;
        unstablePkgs = pkgsForSystem system nixpkgs-unstable;

        sharedPackages = with pkgs; [
          unstablePkgs.deno
          _1password
          ffmpeg
        ];

        defaultPackages = with pkgs; [
          yarn
        ];

        devShellPackages = with pkgs; [
          jq
          jupyter
          watchman
          git
          unstablePkgs.sapling
        ];

        deployPackages = with pkgs; [
        ];
      in
      rec {

        # This creates a default environment for defaultPackage and nix profile install
        packages.default = pkgs.buildEnv {
          name = "defaultPackage";
          paths = sharedPackages ++ defaultPackages;
        };

        packages.deploy = pkgs.buildEnv {
          name = "deploy";
          paths = sharedPackages ++ deployPackages;
        };

        # `nix develop` and direnv
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = sharedPackages ++ devShellPackages;
        };
      }
    );
}
