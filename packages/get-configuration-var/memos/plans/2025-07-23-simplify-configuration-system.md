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

| Goal                       | Description                                             | Success Criteria                                          |
| -------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Single sync command        | One command to fetch all secrets from 1Password         | `bft secrets sync` replaces 5+ different commands         |
| Clear source separation    | Distinguish client/server and 1Password/local variables | Separate `.env.client`, `.env.server`, `.env.local` files |
| Maintain security boundary | Keep private secrets out of frontend                    | Public/private key configuration prevents leaks           |
| Simplified codebase        | Remove unnecessary complexity                           | Eliminate shell integration, caching, auto-detection      |
| Production ready           | Clean path for container deployments                    | Standard env var loading for production                   |

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
# One command to fetch all variables to separate files
bft secrets sync

# Optional: sync only specific variable sets
bft secrets sync --client-only    # Only .env.client
bft secrets sync --server-only    # Only .env.server
```

### 2. Separate Environment Files by Security Level

**File Structure:**

```
.env.client              # Client-safe variables (exposed to browser)
.env.server              # Server-only variables (never exposed to browser)
.env.local               # Local developer overrides (committed to .gitignore)
.env.client.example      # Template for client variables (committed)
.env.server.example      # Template for server variables (committed)
```

**Load Priority:**

1. System environment (highest - deployment/shell overrides)
2. `.env.local` (local development overrides)
3. `.env.client` + `.env.server` (1Password synced secrets - lowest)

### 3. Example-Driven Configuration with TypeScript Generation

Use `.env.example` files as the source of truth for both documentation and
TypeScript type generation:

```bash
# .env.client.example - Documents client-safe variables (7 total)
APPS_INTERNALBF_POSTHOG_API_KEY=phc_your_key_here
ENABLE_SPECIFIC_LOGGERS=false
GOOGLE_OAUTH_CLIENT_ID=123456789.apps.googleusercontent.com
LOG_LEVEL=info
LOG_LOGGERS_TO_ENABLE=auth,database
POSTHOG_API_KEY=phc_your_key_here
UNIT_TEST_PUBLIC=test_value
```

```bash
# .env.server.example - Documents server-only variables (28 total)
ASSEMBLY_AI_KEY=your_assembly_ai_key_here
BF_CACHE_ENV=development
BF_CACHE_TTL_SEC=3600
BF_ENV=development
COLLECTOR_PORT=4317
DATABASE_BACKEND=sqlite
DATABASE_URL=postgresql://localhost:5432/boltfoundry
DATABASE_URL_CONTACTS=postgresql://localhost:5432/contacts
DB_BACKEND_TYPE=sqlite
EMAIL_FROM=noreply@boltfoundry.com
EMAIL_HOST=smtp.example.com
EMAIL_PASS=your_email_password
EMAIL_PORT=587
EMAIL_USER=your_email_user
EXAMPLES_NEXTJS_SAMPLE_POSTHOG_API_KEY=phc_sample_key
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_ORG_ID=org-your_organization_id
OPENAI_PROJECT_ID=proj_your_project_id
OPENROUTER_API_KEY=sk-or-your_openrouter_key
THANKSBOT_DISCORD_TO_NOTION_MAP_DATABASE_ID=notion_database_id
THANKSBOT_NOTION_DATABASE_ID=notion_database_id
THANKSBOT_NOTION_TOKEN=secret_notion_token
UNIT_TEST_SECRET=secret_test_value
WAITLIST_API_KEY=your_waitlist_api_key
WEB_PORT=8000
```

**Generated TypeScript Types (Environment-Aware):**

```typescript
// Auto-generated from .env.example files - packages/env/env.d.ts

// Base types for all environments
interface BaseImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

// Client-safe variables (from .env.client.example)
interface ClientEnvVars {
  readonly GOOGLE_OAUTH_CLIENT_ID?: string;
  readonly POSTHOG_API_KEY?: string;
  readonly LOG_LEVEL?: string;
  // ... all 7 client variables
}

// Server-only variables (from .env.server.example)
interface ServerEnvVars {
  readonly DATABASE_URL?: string;
  readonly JWT_SECRET?: string;
  readonly OPENAI_API_KEY?: string;
  // ... all 28 server variables
}

// Environment-aware typing
declare namespace ImportMetaEnv {
  // Client environment: Only client-safe + base variables
  interface Client extends BaseImportMetaEnv, ClientEnvVars {
    readonly SSR: false;
  }

