# Environment and Secrets Management Restructuring

## Overview

This memo outlines the plan to restructure our environment variable and secrets
management system to better reflect the actual purpose of different
configuration types and improve the developer experience.

## Current Problems

1. **Confusing Naming**: `.env.client` and `.env.server` don't accurately
   reflect their purpose
2. **All-or-Nothing Sync**: When any secret is missing from 1Password, the sync
   creates empty files
3. **Inverted Control Flow**: Example files dictate what to fetch from
   1Password, rather than 1Password being the source of truth
4. **Poor Error Handling**: Missing secrets cause the entire sync to fail
   silently

## Proposed Solution

### 1. Rename Files for Clarity

- `.env.client` → `.env.config` (public configuration values)
- `.env.server` → `.env.secrets` (sensitive values requiring 1Password)
- Keep example files for type generation: `.env.config.example` and
  `.env.secrets.example`

### 2. Use 1Password Tags

Instead of using example files to determine what to sync, use explicit tags in
1Password:

- `BF_PUBLIC_CONFIG` - Items tagged with this go to `.env.config`
- `BF_PRIVATE_SECRET` - Items tagged with this go to `.env.secrets`
- Untagged items are skipped with a warning

### 3. Improved Sync Behavior

- Only sync items that exist in 1Password (no empty values)
- Skip missing items gracefully
- Clear feedback about what was synced vs skipped
- Users can override any value using `.env.local`

### 4. System Environment Loading

After sync, ensure environment variables are loaded into the system using one
of:

- **direnv**: Automatically loads `.env.*` files when entering the project
  directory
- **Nix devShell**: Can source env files as part of the development shell

We'll update `.envrc` to properly load the new file structure:

```bash
# .envrc
source_env_if_exists .env.config
source_env_if_exists .env.secrets  
source_env_if_exists .env.local
```

## Implementation Plan

### Step 1: File Renaming

1. Rename physical files
2. Update all code references
3. Update documentation

### Step 2: Update Type Generation

1. Update `packages/env/generate-types.ts`
2. Update `packages/env/vite-plugin.ts`
3. Regenerate `env.d.ts`

### Step 3: Refactor Secrets Sync

1. Modify `infra/bft/tasks/secrets.bft.ts`:
   - Query items by tag instead of reading example files
   - Only write values that exist in 1Password
   - Add proper feedback for synced/skipped items

### Step 4: Update 1Password Vault

1. Tag existing items appropriately
2. Document tagging convention

## Files to Update

- `/infra/bft/tasks/secrets.bft.ts` - Main sync logic
- `/packages/env/generate-types.ts` - Type generation
- `/packages/env/vite-plugin.ts` - Vite integration
- `/packages/env/README.md` - Documentation
- `/packages/env/__tests__/*.test.ts` - Tests
- `/.envrc` - Update direnv configuration
- `/flake.nix` or `/shell.nix` - Update Nix shell if needed
- All references to `.env.client` and `.env.server` throughout codebase

## Migration Steps for Developers

1. Run `mv .env.client .env.config && mv .env.server .env.secrets`
2. Update any local scripts that reference old names
3. Run `bft secrets sync` with new implementation

## Benefits

1. **Clearer Intent**: File names match their actual purpose
2. **Better Control**: 1Password is the source of truth
3. **Graceful Degradation**: Missing secrets don't break the entire sync
4. **Improved DX**: Clear feedback about what's happening

## Notes

- Keep example files for type generation and documentation
- Maintain backwards compatibility during transition
- Consider adding a migration command to help developers update
