{
  description = "Nix flake referencing replit.nix with symlink filtering";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };

      filteredSrc = pkgs.lib.cleanSourceWith {
        src = ./.;
        filter = path: type: !(type == "symlink" && builtins.readDir path != {});
      };

      replit = import (filteredSrc + "/replit.nix") { inherit pkgs; };

    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [ pkgs.git ] ++ replit.deps;
        shellHook = ''
          deno install
        '';
      };
    };
}
