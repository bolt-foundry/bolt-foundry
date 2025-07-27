/**
 * Compatibility layer for migrating from getConfigurationVariable to env wrapper
 * @deprecated This entire module is deprecated. Use the env wrapper instead:
 * ```ts
 * import { env } from "@bfmono/packages/env/mod.ts";
 * const apiKey = env.OPENAI_API_KEY;
 * ```
 */

import { env } from "./mod.ts";

/**
 * Get a configuration variable from environment.
 * @deprecated Use env.VARIABLE_NAME instead
 */
export function getConfigurationVariable(name: string): string | undefined {
  if (env.DEV) {
    console.warn(
      `getConfigurationVariable("${name}") is deprecated. ` +
        `Use env.${name} instead.`,
    );
  }

  // Access the variable through env wrapper
  const value = env[name];
  // Convert booleans back to strings for compatibility
  if (typeof value === "boolean") {
    return String(value);
  }
  return value;
}

/**
 * Get a secret from environment.
 * @deprecated Use env.VARIABLE_NAME instead
 */
export function getSecret(key: string): string | undefined {
  if (env.DEV) {
    console.warn(
      `getSecret("${key}") is deprecated. ` +
        `Use env.${key} instead.`,
    );
  }

  const value = env[key];
  // Convert booleans back to strings for compatibility
  if (typeof value === "boolean") {
    return String(value);
  }
  return value;
}

// Keep existing aliases for backward compatibility
export const getConfigurationVar = getConfigurationVariable;

// No-op functions for removed functionality
export async function warmSecrets(): Promise<void> {
  // No-op: environment variables are now loaded automatically
}

export async function refreshAllSecrets(): Promise<void> {
  // No-op: environment variables are now loaded automatically
}