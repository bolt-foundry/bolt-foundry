{
  description = "Nix flake referencing replit.nix";
  inputs = {
    # nix flake metadata nixpkgs/release-24.11 --json | jq ".revision"
    nixpkgs.url = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        replit = import ./replit.nix { 
          inherit pkgs system; 
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.git ] ++ replit.deps;
          shellHook = ''
            deno install
          '';
        };
      }
    );
}