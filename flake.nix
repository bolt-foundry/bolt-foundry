{
  description = "Nix flake referencing replit.nix";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
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