#!/bin/bash
set -e

# Inject secrets
bff inject-secrets

# List files (for debugging)
ls -la

# Source environment variables
source ./.env.local

# Run the build
bff build