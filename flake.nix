{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
  };
  inputs.nix-github-actions.url = "github:nix-community/nix-github-actions";
  inputs.nix-github-actions.inputs.nixpkgs.follows = "nixpkgs";

  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable, nix-github-actions }:
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

        # Add to this to make it everywhere
        # Be sure to run `bff nix` to build
        sharedPackages = with pkgs; [
          unstablePkgs.deno
          ffmpeg
          yarn
          nodejs_22
        ];

        # Add to this to make it available in VS Code and most places on the system. The larger this is, the larger the deploy, so try to keep it slim.
        # Be sure to run `bff nix` to build
        defaultPackages = with pkgs; [
          watchman
          sapling
          gh
          jupyter
        ];

        # These are dev-only packages, used for building etc. They're only available where direnv is available, ie the replit shell.
        # these packages show up with "direnv allow"
        devShellPackages = with pkgs; [
          jq
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
          nativeBuildInputs = sharedPackages ++ devShellPackages ++ defaultPackages;
        };
        githubActions = nix-github-actions.lib.mkGithubMatrix { checks = self.packages; };
        packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;
        packages.x86_64-linux.default = self.packages.x86_64-linux.hello;
      }
    );
  
}