  // Server environment: All variables available
  interface Server extends BaseImportMetaEnv, ClientEnvVars, ServerEnvVars {
    readonly SSR: true;
  }
}

// Runtime environment detection
declare interface ImportMeta {
  readonly env: typeof window extends undefined ? ImportMetaEnv.Server // Server context (Deno)
    : ImportMetaEnv.Client; // Client context (browser)
}
```

**Benefits:**

- **Environment-aware typing** - Client code can't access server-only variables
- **Compile-time safety** - TypeScript prevents accessing unavailable variables
- **Self-documenting** - Example files show developers exactly what's needed
- **Auto-completion** - Full IDE support with environment-specific suggestions
- **Version controlled** - Example files are committed, providing project
  history

### 4. Universal import.meta.env System

Replace the entire configuration system with a universal `import.meta.env`
approach that works across server (Deno) and client (Vite) environments.

```typescript
// packages/env/polyfill.ts - Deno polyfill for import.meta.env
if (typeof Deno !== "undefined" && !import.meta.env) {
  const env = loadEnvironmentVariables();

  Object.defineProperty(import.meta, "env", {
    value: new Proxy({
      MODE: env.NODE_ENV || env.DENO_ENV || "development",
      BASE_URL: "/",
      PROD: (env.NODE_ENV || env.DENO_ENV) === "production",
      DEV: (env.NODE_ENV || env.DENO_ENV) !== "production",
      SSR: true,
    }, {
      get(target: any, key: string) {
        if (key in target) return target[key];
        const value = env[key];
        return value === "true" ? true : value === "false" ? false : value;
      },
    }),
    writable: false,
    configurable: false,
  });
}

function loadEnvironmentVariables(): Record<string, string> {
  const env: Record<string, string> = {};

  // Load .env files in priority order (lowest to highest)
  const envFiles = [".env.client", ".env.server", ".env.local"];

  for (const file of envFiles) {
    try {
      const content = Deno.readTextFileSync(file);
      Object.assign(env, parseEnvFile(content));
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }

  // System environment variables have highest priority and override all file-based values
  Object.assign(env, Deno.env.toObject());

  return env;
}

function parseEnvFile(content: string): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      let value = valueParts.join("=");
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  }

  return vars;
}
```

```typescript
// packages/env/vite-plugin.ts - Vite integration
import type { Plugin } from "vite";

export function boltFoundryEnvPlugin(): Plugin {
  return {
    name: "bolt-foundry-env",
    config(config, { mode }) {
      // Load client-safe variables from .env.client
      const clientEnv = loadClientEnvironment();

      config.define = {
        ...config.define,
        // Replace import.meta.env with actual values
        ...Object.fromEntries(
          Object.entries(clientEnv).map(([key, value]) => [
            `import.meta.env.${key}`,
            JSON.stringify(value),
          ]),
        ),
        "import.meta.env.MODE": JSON.stringify(mode),
        "import.meta.env.PROD": mode === "production",
        "import.meta.env.DEV": mode === "development",
        "import.meta.env.SSR": false,
      };
    },
  };
}

function loadClientEnvironment(): Record<string, string> {
  const clientVars: Record<string, string> = {};

  // Load .env.client and .env.local - anything in these files is client-safe
  // Note: .env.server is excluded for security - server-only variables must never be bundled into client code
  const envFiles = [".env.client", ".env.local"];

  for (const file of envFiles) {
    try {
      const content = readFileSync(file, "utf-8");
      const parsed = parseEnvFile(content);
      Object.assign(clientVars, parsed);
    } catch (error) {
      // File doesn't exist, continue
    }
  }

  return clientVars;
}
```

```typescript
// packages/env/generate-types.ts - Generate environment-aware TypeScript definitions
// This runs automatically as part of 'bft secrets sync' to keep types in sync with variables
export function generateEnvTypes(): string {
  const clientVars = parseEnvFile(Deno.readTextFileSync(".env.client.example"));
  const serverVars = parseEnvFile(Deno.readTextFileSync(".env.server.example"));

  const clientTypes = Object.keys(clientVars)
    .map((key) => `  readonly ${key}?: string;`)
    .join("\n");

  const serverTypes = Object.keys(serverVars)
    .map((key) => `  readonly ${key}?: string;`)
    .join("\n");

  return `// Auto-generated from .env.example files - do not edit manually
// Generated at monorepo root for global TypeScript availability

// Base types for all environments
interface BaseImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

// Client-safe variables (from .env.client.example)
interface ClientEnvVars {
${clientTypes}
}

// Server-only variables (from .env.server.example)  
interface ServerEnvVars {
${serverTypes}
}

// Environment-aware typing
declare namespace ImportMetaEnv {
  // Client environment: Only client-safe + base variables
  interface Client extends BaseImportMetaEnv, ClientEnvVars {
    readonly SSR: false;
  }
  
  // Server environment: All variables available
  interface Server extends BaseImportMetaEnv, ClientEnvVars, ServerEnvVars {
    readonly SSR: true;
  }
}

// Runtime environment detection using window availability
declare interface ImportMeta {
  readonly env: typeof window extends undefined 
    ? ImportMetaEnv.Server  // Server context (Deno)
    : ImportMetaEnv.Client; // Client context (browser)
}`;
}

