#!/usr/bin/env bash
# Shared environment setup for development shells and containers
# Source this file to set up the Bolt Foundry environment

# Determine the root directory
# In container: /workspace
# In dev shell: current directory
if [ -d "/workspace" ] && [ -d "/workspace/infra/bin" ]; then
  export BF_ROOT="/workspace"
else
  export BF_ROOT="$PWD"
fi

# Add infra/bin to PATH
export PATH="$BF_ROOT/infra/bin:$PATH"

# Set DENO_DIR to keep cache out of repo
export DENO_DIR="${HOME}/.cache/deno"

# Set GitHub repository for gh CLI commands
export GH_REPO="bolt-foundry/bolt-foundry"

# Additional environment-specific setup can be added after sourcing this file