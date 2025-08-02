# Phase 2: Unified Environment Variable Access

## Overview

This memo outlines the plan to replace the current `getConfigurationVariable`
function with a standardized `injectEnvironment(import.meta)` pattern that works
seamlessly across frontend and backend environments.

## Current Problems

1. **Inconsistent Access Patterns**: Different parts of the codebase use
   different methods to access env vars
2. **No Type Safety**: `getConfigurationVariable` returns `string | undefined`
   with no compile-time guarantees
3. **Frontend/Backend Split**: Different mechanisms for client vs server
   environments
4. **Runtime Errors**: Missing required variables only discovered at runtime
5. **No Validation**: Values aren't validated or transformed (e.g., string →
   number for ports)

## Proposed Solution

### Core API

```typescript
// Usage in any file
import { injectEnvironment } from "@bfmono/packages/env";

// Creates/augments import.meta.env with proper typing
injectEnvironment(import.meta);

// Now access with full type safety
const apiKey = import.meta.env.OPENAI_API_KEY; // string (required)
const port = import.meta.env.WEB_PORT; // number (with default 8000)
const debug = import.meta.env.DEBUG_MODE; // boolean
```

### Key Features

1. **Universal Pattern**: Same API for frontend and backend
2. **Type Safety**: Full TypeScript support based on env.d.ts
3. **Build-time Validation**: Required vars checked during build
4. **Smart Loading**:
   - Backend: Loads from `.env.secrets`, `.env.config`, `.env.local`
   - Frontend: Only includes `.env.config` values (via Vite plugin)
5. **Value Transformation**: Automatic parsing of numbers, booleans, JSON

### Implementation Details

#### 1. The `injectEnvironment` Function

```typescript
export function injectEnvironment(meta: ImportMeta): void {
  // Detect environment (browser vs Deno/Node)
  const isBrowser = typeof window !== "undefined";

  if (!meta.env) {
    meta.env = {} as ImportMetaEnv;
  }

  if (isBrowser) {
    // In browser, env vars are already injected by Vite
    // Just add type guards and validation
    validateRequiredVars(meta.env, "config");
  } else {
    // In server, load from files
    loadEnvFiles();
    Object.assign(meta.env, processEnvVars());
    validateRequiredVars(meta.env, "all");
  }
}
```

#### 2. Build-time Plugin

Update Vite plugin to:

- Inject only `.env.config` values into client bundles
- Generate proper `import.meta.env` types
- Validate required variables at build time

#### 3. Type Generation

Enhance `env.d.ts` generation to include:

```typescript
interface ImportMetaEnv {
  // From .env.config.example
  readonly POSTHOG_API_KEY?: string;
  readonly LOG_LEVEL: "debug" | "info" | "warn" | "error";
  readonly WEB_PORT: number;

  // From .env.secrets.example (server only)
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  // ... etc
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Migration Strategy

### Step 1: Build Infrastructure

1. Create `packages/env/inject.ts` with `injectEnvironment`
2. Update type generation to support `ImportMetaEnv`
3. Add build-time validation

### Step 2: Gradual Migration

1. Keep `getConfigurationVariable` working (delegate to new system)
2. Migrate one app at a time
3. Update documentation and examples

### Step 3: Cleanup

1. Remove `getConfigurationVariable`
2. Remove old env loading code
3. Final documentation update

## Benefits

1. **Better DX**: Autocomplete and type checking for all env vars
2. **Safer**: Required variables validated at build time
3. **Consistent**: Same pattern everywhere
4. **Performance**: Client bundles only include necessary config
5. **Standards-based**: Uses `import.meta.env` like Vite/Deno

## Example Migration

Before:

```typescript
import { getConfigurationVariable } from "@bfmono/packages/get-configuration-var";

const apiKey = getConfigurationVariable("OPENAI_API_KEY");
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required");
}
const port = parseInt(getConfigurationVariable("WEB_PORT") || "8000");
```

After:

```typescript
import { injectEnvironment } from "@bfmono/packages/env";

injectEnvironment(import.meta);

const apiKey = import.meta.env.OPENAI_API_KEY; // Type: string (required)
const port = import.meta.env.WEB_PORT; // Type: number, defaults to 8000
```

## Files to Create/Update

- `/packages/env/inject.ts` - Core injection logic
- `/packages/env/types.ts` - Type definitions
- `/packages/env/validate.ts` - Validation logic
- `/packages/env/transform.ts` - Value transformation
- `/packages/env/vite-plugin.ts` - Enhanced Vite plugin
- `/packages/env/generate-types.ts` - Enhanced type generation

## Open Questions

1. Should we support `.env.${BF_ENV}` files (e.g., `.env.production`)?
2. How to handle secrets in CI/CD without 1Password?
3. Should we add runtime validation schemas (e.g., with Zod)?
4. How to integrate with direnv/Nix for system-level environment loading?

## Notes

- Maintain backwards compatibility during migration
- Consider adding codemod for automated migration
- Add comprehensive tests for edge cases