function parseEnvFile(content: string): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      let value = valueParts.join("=");
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  }

  return vars;
}

// Generate types as part of build process
if (import.meta.main) {
  const types = generateEnvTypes();
  await Deno.writeTextFile("env.d.ts", types);
  console.log("✅ Generated environment-aware TypeScript definitions");
}
```

### 5. Universal Usage Pattern

```typescript
// Works everywhere - both server and client code
const googleClientId = import.meta.env.GOOGLE_OAUTH_CLIENT_ID;
const logLevel = import.meta.env.LOG_LEVEL || "info";
const isProd = import.meta.env.PROD;

// Server-only (polyfill provides access, client build excludes these)
const dbUrl = import.meta.env.DATABASE_URL;
const jwtSecret = import.meta.env.JWT_SECRET;

// Environment-aware typing provides compile-time safety
// Client code gets ImportMetaEnv.Client (no server variables)
// Server code gets ImportMetaEnv.Server (all variables)
```

### 6. Migration from getConfigurationVariable()

```typescript
// packages/get-configuration-var/compat.ts - Compatibility layer
/**
 * @deprecated Use import.meta.env.VARIABLE_NAME instead
 */
export function getConfigurationVariable(name: string): string | undefined {
  if (import.meta.env?.DEV) {
    console.warn(
      `getConfigurationVariable("${name}") is deprecated. ` +
        `Use import.meta.env.${name} instead.`,
    );
  }

  return import.meta
    .env[name as keyof (ImportMetaEnv.Client | ImportMetaEnv.Server)] as
      | string
      | undefined;
}

// Keep existing aliases during migration
export const getConfigurationVar = getConfigurationVariable;
export const getSecret = getConfigurationVariable;
```

### 7. BFT Command Implementation

```typescript
#!/usr/bin/env -S bft run

// infra/bft/tasks/secrets.bft.ts
import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const bftDefinition = {
  description: "Manage secrets and environment variables",
  aiSafe: (args: Array<string>) => {
    const subcommand = args[0];
    return ["list", "help"].includes(subcommand);
  },
  fn: secretsTask,
} satisfies TaskDefinition;

async function secretsTask(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft secrets <command> [args...]");
    ui.info("Commands:");
    ui.info(
      "  sync                 - Sync all variables to .env.client and .env.server (auto-generates types)",
    );
    ui.info(
      "  sync --client-only   - Sync only client variables to .env.client",
    );
    ui.info(
      "  sync --server-only   - Sync only server variables to .env.server",
    );
    ui.info(
      "  list                 - List all available environment variables",
    );
    return 1;
  }

  const subcommand = args[0];
  const commandArgs = args.slice(1);

  switch (subcommand) {
    case "sync":
      return await syncSecretsFromOnePassword(commandArgs);
    case "list":
      return await listAvailableSecrets();
    default:
      ui.error(`Unknown command: ${subcommand}`);
      return 1;
  }
}

