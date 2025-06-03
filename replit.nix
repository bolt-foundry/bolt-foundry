# replit.nix
{ pkgs, system ? builtins.currentSystem }:

let
  # grab the outputs of the flake at the repo root
  flake = (builtins.getFlake ("path:" + builtins.toString ./.));
in
{
  # call the helper with Replit’s own `pkgs`
  deps = flake.replitDeps { inherit pkgs system; };
}
