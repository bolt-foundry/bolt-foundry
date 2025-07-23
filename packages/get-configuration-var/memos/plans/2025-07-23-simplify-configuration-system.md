# Implementation Plan: Simplify Configuration System

## Overview

The current `get-configuration-var` system has grown complex with multiple entry
points, caching layers, shell integration, and generated configuration keys.
This plan simplifies the system while maintaining:

- **Centralized 1Password management** for all secrets
- **Public/private secret distinction** for frontend safety
- **Local development overrides** capability
- **Clean separation** between 1Password secrets and local env vars

## Goals

| Goal                       | Description                                        | Success Criteria                                     |
| -------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Single sync command        | One command to fetch all secrets from 1Password    | `bft secrets:sync` replaces 5+ different commands    |
| Clear source separation    | Distinguish 1Password secrets from local overrides | Separate `.env.secrets` and `.env.local` files       |
| Maintain security boundary | Keep private secrets out of frontend               | Public/private key configuration prevents leaks      |
| Simplified codebase        | Remove unnecessary complexity                      | Eliminate shell integration, caching, auto-detection |
| Production ready           | Clean path for container deployments               | Standard env var loading for production              |

## Current Complexity (To Remove)

**Multiple Entry Points:**

- `bff inject-secrets` → `.env.local` file
- `bff secrets:inject --export` → shell exports
- `bff with-secrets <cmd>` → command wrapper
- `bf-env <cmd>` → external app wrapper
- Auto shell injection via `init-secrets.sh`

**Unnecessary Features:**

- TTL-based caching system
- Vault auto-discovery logic
- Replit environment detection
- Shell initialization scripts
- Generated configuration keys with hardcoded vault IDs

## Proposed Solution

### 1. Single Sync Command

```bash
# One command to fetch all secrets
bft secrets:sync

# Optional: sync only specific secret sets
bft secrets:sync --public-only
bft secrets:sync --private-only
```

### 2. Separate Secret Sources

**File Structure:**

```
.env.secrets    # 1Password secrets (committed to .gitignore)
.env.local      # Local developer overrides (committed to .gitignore)  
.env.example    # Template showing required keys (committed)
```

**Load Priority:**

1. `.env.local` (highest - local overrides)
2. `.env.secrets` (1Password secrets)
3. System environment (lowest)

### 3. Static Configuration

Replace generated `configKeys.ts` with simple static config:

```typescript
// config/secrets.ts
export const SECRETS_CONFIG = {
  public: [
    "POSTHOG_API_KEY",
    "GOOGLE_OAUTH_CLIENT_ID",
    "LOG_LEVEL",
  ] as const,

  private: [
    "DATABASE_URL",
    "JWT_SECRET",
    "OPENAI_API_KEY",
    "GOOGLE_OAUTH_CLIENT_SECRET",
  ] as const,
} as const;

export const ALL_SECRETS = [
  ...SECRETS_CONFIG.public,
  ...SECRETS_CONFIG.private,
] as const;

export type PublicSecret = typeof SECRETS_CONFIG.public[number];
export type PrivateSecret = typeof SECRETS_CONFIG.private[number];
export type SecretKey = typeof ALL_SECRETS[number];
```

### 4. Simplified Core API

```typescript
// packages/get-configuration-var/get-configuration-var.ts

// Load secrets from files (replaces complex 1Password integration)
function loadSecretsFromFiles(): Record<string, string> {
  const secrets = {};

  // Load .env.secrets (1Password)
  if (exists(".env.secrets")) {
    Object.assign(secrets, parseEnvFile(".env.secrets"));
  }

  // Load .env.local (overrides)
  if (exists(".env.local")) {
    Object.assign(secrets, parseEnvFile(".env.local"));
  }

  return secrets;
}

// Simple public API (unchanged)
export function getConfigurationVariable(name: string): string | undefined {
  return getEnv(name); // checks system env → loaded secrets
}

// Frontend-safe secret getter
export function getPublicSecrets(): Record<PublicSecret, string> {
  const secrets = loadSecretsFromFiles();
  const publicSecrets = {};

  for (const key of SECRETS_CONFIG.public) {
    if (secrets[key]) {
      publicSecrets[key] = secrets[key];
    }
  }

  return publicSecrets;
}
```

### 5. BFT Command Implementation