async function syncSecretsFromOnePassword(
  args: Array<string>,
): Promise<number> {
  const clientOnly = args.includes("--client-only");
  const serverOnly = args.includes("--server-only");
  const force = args.includes("--force");

  // Read variable names from .env.example files
  const clientKeys = await getExampleKeys(".env.client.example");
  const serverKeys = await getExampleKeys(".env.server.example");

  if (clientKeys.length === 0 && serverKeys.length === 0) {
    ui.error(
      "No .env.example files found. Create .env.client.example and .env.server.example first.",
    );
    return 1;
  }

  const allKeys = [...clientKeys, ...serverKeys];
  let keysToFetch = allKeys;
  if (clientOnly) keysToFetch = clientKeys;
  if (serverOnly) keysToFetch = serverKeys;

  // Check if target files exist and --force not used
  const filesToCheck = clientOnly
    ? [".env.client"]
    : serverOnly
    ? [".env.server"]
    : [".env.client", ".env.server"];

  if (!force) {
    for (const file of filesToCheck) {
      try {
        await Deno.stat(file);
        ui.error(`${file} already exists. Use --force to overwrite.`);
        return 1;
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
          throw error;
        }
      }
    }
  }

  // Get vault ID - with interactive selection for multiple vaults
  let vaultId = Deno.env.get("BF_VAULT_ID");

  if (!vaultId) {
    vaultId = await selectVault();
    if (!vaultId) {
      ui.error("No vault selected. Set BF_VAULT_ID or select interactively.");
      return 1;
    }
  }

  // Build template for op inject
  const template: Record<string, string> = {};
  keysToFetch.forEach((key) => {
    template[key] = `op://${vaultId}/${key}/value`;
  });

  try {
    // Run op inject with template
    const child = new Deno.Command("op", {
      args: ["inject", "--format=json"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const writer = child.stdin.getWriter();
    await writer.write(
      new TextEncoder().encode(JSON.stringify(template)),
    );
    await writer.close();

    const { code, stdout, stderr } = await child.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      logger.warn(`1Password injection failed: ${errorText}`);
      logger.info("Creating empty env files for development");

      // Create fallback files with empty values
      await writeEnvFiles(
        keysToFetch,
        {},
        clientKeys,
        serverKeys,
        clientOnly,
        serverOnly,
      );
      ui.info(`Created empty env files for ${keysToFetch.length} variables`);
      return 0;
    }

    // Parse successful result
    const injected = JSON.parse(new TextDecoder().decode(stdout));

    // Write secrets to appropriate files
    const successCount = await writeEnvFiles(
      keysToFetch,
      injected,
      clientKeys,
      serverKeys,
      clientOnly,
      serverOnly,
    );

    const filesWritten = clientOnly
      ? ".env.client"
      : serverOnly
      ? ".env.server"
      : ".env.client and .env.server";

    ui.info(`✅ Synced ${successCount} secrets to ${filesWritten}`);

    // Auto-generate TypeScript definitions from .env.example files
    try {
      const { generateEnvTypes } = await import("../../env/generate-types.ts");
      const types = generateEnvTypes();
      await Deno.writeTextFile("env.d.ts", types);
      ui.info(`✅ Generated environment-aware TypeScript definitions`);
    } catch (error) {
      ui.warn(
        `⚠️  Failed to generate TypeScript definitions: ${error.message}`,
      );
    }

    if (successCount < keysToFetch.length) {
      ui.warn(
        `⚠️  ${keysToFetch.length - successCount} secrets failed to sync`,
      );
    }

    return 0;
  } catch (error) {
    logger.error(`Failed to sync secrets: ${error.message}`);
    return 1;
  }
}

// Helper functions
async function getExampleKeys(filePath: string): Promise<string[]> {
  try {
    const content = await Deno.readTextFile(filePath);
    return Object.keys(parseEnvFile(content));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      logger.info(`Example file ${filePath} not found`);
      return [];
    }
    throw error;
  }
}

function parseEnvFile(content: string): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      let value = valueParts.join("=");
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  }

  return vars;
}

async function writeEnvFiles(
  keysToFetch: readonly string[],
  injected: Record<string, any>,
  allClientKeys: string[],
  allServerKeys: string[],
  clientOnly: boolean,
  serverOnly: boolean,
): Promise<number> {
  let successCount = 0;

  // Separate keys into client and server groups
  const clientKeys = keysToFetch.filter((key) => allClientKeys.includes(key));
  const serverKeys = keysToFetch.filter((key) => allServerKeys.includes(key));

  // Write .env.client file
  if (!serverOnly && clientKeys.length > 0) {
    const clientLines: string[] = [];
    for (const key of clientKeys) {
      const value = injected[key];
      if (value && typeof value === "string") {
        clientLines.push(`${key}="${value}"`);
        successCount++;
      } else {
        clientLines.push(`${key}=""`);
      }
    }
    await Deno.writeTextFile(".env.client", clientLines.join("\n") + "\n");
  }

  // Write .env.server file
  if (!clientOnly && serverKeys.length > 0) {
    const serverLines: string[] = [];
    for (const key of serverKeys) {
      const value = injected[key];
      if (value && typeof value === "string") {
        serverLines.push(`${key}="${value}"`);
        successCount++;
      } else {
        serverLines.push(`${key}=""`);
      }
    }
    await Deno.writeTextFile(".env.server", serverLines.join("\n") + "\n");
  }

  return successCount;
}

