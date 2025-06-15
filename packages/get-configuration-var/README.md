# get-configuration-var

Secure configuration and secret management for Bolt Foundry applications.

## Overview

This package provides a unified interface for accessing configuration variables
and secrets from 1Password, with support for:

- Environment variable precedence
- Browser-safe secret injection
- In-memory caching
- Replit compatibility
- External application integration

## Installation

The package is automatically available in all Bolt Foundry applications. For
external apps, you can access secrets using the provided CLI tools.

## Usage

### In Bolt Foundry Applications

```typescript
import { getSecret } from "@bolt-foundry/get-configuration-var";

// Get a single secret
const apiKey = await getSecret("API_KEY");

// Warm multiple secrets into cache
await warmSecrets(["API_KEY", "DATABASE_URL"]);

// Write secrets to .env file
await writeEnv(".env.local");
```

### Shell Environment Integration

#### Automatic Injection (Recommended)

Install shell integration for automatic secret injection:

```bash
bff secrets:install-shell
```

This adds secret initialization to your shell RC file (`.bashrc` or `.zshrc`).
Secrets will be automatically available in new shell sessions.

#### Manual Injection

For one-time injection into your current shell:

```bash
# Export all secrets to current shell
eval "$(bff secrets:inject --export)"

# Or use the helper function after shell integration
bf_refresh_secrets
```

### External Applications

#### Using bf-env Wrapper

The simplest way for external apps to access secrets:

```bash
# Run any command with secrets injected
bf-env npm start
bf-env python script.py
bf-env cargo run

# Generate .env file for apps that read from it
bf-env --generate .env.local
```

### Caching

To improve performance and reduce 1Password API calls, secrets are cached to a
local file (default: `.env.local`). The cache behavior can be configured:

```bash
# Use a custom cache file location
export BF_SECRETS_CACHE_FILE=/tmp/my-secrets-cache.env

# Set cache TTL to 10 minutes (600 seconds)
export BF_CACHE_TTL_SEC=600

# Check cache status
bff secrets:cache:info

# Force refresh the cache
bff secrets:cache:refresh
```

The cache is automatically used by:

- `bff secrets:inject` commands
- `bff with-secrets` command
- Shell integration scripts

Benefits:

- Faster secret access after initial fetch
- Works offline if cache is still valid
- Reduces authentication prompts
- Shared across different shell sessions

#### Using bff Commands Directly

```bash
# Generate .env file
bff secrets:env .env

# Run command with secrets
bff with-secrets npm start

# List available keys
bff secrets:list
```

### Replit Support

Replit doesn't use traditional `.bashrc` files. Instead, use the `shellHook` in
`replit.nix` for automatic secret injection:

1. **Automatic injection (recommended):** The repository's `replit.nix` is
   already configured with a `shellHook` that:
   - Auto-detects your Bolt Foundry vault
   - Injects secrets when you open a new shell
   - Only runs if you're authenticated with 1Password

2. **Manual injection per session:**
   ```bash
   eval "$(bff --silent secrets:inject --export)"
   ```

   Note: The `--silent` flag suppresses all logging output for clean shell
   evaluation.

3. **Generate .env file for persistence:**
   ```bash
   bff secrets:env
   ```

   This creates a `.env` file that external tools can read directly.

## Environment Variables

The following environment variables control behavior:

- `BF_VAULT_ID` - 1Password vault ID (auto-detected if not set)
- `BF_CACHE_TTL_SEC` - Secret cache TTL in seconds (default: 300)
- `BF_SECRETS_CACHE_FILE` - Path to cache file (default: `.env.local`)
- `BF_IS_REPLIT` - Automatically set when Replit is detected

## Security Notes

1. **Environment Precedence**: Local environment variables always take
   precedence over vault values
2. **Cache Security**: Secrets are cached in-memory only, never written to disk
3. **Browser Safety**: Vault access is disabled in browser environments
4. **Shell History**: Be cautious when using `eval` commands in shells with
   history enabled

## Troubleshooting

### "1Password CLI not found"

Install 1Password CLI:

- macOS: `brew install --cask 1password-cli`
- Linux: Download from [1Password CLI](https://developer.1password.com/docs/cli)
- Replit: Already included in `replit.nix`

### "Not authenticated with 1Password"

Run `op signin` to authenticate with 1Password.

### Secrets not available in external scripts

Use one of these approaches:

1. Run script with `bf-env`: `bf-env ./my-script.sh`
2. Source .env file: `source .env && ./my-script.sh`
3. Install shell integration: `bff secrets:install-shell`

### Replit-specific issues

Replit doesn't support traditional shell RC files. Use the shellHook in
`replit.nix` or manually inject secrets each session.

## API Reference

### Core Functions

- `getSecret(key: string): Promise<string | undefined>` - Get a single secret
- `warmSecrets(keys?: string[]): Promise<void>` - Pre-fetch secrets into cache
- `writeEnv(path?: string, keys?: string[]): Promise<void>` - Write .env file

### CLI Commands

- `bff secrets:inject` - Show commands to inject secrets (uses cache if
  available)
- `bff secrets:inject --export` - Output export commands for eval (uses cache if
  available)
- `bff secrets:env [path]` - Write .env file
- `bff secrets:list` - List available configuration keys
- `bff secrets:vaults` - List 1Password vaults and set BF_VAULT_ID
- `bff with-secrets <cmd>` - Run command with secrets (uses cache if available)
- `bff secrets:install-shell` - Install shell integration
- `bff secrets:cache:refresh` - Force refresh of the secrets cache
- `bff secrets:cache:info` - Show cache status and configuration

### Helper Scripts

- `bf-env` - Wrapper for running commands with secrets
- `init-secrets.sh` - Shell initialization script
- `install-shell-init.sh` - Shell integration installer
