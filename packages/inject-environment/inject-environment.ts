/**
 * Environment variable injection utilities
 *
 * Injects environment variables into import.meta.env for a unified
 * development experience across Deno, Node.js, and browsers.
 *
 * Usage:
 *   import { injectEnvironment } from "@bolt-foundry/inject-environment";
 *
 *   // Call at the top of your module
 *   await injectEnvironment(import.meta);
 *
 *   // Now you can use environment variables
 *   console.log(import.meta.env.DATABASE_URL);
 */

import { load as loadDotEnv } from "jsr:@std/dotenv@0.225.0";

// The ImportMeta and ImportMetaEnv types are already defined in env.d.ts
// We'll just ensure the module augments the global scope properly
declare global {
  // Extend the existing ImportMetaEnv to ensure it has an index signature
  interface ImportMetaEnv {
    [key: string]: string | boolean | undefined;
  }
}

/**
 * Inject environment variables into import.meta.env
 *
 * @param importMeta - The import.meta object from the calling module
 * @param options - Configuration options
 * @returns Promise that resolves when environment is loaded
 */
export async function injectEnvironment(
  importMeta: ImportMeta,
  options: {
    envPath?: string;
    debug?: boolean;
    override?: boolean;
  } = {},
): Promise<void> {
  const {
    envPath = ".env.local",
    debug = false,
    override = false,
  } = options;

  // Initialize import.meta.env if it doesn't exist
  if (!importMeta.env) {
    // @ts-ignore - we're modifying import.meta at runtime
    importMeta.env = {} as ImportMetaEnv.Server;
  }

  // For runtime modification, we need to cast to a mutable type
  // while maintaining the server environment semantics
  const env = importMeta.env as ImportMetaEnv.Server & Record<string, any>;

  try {
    // Load .env.local file
    const envVars = await loadDotEnv({
      envPath,
      export: false, // Don't export to Deno.env
    });

    // Inject env vars into import.meta.env
    for (const [key, value] of Object.entries(envVars)) {
      if (override || !env[key]) {
        env[key] = value;
      }
    }

    if (debug) {
      console.log(
        `[inject-environment] Loaded ${
          Object.keys(envVars).length
        } variables from ${envPath}`,
      );
    }
  } catch (error) {
    if (debug) {
      console.log(
        `[inject-environment] No ${envPath} file found, using system environment only`,
      );
    }
  }

  // Also inject current Deno.env variables
  if (typeof Deno !== "undefined") {
    const denoEnv = Deno.env.toObject();
    for (const [key, value] of Object.entries(denoEnv)) {
      if (override || !env[key]) {
        env[key] = value;
      }
    }
  }

  // For browser compatibility, check globalThis.__ENVIRONMENT__
  // @ts-ignore - browser-only global
  if (typeof window !== "undefined" && globalThis.__ENVIRONMENT__) {
    // @ts-ignore - browser-only global
    for (const [key, value] of Object.entries(globalThis.__ENVIRONMENT__)) {
      if (override || !env[key]) {
        env[key] = value as string;
      }
    }
  }
}

/**
 * Get a configuration variable from environment.
 * @deprecated Use import.meta.env.VARIABLE_NAME after calling injectEnvironment
 */
export function getConfigurationVariable(name: string): string | undefined {
  // Try import.meta.env first (if available)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const env = import.meta.env as ImportMetaEnv.Server & Record<string, any>;
    return env[name];
  }

  // Fallback to Deno.env
  if (typeof Deno !== "undefined") {
    return Deno.env.get(name);
  }

  // Fallback to browser environment
  if (typeof window !== "undefined") {
    // @ts-expect-error: browser-only
    return globalThis.__ENVIRONMENT__?.[name];
  }

  return undefined;
}

/**
 * Get a secret from environment (synchronous).
 * @deprecated Use import.meta.env.VARIABLE_NAME after calling injectEnvironment
 */
export function getSecret(key: string): string | undefined {
  return getConfigurationVariable(key);
}

/* Backward compatibility aliases */
export const getConfigurationVar = getConfigurationVariable;

/* No-op functions for backward compatibility */
export async function warmSecrets(): Promise<void> {
  // No-op: use injectEnvironment instead
}

export async function refreshAllSecrets(): Promise<void> {
  // No-op: use injectEnvironment instead
}

/* Re-export known keys if needed */
export const KNOWN_KEYS: string[] = [];