async function listAvailableSecrets(): Promise<number> {
  const clientKeys = await getExampleKeys(".env.client.example");
  const serverKeys = await getExampleKeys(".env.server.example");

  if (clientKeys.length === 0 && serverKeys.length === 0) {
    ui.error("No .env.example files found.");
    ui.info(
      "Create .env.client.example and .env.server.example to define your environment variables.",
    );
    return 1;
  }

  ui.info("Available environment variables (from .env.example files):");
  ui.info("");

  if (clientKeys.length > 0) {
    ui.info("Client variables (safe for browser, from .env.client.example):");
    clientKeys.forEach((key) => {
      ui.info(`  ${key}`);
    });
    ui.info("");
  }

  if (serverKeys.length > 0) {
    ui.info("Server variables (backend only, from .env.server.example):");
    serverKeys.forEach((key) => {
      ui.info(`  ${key}`);
    });
    ui.info("");
  }

  const totalKeys = clientKeys.length + serverKeys.length;
  ui.info(
    `Total: ${totalKeys} variables (${clientKeys.length} client, ${serverKeys.length} server)`,
  );
  return 0;
}

async function selectVault(): Promise<string | null> {
  try {
    // List available vaults
    const child = new Deno.Command("op", {
      args: ["vault", "list", "--format=json"],
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const { code, stdout, stderr } = await child.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      logger.error(`Failed to list vaults: ${errorText}`);
      return null;
    }

    const vaults = JSON.parse(new TextDecoder().decode(stdout));

    if (vaults.length === 0) {
      ui.error(
        "No 1Password vaults found. Make sure you're signed in with 'op signin'",
      );
      return null;
    }

    if (vaults.length === 1) {
      ui.info(`Using vault: ${vaults[0].name} (${vaults[0].id})`);
      return vaults[0].id;
    }

    // Look for Bolt Foundry vault first
    const bfVault = vaults.find((v: any) =>
      v.name.toLowerCase().includes("bolt") ||
      v.name.toLowerCase().includes("foundry") ||
      v.name.toLowerCase().includes("bf")
    );

    if (bfVault) {
      ui.info(
        `Auto-selected Bolt Foundry vault: ${bfVault.name} (${bfVault.id})`,
      );
      return bfVault.id;
    }

    // Interactive selection for multiple vaults
    ui.info("Multiple vaults found. Please select one:");
    vaults.forEach((v: any, index: number) => {
      ui.info(`  ${index + 1}. ${v.name} (${v.id})`);
    });

    const input = prompt("Enter vault number (1-" + vaults.length + "):");
    const selection = parseInt(input || "0", 10);

    if (selection >= 1 && selection <= vaults.length) {
      const selectedVault = vaults[selection - 1];
      ui.info(`Selected vault: ${selectedVault.name} (${selectedVault.id})`);
      ui.info(
        `To avoid this prompt, set: export BF_VAULT_ID=${selectedVault.id}`,
      );
      return selectedVault.id;
    }

    ui.error("Invalid selection");
    return null;
  } catch (error) {
    logger.error(`Failed to select vault: ${error.message}`);
    return null;
  }
}

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2);
  Deno.exit(await secretsTask(scriptArgs));
}
```

## Production Deployment Strategy

Simplified production architecture using 1Password for all secrets with
boot-time refresh.

### New Production Architecture

**1Password-First Production:**

- **Platform**: Hetzner Cloud with Kamal 2.x orchestration
- **Secrets Storage**: All production secrets stored in 1Password production
  vault
- **Boot Process**: Container fetches secrets from 1Password on startup
- **Persistence**: Secrets cached to persistent volume alongside SQLite database
- **Single GitHub Secret**: Only `OP_SERVICE_ACCOUNT_TOKEN` stored in GitHub

### Production Secrets Flow

```
Development:
1Password Dev Vault → bft secrets sync → .env.client + .env.server → import.meta.env

