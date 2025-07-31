# @bolt-foundry/inject-environment

Environment variable injection utilities that provide a unified interface for
accessing environment variables across different runtime environments (Deno,
Node.js, browsers).

## Usage

```typescript
import { injectEnvironment } from "@bolt-foundry/inject-environment";

// Call at the top of your module
await injectEnvironment(import.meta);

// Now you can use environment variables like in Vite!
console.log(import.meta.env.MODE); // "development" or "production"
console.log(import.meta.env.DEV); // true in development
console.log(import.meta.env.PROD); // true in production
console.log(import.meta.env.SSR); // true on server, false in browser
console.log(import.meta.env.BASE_URL); // "/"
```

## TypeScript Support

The monorepo has sophisticated TypeScript types that distinguish between client
and server environments:

- **Client environment** (browser): Only has access to client-safe variables
- **Server environment** (Deno/Node): Has access to all variables including
  secrets

### Accessing Custom Environment Variables

```typescript
// For variables that exist in both client and server
if (import.meta.env.POSTHOG_API_KEY) {
  initPosthog(import.meta.env.POSTHOG_API_KEY);
}

// For server-only variables (like DATABASE_URL)
if (import.meta.env.SSR) {
  // TypeScript knows these are only available on server
  const db = connect(import.meta.env.DATABASE_URL!);
}

// For dynamic variable access (server type + index signature)
const env = import.meta.env as ImportMetaEnv.Server & Record<string, any>;
const customVar = env.MY_CUSTOM_VAR || "default";
```

### Extending Types for Your Variables

Create a `.d.ts` file in your project:

```typescript
declare global {
  interface ClientEnvVars {
    readonly MY_PUBLIC_API_URL?: string;
  }

  interface ServerEnvVars {
    readonly MY_SECRET_KEY?: string;
  }
}

export {};
```

## Options

```typescript
await injectEnvironment(import.meta, {
  envPath: ".env.local", // Path to env file (default: ".env.local")
  debug: true, // Log debug information
  override: false, // Override existing values (default: false)
});
```

## How It Works

1. Loads variables from `.env.local` file (if it exists)
2. Merges with system environment variables (Deno.env)
3. In browsers, also checks `globalThis.__ENVIRONMENT__`
4. Populates `import.meta.env` with all variables
5. Sets Vite-compatible defaults (MODE, DEV, PROD, SSR, BASE_URL)

## Migration from getConfigurationVariable

The old `getConfigurationVariable` function is still available for backward
compatibility:

```typescript
import { getConfigurationVariable } from "@bolt-foundry/inject-environment";

// Old way (still works)
const apiKey = getConfigurationVariable("API_KEY");

// New way (recommended)
await injectEnvironment(import.meta);
const apiKey = import.meta.env.API_KEY;
```
