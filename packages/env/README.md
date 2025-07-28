# Environment Variables

This package provides a universal environment variable system that works across
both server (Deno) and client (Vite) environments.

## Quick Start

```typescript
import { env } from "@bfmono/packages/env/mod.ts";

// Access environment variables with automatic type conversions
const apiKey = env.OPENAI_API_KEY;
const isProd = env.PROD; // boolean
const logLevel = env.LOG_LEVEL ?? "info";
```

## Setup

1. **Define your variables** in example files:
   - `.env.client.example` - Client-safe variables (exposed to browser)
   - `.env.server.example` - Server-only variables (never exposed to browser)

2. **Sync from 1Password**:
   ```bash
   bft secrets sync
   ```
   This creates `.env.client` and `.env.server` with values from 1Password.

3. **TypeScript support** is auto-generated in `env.d.ts` with environment-aware
   types.

## Environment Files

- `.env.client` - Client-safe variables from 1Password
- `.env.server` - Server-only secrets from 1Password
- `.env.local` - Local development overrides (highest priority)

## Features

- **Automatic loading** from `.env.client`, `.env.server`, and `.env.local`
  files
- **Type conversions** - `"true"`/`"false"` strings become booleans
- **Priority order** - System env > `.env.local` > `.env.server` > `.env.client`
- **Special properties** - `MODE`, `PROD`, `DEV`, `SSR`, `BASE_URL`
- **Works everywhere** - No module isolation issues

## Migration from getConfigurationVariable

```typescript
// Old way (deprecated)
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
const apiKey = getConfigurationVariable("OPENAI_API_KEY");

// New way
import { env } from "@bfmono/packages/env/mod.ts";
const apiKey = env.OPENAI_API_KEY;
```

## Type Safety

The system provides environment-aware TypeScript types:

- **Client code** can only access client-safe variables
- **Server code** can access all variables
- Full auto-completion and type checking

## Commands

- `bft secrets sync` - Sync all variables from 1Password
- `bft secrets sync --client-only` - Sync only client variables
- `bft secrets sync --server-only` - Sync only server variables
- `bft secrets list` - List all available variables
- `bft secrets generate-types` - Regenerate TypeScript definitions