Production:
1Password Prod Vault → Container Boot → Persistent Volume Cache → import.meta.env
```

### Required GitHub Repository Secrets (Minimal)

| Secret                     | Purpose           | Notes                              |
| -------------------------- | ----------------- | ---------------------------------- |
| `HETZNER_API_TOKEN`        | Server management | Cloud infrastructure               |
| `CLOUDFLARE_API_TOKEN`     | DNS management    | Domain routing                     |
| `SSH_PRIVATE_KEY`          | Deployment access | Kamal operations                   |
| `HYPERDX_API_KEY`          | Observability     | Logging/monitoring                 |
| `OP_SERVICE_ACCOUNT_TOKEN` | 1Password access  | **New: Production secrets access** |

### Container Boot Sequence

```typescript
// Container startup script
async function initializeProduction() {
  // 1. Check for cached secrets in persistent volume
  const cacheFile = "/data/production-secrets.env";

  // 2. Refresh from 1Password if cache is stale or missing
  if (await shouldRefreshSecrets(cacheFile)) {
    await refreshProductionSecrets(cacheFile);
  }

  // 3. Load secrets into environment for import.meta.env polyfill
  await loadSecretsFromCache(cacheFile);

  // 4. Start application
  await startApplication();
}

async function refreshProductionSecrets(cacheFile: string) {
  const prodVaultId = "production-vault-id-here";
  const clientKeys = await getExampleKeys(".env.client.example");
  const serverKeys = await getExampleKeys(".env.server.example");

  // Build 1Password template (same as development)
  // Note: .env.example files are included in production container for documentation
  const template = {};
  [...clientKeys, ...serverKeys].forEach((key) => {
    template[key] = `op://${prodVaultId}/${key}/value`;
  });

  const result = await runOpInject(template);

  // Cache to persistent volume
  const envLines = Object.entries(result)
    .filter(([_, value]) => value && typeof value === "string")
    .map(([key, value]) => `${key}="${value}"`);

  await Deno.writeTextFile(cacheFile, envLines.join("\n") + "\n");
}

async function shouldRefreshSecrets(cacheFile: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(cacheFile);
    const ageHours = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60);
    return ageHours > 24; // Refresh daily
  } catch {
    return true; // Cache doesn't exist
  }
}
```

### Benefits of This Approach

1. **Single Source of Truth**: All secrets in 1Password, including production
2. **Reduced GitHub Secrets**: Only infrastructure secrets in GitHub
3. **Automatic Rotation**: Update 1Password, secrets refresh on next boot
4. **Persistent Caching**: Secrets survive container restarts via volume mount
5. **Same Tooling**: Use same `import.meta.env` everywhere
6. **Simplified Ops**: No manual secret management in GitHub UI

### Security Considerations

- **Service Account Token**: Limited scope, only reads from production vault
- **Volume Security**: Persistent volume contains cached secrets (encrypted by
  Hetzner)
- **Container Security**: Secrets loaded at runtime, not baked into images
- **Rotation Strategy**: Daily automatic refresh, manual refresh via deployment
  trigger

## Migration Plan

### Phase 1: New Universal System (2-3 days)

- [ ] Create `.env.client.example` and `.env.server.example` files with current
      variables
- [ ] Implement `packages/env/generate-types.ts` script to generate TypeScript
      from .env.example files
- [ ] Implement `packages/env/polyfill.ts` for server-side import.meta.env
- [ ] Create `packages/env/vite-plugin.ts` for client-side integration
- [ ] Implement `bft secrets sync` command to read from .env.example and write
      separate .env files with auto type generation
- [ ] Test with existing applications

### Phase 2: Migration and Cleanup (1-2 days)

- [ ] Migrate applications to use `import.meta.env` instead of
      `getConfigurationVariable()`
- [ ] Update Vite configs to use new `boltFoundryEnvPlugin()`
- [ ] Add `--preload=packages/env/polyfill.ts` to Deno commands
- [ ] Deprecate old BFF commands (`inject-secrets`, `secrets:inject`, etc.)
- [ ] Remove shell integration scripts and caching logic

### Phase 3: Cleanup and Documentation (0.5 days)

- [ ] Remove deprecated `getConfigurationVariable()` functions (cleanup after
      migration)
- [ ] Remove generated `configKeys.ts`
- [ ] Update README with new `import.meta.env` workflow
- [ ] Create migration guide for existing users

## Success Metrics

- [ ] Single `bft secrets sync` command works for all use cases
- [ ] Universal `import.meta.env` works in both server and client code
- [ ] Clear separation between client-safe and server-only variables
- [ ] Frontend builds automatically exclude server-only variables
- [ ] No more generated configuration files or shell integration
- [ ] Codebase complexity reduced by ~70% (remove ~300 lines of complexity)
- [ ] Standards-aligned approach using `import.meta.env`

## Non-Goals

- **Don't change core API immediately**: `getConfigurationVariable()` remains
  available during transition
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

- **Vault ID**: Auto-discovers Bolt Foundry vaults by name, falls back to
  interactive selection for multiple vaults
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
