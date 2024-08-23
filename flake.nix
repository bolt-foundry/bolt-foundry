{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
    nix-github-actions.url = "github:nix-community/nix-github-actions";
  };
  inputs.nix-github-actions.inputs.nixpkgs.follows = "nixpkgs";

  outputs = { self, nixpkgs, flake-utils, nixpkgs-unstable, nix-github-actions }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];

      pkgsForSystem = system: nixpkgsSource:
        import nixpkgsSource {
          inherit system;
          overlays = [ ];
          config.allowUnfree = true;
        };

      forAllSystems = nixpkgs.lib.genAttrs systems;

      packageSetsForSystem = system:
        let
          pkgs = pkgsForSystem system nixpkgs;
          unstablePkgs = pkgsForSystem system nixpkgs-unstable;
        in
        {
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
          ];

          deployPackages = with pkgs; [
          ];
        };

      packageSets = forAllSystems packageSetsForSystem;

    in
    flake-utils.lib.eachSystem systems (system:
      let
        pkgs = pkgsForSystem system nixpkgs;
        sets = packageSets.${system};
      in
      rec {
        packages.default = pkgs.buildEnv {
          name = "defaultPackage";
          paths = sets.sharedPackages ++ sets.defaultPackages;
        };

        packages.deploy = pkgs.buildEnv {
          name = "deploy";
          paths = sets.sharedPackages ++ sets.deployPackages;
        };

        packages.hello = pkgs.hello;

        devShells.default = pkgs.mkShell {
          nativeBuildInputs = sets.sharedPackages ++ sets.devShellPackages ++ sets.defaultPackages;
        };
      }
      
    ) // {
      packageSets = packageSets;

      githubActions = nix-github-actions.lib.mkGithubMatrix {
        checks = nixpkgs.lib.getAttrs [ "x86_64-linux" "x86_64-darwin" ] self.checks;
      };
    };
}