// deno-lint-ignore-file bolt-foundry/no-env-direct-access

/**
 * Bolt Foundry • secrets helper — lean edition
 * (env‑first · browser‑safe · legacy shims · multi‑vault)
 * -----------------------------------------------------------------------------
 * Works both under **Deno** and in a **browser build**:
 *   • All `Deno.*` calls are gated behind runtime checks.
 *   • In a browser, secrets injected by the bundler (Vite, BFF, etc.) are
 *     surfaced via `globalThis.__ENVIRONMENT__[key]`.
 *   • Vault access (1Password CLI) is **disabled** in the browser and will
 *     throw if attempted.
 *
 * Public API (new‑school):
 *   • getSecret(key)             – env‑first async lookup
 *   • warmSecrets(keys?)         – batch cache warm (Deno‑only)
 *   • writeEnv(path?, keys?)     – write .env file (Deno‑only)
 *
 * Legacy shims and multi‑vault discovery included for drop‑in compatibility.
 * ----------------------------------------------------------------------------- */

import {
  PRIVATE_CONFIG_KEYS,
  PUBLIC_CONFIG_KEYS,
} from "apps/boltFoundry/__generated__/configKeys.ts";

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

/* ─── constants ────────────────────────────────────────────────────────────── */
const KNOWN_KEYS = [...PUBLIC_CONFIG_KEYS, ...PRIVATE_CONFIG_KEYS];
const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();

// Cache‑TTL default (300s) can be overridden via env / browser injection.
const CACHE_TTL_MS = (() => {
  const raw = getEnv("BF_CACHE_TTL_SEC");
  const secs = Number.parseInt(raw ?? "", 10);
  return (Number.isFinite(secs) && secs > 0 ? secs : 300) * 1_000;
})();

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const now = () => Date.now();
const fromCache = (k: string) => {
  const hit = CACHE.get(k);
  return hit && hit.expires > now() ? hit.value : undefined;
};

/* ─── internal cache ───────────────────────────────────────────────────────── */
const CACHE = new Map<string, { value: string; expires: number }>();

/* ─── vault discovery (Deno‑only) ──────────────────────────────────────────── */
let CACHED_VAULT_ID = getEnv("BF_VAULT_ID") ?? "";

