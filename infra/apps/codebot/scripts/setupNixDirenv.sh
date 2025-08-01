#!/usr/bin/env bash
set -euo pipefail

echo "Setting up nix-direnv for faster environment loading..."
echo ""

# Check if nix is installed
if ! command -v nix &> /dev/null; then
    echo "❌ Nix not found. Please install Nix first:"
    echo "   sh <(curl -L https://nixos.org/nix/install)"
    exit 1
fi

# Check if old direnv is installed via Homebrew
if command -v brew &> /dev/null && brew list direnv &> /dev/null 2>&1; then
    echo "Found existing direnv installation via Homebrew."
    echo "Uninstalling old direnv..."
    brew uninstall direnv
    echo "✅ Old direnv uninstalled"
    echo ""
fi

# Install nix-direnv via nix profile
echo "Installing nix-direnv via nix profile..."
nix profile install nixpkgs#nix-direnv

# Get the shell configuration file
SHELL_CONFIG=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    echo "⚠️  Unknown shell: $SHELL"
    echo "Please manually add the following to your shell configuration:"
    echo '  source $HOME/.nix-profile/share/nix-direnv/direnvrc'
    exit 0
fi

# Check if nix-direnv is already sourced
if ! grep -q "nix-direnv/direnvrc" "$SHELL_CONFIG" 2>/dev/null; then
    echo ""
    echo "Adding nix-direnv to $SHELL_CONFIG..."
    echo '' >> "$SHELL_CONFIG"
    echo '# nix-direnv' >> "$SHELL_CONFIG"
    echo 'source $HOME/.nix-profile/share/nix-direnv/direnvrc' >> "$SHELL_CONFIG"
    echo "✅ Added nix-direnv to shell configuration"
else
    echo "✅ nix-direnv already configured in $SHELL_CONFIG"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To activate the changes:"
echo "  1. Reload your shell: source $SHELL_CONFIG"
echo "  2. Re-enter this directory: cd .. && cd -"
echo ""
echo "Your environment will now load much faster! 🚀"