```typescript
// infra/bft/tasks/secrets.bft.ts
register("secrets:sync", "Sync secrets from 1Password", async (args) => {
  const publicOnly = args.includes("--public-only");
  const privateOnly = args.includes("--private-only");

  // Determine which keys to fetch
  let keysToFetch = ALL_SECRETS;
  if (publicOnly) keysToFetch = SECRETS_CONFIG.public;
  if (privateOnly) keysToFetch = SECRETS_CONFIG.private;

  // Get vault ID (require explicit configuration)
  const vaultId = getConfigurationVariable("BF_VAULT_ID");
  if (!vaultId) {
    logger.error("BF_VAULT_ID not set. Run: export BF_VAULT_ID=<vault-id>");
    return 1;
  }

  // Fetch secrets using op inject
  const template = {};
  keysToFetch.forEach((key) => {
    template[key] = `op://${vaultId}/${key}/value`;
  });

  const result = await runOpInject(template);

  // Write to .env.secrets
  const envLines = Object.entries(result)
    .filter(([key, value]) => value && value !== template[key]) // filter failures
    .map(([key, value]) => `${key}="${value}"`);

  await Deno.writeTextFile(".env.secrets", envLines.join("\n") + "\n");

  logger.info(`✅ Synced ${envLines.length} secrets to .env.secrets`);
});
```

## Migration Plan

### Phase 1: New Command (1-2 days)

- [ ] Create static `config/secrets.ts` file
- [ ] Implement `bft secrets:sync` command
- [ ] Update `get-configuration-var.ts` to read from `.env.secrets`
- [ ] Test with existing applications

### Phase 2: Remove Complexity (1 day)

- [ ] Deprecate old BFF commands (`inject-secrets`, `secrets:inject`, etc.)
- [ ] Remove shell integration scripts
- [ ] Remove caching logic
- [ ] Remove generated `configKeys.ts`

### Phase 3: Documentation (0.5 days)

- [ ] Update README with new workflow
- [ ] Create migration guide for existing users
- [ ] Update deployment documentation

## Success Metrics

- [ ] Single `bft secrets:sync` command works for all use cases
- [ ] No more generated configuration files
- [ ] Clear separation between 1Password secrets and local overrides
- [ ] Frontend builds only receive public secrets
- [ ] Codebase complexity reduced by ~70% (remove ~300 lines of complexity)
- [ ] Zero breaking changes to existing `getConfigurationVariable()` API

## Non-Goals

- **Don't change production deployment**: This focuses on dev-time
  simplification
- **Don't change core API**: `getConfigurationVariable()` remains unchanged
- **Don't remove 1Password**: Keep centralized secret management
- **Don't break existing apps**: Maintain backward compatibility during
  transition

## Key Decisions

| Decision                 | Reasoning                                   | Alternative Considered                                   |
| ------------------------ | ------------------------------------------- | -------------------------------------------------------- |
| Static config file       | Eliminates build-time generation complexity | Keep generated keys (rejected - too complex)             |
| Separate .env files      | Clear separation of secret sources          | Single .env.local (rejected - mixed sources)             |
| Explicit vault ID        | Removes auto-discovery complexity           | Keep vault discovery (rejected - unreliable)             |
| Remove shell integration | Eliminates major complexity source          | Keep for convenience (rejected - too complex)            |
| Remove caching           | Simplifies mental model                     | Keep for performance (rejected - premature optimization) |

## Implementation Notes

- **Vault ID**: Require explicit `BF_VAULT_ID` configuration (no auto-discovery)
- **Error handling**: Fail fast with clear error messages
- **Backward compatibility**: Keep existing API working during transition
- **Production path**: This only affects development; production uses container
  secrets

This plan reduces the configuration system from ~800 lines across multiple files
to ~200 lines in 2 files, while maintaining all essential functionality.

## Appendix: Related Files in Codebase

### Core Configuration Package

- **`packages/get-configuration-var/get-configuration-var.ts`** - Main
  configuration module with `getConfigurationVariable()` and `getSecret()`
  functions
- **`packages/get-configuration-var/scripts/bf-env`** - Bash wrapper script
  providing `bf-env <command>` functionality
- **`packages/get-configuration-var/scripts/init-secrets.sh`** - Shell
  initialization script with auto-export and caching
- **`packages/get-configuration-var/scripts/install-shell-init.sh`** - Installer
  for shell integration setup
- **`packages/get-configuration-var/__tests__/get-configuration-var.test.ts`** -
  Unit tests for configuration functions
- **`packages/get-configuration-var/__tests__/shell-integration.test.sh`** -
  Shell script integration tests

### BFF Commands (To Be Deprecated)

- **`infra/bff/friends/inject-secrets.bff.ts`** - Implements
  `bff inject-secrets` command
- **`infra/bff/friends/secrets.bff.ts`** - Comprehensive secrets management
  commands (`secrets:inject`, `with-secrets`, etc.)
- **`infra/bff/friends/genConfigKeys.bff.ts`** - Generates TypeScript config
  types from 1Password tags

### Generated Files (To Be Removed)

- **`apps/boltFoundry/__generated__/configKeys.ts`** - Auto-generated TypeScript
  definitions with `PUBLIC_CONFIG_KEYS` and `PRIVATE_CONFIG_KEYS`

### Environment Files

- **`examples/nextjs-minimal/.env.example`** - Example environment file format
  for consumer apps
