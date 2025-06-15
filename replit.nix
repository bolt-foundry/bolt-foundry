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
  
  # Shell initialization hook for Replit
  # This runs when a new shell is started
  shellHook = ''
    # Set default Bolt Foundry vault if not already set
    if [ -z "$BF_VAULT_ID" ]; then
      echo "Detecting Bolt Foundry vault..."
      # Try to auto-detect BF vault
      BF_VAULT_ID=$(op vault list --format=json 2>/dev/null | jq -r '.[] | select(.name | test("bolt|foundry|bf"; "i")) | .id' | head -1)
      if [ -n "$BF_VAULT_ID" ]; then
        export BF_VAULT_ID
        echo "Auto-detected vault: $BF_VAULT_ID"
      fi
    fi
    
    # Inject secrets if authenticated
    if command -v op &>/dev/null && op whoami &>/dev/null 2>&1; then
      echo "Injecting Bolt Foundry secrets..."
      eval "$(bff --silent secrets:inject --export 2>/dev/null || true)"
    else
      echo "1Password CLI not authenticated. Run 'op signin' to enable secret injection."
    fi
  '';
}