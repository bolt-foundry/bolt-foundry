# replit.nix
{ pkgs }:

let
  # Import the latest nixos-unstable for any "bleeding-edge" packages you need.
  # Using specific commit from flake.nix for consistency
  unstablePkgs = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/9276d3225945c544c6efab8210686bd7612a9115.tar.gz";
  }) {
    inherit (pkgs) system;          # guarantee we build for the same platform
  };
in
{
  deps = [
    # Base dependencies (from unstable)
    unstablePkgs.deno       # from nixos-unstable
    
    # Everything extra (from stable)
    pkgs.unzip
    pkgs.jupyter
    pkgs.jq
    pkgs.sapling
    pkgs.gh
    pkgs.python311Packages.tiktoken
    pkgs.nodejs_22
    pkgs._1password-cli
    pkgs.typescript-language-server
  ] ++ pkgs.lib.optionals (!pkgs.stdenv.isDarwin) [
    # Linux-only packages
    pkgs.chromium
  ];

  env = {
    # Keep your Deno cache out of the repo snapshot
    DENO_DIR = "${builtins.getEnv "HOME"}/.cache/deno";
  };
}