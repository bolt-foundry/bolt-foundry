// deno-lint-ignore-file bolt-foundry/no-env-direct-access

/**
 * Bolt Foundry • Simple secrets helper
 * Uses environment variables loaded from .env.local
 * -----------------------------------------------------------------------------
 * Works in both Deno and browser environments:
 *   • In Deno: reads from Deno.env (including .env.local loaded at startup)
 *   • In browser: reads from globalThis.__ENVIRONMENT__ injected by bundler
 *
 * To populate secrets:
 *   1. Run `bff inject-secrets` to create .env.local from 1Password
 *   2. Deno automatically loads .env.local on startup
 * -----------------------------------------------------------------------------
 */

import {
  PRIVATE_CONFIG_KEYS,
  PUBLIC_CONFIG_KEYS,
} from "@bfmono/apps/boltFoundry/__generated__/configKeys.ts";

/* ─── environment helpers ─────────────────────────────────────────────────── */
const isDeno = typeof Deno !== "undefined" && !!Deno?.version?.deno;

const browserEnv = (name: string): string | undefined =>
  typeof window !== "undefined"
    // @ts-expect-error: browser-only, injected by page load
    ? globalThis.__ENVIRONMENT__?.[name]
    : undefined;

const runtimeEnv = (name: string): string | undefined =>
  isDeno ? Deno.env.get(name) : undefined;

const getEnv = (name: string): string | undefined =>
  browserEnv(name) ?? runtimeEnv(name);

/* ─── public API ───────────────────────────────────────────────────────────── */

/**
 * Get a configuration variable from environment.
 * Returns undefined if not found.
 */
export function getConfigurationVariable(name: string): string | undefined {
  return getEnv(name);
}

/**
 * Get a secret from environment (synchronous).
 * This is now just an alias for getConfigurationVariable.
 * Returns undefined if not found.
 */
export function getSecret(key: string): string | undefined {
  return getEnv(key);
}

/* ─── backward compatibility ─────────────────────────────────────────────────── */
export const getConfigurationVar = getConfigurationVariable;

/* ─── deprecated/removed functions ────────────────────────────────────────────── */
export async function warmSecrets(): Promise<void> {
  // No-op: secrets are now loaded from .env.local at startup
}

export async function refreshAllSecrets(): Promise<void> {
  // No-op: secrets are now loaded from .env.local at startup
}

export function writeEnv(): void {
  throw new Error(
    "writeEnv() is deprecated. Use 'bff inject-secrets' to create .env.local",
  );
}

export const writeEnvFile = writeEnv;

/* ─── exported for injection script ──────────────────────────────────────────── */
export const KNOWN_KEYS = [...PUBLIC_CONFIG_KEYS, ...PRIVATE_CONFIG_KEYS];
