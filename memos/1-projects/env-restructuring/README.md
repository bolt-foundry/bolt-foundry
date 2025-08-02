# Environment Variable System Restructuring

This folder contains the implementation plans for restructuring our environment
variable and secrets management system.

## Overview

The restructuring is divided into three phases:

### [Phase 1: Secrets Management](./phase-1-secrets-management.md)

- Rename `.env.client` → `.env.config` and `.env.server` → `.env.secrets` for
  clarity
- Use 1Password tags (`BF_PUBLIC_CONFIG` and `BF_PRIVATE_SECRET`) as source of
  truth
- Improve sync behavior to handle missing secrets gracefully

### [Phase 2: Unified Environment Access](./phase-2-unified-env-access.md)

- Replace `getConfigurationVariable` with `injectEnvironment(import.meta)`
- Provide type-safe access via `import.meta.env`
- Unify frontend and backend environment variable access patterns

### [Phase 3: Legacy Code Cleanup](./phase-3-legacy-cleanup.md)

- Remove `getConfigurationVariable` package entirely
- Clean up old environment file references
- Delete deprecated BFF/BFT commands
- Ensure no manual env access remains

## Goals

1. **Clarity**: File names and APIs that clearly indicate purpose
2. **Type Safety**: Full TypeScript support for all environment variables
3. **Developer Experience**: Consistent patterns and helpful error messages
4. **Security**: Clear separation between public config and private secrets

## Migration

Both phases are designed to support gradual migration with backwards
compatibility during the transition period.
