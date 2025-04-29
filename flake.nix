{
  inputs = {
    nixpkgs.url     = "github:NixOS/nixpkgs/26e168479fdc7a75fe55e457e713d8b5f794606a";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    let
      mkDeps = { pkgs, system }:
        let
          unstablePkgs = import (builtins.fetchTarball {
            url    = "https://github.com/NixOS/nixpkgs/archive/5b0bc905a940438854c6f4e9d1947d7ce5ad7a88.tar.gz";
            sha256 = "17bz4ns251l05apaayx4q7zlrva48gajgg5fym70f1i7656fx0jz";
          }) { inherit system; };
        in [
          pkgs.unzip pkgs.jupyter pkgs.jq pkgs.sapling pkgs.gh
          pkgs.python311Packages.tiktoken
          unstablePkgs.deno
          pkgs.nodejs_20 pkgs.chromium
        ] ++ pkgs.lib.optionals (!pkgs.stdenv.isDarwin) [ pkgs.chromium ];
    in

    # ── per-system stuff ────────────────────────────────────────────
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = mkDeps { inherit pkgs system; };
        };
      })

    # ── top-level things (merged in) ───────────────────────────────
    //
    {
      # Replit will call this — note: NOT inside the loop.
                    replitDeps = { pkgs, system ? builtins.currentSystem, ... }:
        mkDeps { inherit pkgs system; };
    };
}