async function firstVaultId(): Promise<string> {
  if (!isDeno) throw new Error("Vault access unavailable in browser");
  if (CACHED_VAULT_ID) return CACHED_VAULT_ID;

  const { success, stdout, stderr } = await new Deno.Command("op", {
    args: ["vault", "list", "--format=json"],
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!success) {
    throw new Error(`Failed to list vaults: ${DECODER.decode(stderr).trim()}`);
  }
  const list = JSON.parse(DECODER.decode(stdout)) as Array<{
    id: string;
    name: string;
    content_version: number;
  }>;
  if (!list.length) throw new Error("No 1Password vaults visible to CLI");

  // Try to find a Bolt Foundry vault by name patterns
  const bfVault = list.find((v) =>
    v.name.toLowerCase().includes("bolt") ||
    v.name.toLowerCase().includes("foundry") ||
    v.name.toLowerCase().includes("bf")
  );

  if (bfVault) {
    CACHED_VAULT_ID = bfVault.id;
  } else {
    // Fall back to first vault if no BF vault found
    CACHED_VAULT_ID = list[0].id;

    // Log available vaults to help user set BF_VAULT_ID
    const { getLogger } = await import("packages/logger/logger.ts");
    const logger = getLogger(import.meta);
    logger.warn("No Bolt Foundry vault detected. Available vaults:");
    list.forEach((v) => logger.warn(`  ${v.name} (${v.id})`));
    logger.warn(
      "Set BF_VAULT_ID environment variable to specify the correct vault",
    );
  }

  return CACHED_VAULT_ID;
}

/* ─── low‑level 1Password calls (Deno‑only) ───────────────────────────────── */
async function opRead(key: string): Promise<string> {
  if (!isDeno) throw new Error("1Password CLI unavailable in browser");
  const vault = await firstVaultId();
  const { success, stdout, stderr } = await new Deno.Command("op", {
    args: ["read", `op://${vault}/${key}/value`],
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!success) {
    throw new Error(
      `Failed to read \"${key}\": ${DECODER.decode(stderr).trim()}`,
    );
  }
  return DECODER.decode(stdout).trim();
}

async function opInject(keys: Array<string>): Promise<Record<string, string>> {
  if (!isDeno) throw new Error("1Password CLI unavailable in browser");
  if (!keys.length) return {};
  const vault = await firstVaultId();
  const template: Record<string, string> = {};
  keys.forEach((k) => (template[k] = `op://${vault}/${k}/value`));

  const child = new Deno.Command("op", {
    args: ["inject", "--format=json"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();
  const w = child.stdin.getWriter();
  await w.write(ENCODER.encode(JSON.stringify(template)));
  await w.close();

  const { success, stdout, stderr } = await child.output();
  if (!success) throw new Error(`op inject failed: ${DECODER.decode(stderr)}`);
  return JSON.parse(DECODER.decode(stdout));
}

/* ─── public API ───────────────────────────────────────────────────────────── */

/**
 * Resolve a configuration variable.
 * Order of precedence:
 *   1️⃣ Compile‑/runtime ENV (`window.__ENVIRONMENT__` in browser, `Deno.env` in Deno)
 *   2️⃣ Cached value (if previously fetched)
 *   3️⃣ 1Password vault via CLI (Deno‑only)
 */
export async function getSecret(key: string): Promise<string | undefined> {
  const envVal = getEnv(key);
  if (envVal) return envVal;
  const cached = fromCache(key);
  if (cached) return cached;
  return await opRead(key) // may throw in browser
    .then((val) => {
      CACHE.set(key, { value: val, expires: now() + CACHE_TTL_MS });
      return val;
    })
    .catch(() => undefined);
}

/**
 * Warm multiple secrets into the in‑memory cache (Deno‑only).
 * Skips keys already present in ENV to honour local overrides.
 */
export async function warmSecrets(keys: Array<string> = KNOWN_KEYS) {
  if (!isDeno) return; // no‑op in browser
  const toFetch = keys.filter((k) => !getEnv(k));

  try {
    // Try batch operation first for efficiency
    const resolved = await opInject(toFetch);
    for (const [k, v] of Object.entries(resolved)) {
      CACHE.set(k, { value: v, expires: now() + CACHE_TTL_MS });
    }
  } catch (error) {
    // If batch operation fails (e.g., missing keys), fall back to individual fetches
    // Lazy load logger to avoid circular dependency
    const { getLogger } = await import("packages/logger/logger.ts");
    const logger = getLogger(import.meta);
    logger.warn(
      `Batch secret fetch failed, falling back to individual fetches: ${error}`,
    );

    for (const key of toFetch) {
      try {
        const value = await opRead(key);
        CACHE.set(key, { value, expires: now() + CACHE_TTL_MS });
      } catch (_keyError) {
        // Individual key not found - this is expected for deleted keys
        logger.debug(`Secret not found in 1Password: ${key}`);
      }
    }
  }
}

/**
 * Write a .env‑compatible file (Deno‑only). Throws in browser.
 */
export async function writeEnv(
  path = ".env",
  keys: Array<string> = KNOWN_KEYS,
): Promise<void> {
  if (!isDeno) throw new Error("writeEnv() is unavailable in browser");
  const lines: Array<string> = [];
  for (const k of keys) {
    const v = await getSecret(k);
    if (v) lines.push(`${k}=${v}`);
  }
  await Deno.writeTextFile(path, lines.join("\n") + "\n");
}

/* ─── backward‑compat shims (same semantics, now browser‑safe) ─────────────── */
export function getConfigurationVariable(name: string): string | undefined {
  return getEnv(name) ?? fromCache(name);
}
export const refreshAllSecrets = warmSecrets;
export const writeEnvFile = writeEnv;

/* ─── CLI entry‑point (Deno only) ─────────────────────────────────────────── */
if (isDeno && import.meta.main) {
  await warmSecrets();
  await writeEnv();
}
