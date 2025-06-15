#!/usr/bin/env bash
# install-shell-init.sh - Install Bolt Foundry secrets shell initialization

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INIT_SCRIPT="$SCRIPT_DIR/init-secrets.sh"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Bolt Foundry Secrets Shell Integration Installer${NC}"
echo

# Detect shell
SHELL_NAME=$(basename "$SHELL")
echo "Detected shell: $SHELL_NAME"

# Determine RC file
case "$SHELL_NAME" in
    bash)
        RC_FILE="$HOME/.bashrc"
        ;;
    zsh)
        RC_FILE="$HOME/.zshrc"
        ;;
    *)
        echo -e "${YELLOW}Warning: Unsupported shell '$SHELL_NAME'. Manual setup required.${NC}"
        echo "Add the following line to your shell's initialization file:"
        echo "  source '$INIT_SCRIPT'"
        exit 1
        ;;
esac

# Check if already installed
if [ -f "$RC_FILE" ] && grep -q "init-secrets.sh" "$RC_FILE"; then
    echo -e "${GREEN}Bolt Foundry secrets initialization is already installed.${NC}"
    exit 0
fi

# Create RC file if it doesn't exist
if [ ! -f "$RC_FILE" ]; then
    echo "Creating $RC_FILE..."
    touch "$RC_FILE"
fi

# Add initialization
echo "Adding Bolt Foundry secrets initialization to $RC_FILE..."
cat >> "$RC_FILE" << EOF

# Bolt Foundry Secrets Initialization
# Added by install-shell-init.sh on $(date)
if [ -f "$INIT_SCRIPT" ]; then
    source "$INIT_SCRIPT"
fi
EOF

echo -e "${GREEN}Installation complete!${NC}"
echo
echo "To activate immediately, run:"
echo -e "  ${BLUE}source $RC_FILE${NC}"
echo
echo "Or start a new shell session."
echo
echo "Available commands:"
echo -e "  ${BLUE}bf_refresh_secrets${NC} - Manually refresh secrets from 1Password"