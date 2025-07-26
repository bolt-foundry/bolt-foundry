import { parseEnvFile } from "./utils.ts";

/**
 * Generate environment-aware TypeScript definitions from .env.example files
 */
export async function generateEnvTypes(): Promise<string> {
  // Read example files
  let clientVars: Record<string, string> = {};
  let serverVars: Record<string, string> = {};

  try {
    const clientContent = await Deno.readTextFile(".env.client.example");
    clientVars = parseEnvFile(clientContent);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  try {
    const serverContent = await Deno.readTextFile(".env.server.example");
    serverVars = parseEnvFile(serverContent);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  // Generate type definitions
  const clientTypes = Object.keys(clientVars)
    .map((key) => `  readonly ${key}?: string;`)
    .join("\n");

  const serverTypes = Object.keys(serverVars)
    .map((key) => `  readonly ${key}?: string;`)
    .join("\n");

  return `// Auto-generated from .env.example files - do not edit manually
// Run 'bft secrets generate-types' to regenerate

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

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
${clientTypes || "  // No client variables defined"}
}

// Server-only variables (from .env.server.example)  
interface ServerEnvVars {
${serverTypes || "  // No server variables defined"}
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
  readonly env: typeof globalThis extends { window: unknown }
    ? ImportMetaEnv.Client  // Client context (browser)
    : ImportMetaEnv.Server; // Server context (Deno)
}

// For compatibility with existing env.d.ts expectations
interface ImportMetaEnv extends ImportMetaEnv.Server {}
`;
}

// Generate types when run directly
if (import.meta.main) {
  try {
    const types = await generateEnvTypes();
    await Deno.writeTextFile("env.d.ts", types);
    console.log("✅ Generated environment-aware TypeScript definitions");
  } catch (error) {
    console.error("❌ Failed to generate types:", error.message);
    Deno.exit(1);
  }
}