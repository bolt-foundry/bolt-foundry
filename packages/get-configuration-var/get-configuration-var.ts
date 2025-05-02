#! /usr/bin/env -S deno run --allow-run=op --allow-env --allow-write
// deno-lint-ignore-file bolt-foundry/no-env-direct-access
// Bolt Foundry • secrets helper — “bulk-warm + auto-refresh + .env export” edition
// ------------------------------------------------------------------------------

import type { Logger } from "@bolt-foundry/logger";
import {
  PRIVATE_CONFIG_KEYS,
  PUBLIC_CONFIG_KEYS,
} from "apps/boltFoundry/__generated__/configKeys.ts";

/* ───────────  public / private classification via tags  ─────────── */
const CANON = (s: string) => s.trim().toUpperCase();

const PUBLIC_KEYS = new Set<string>(PUBLIC_CONFIG_KEYS.map(CANON));
const PRIVATE_KEYS = new Set<string>(PRIVATE_CONFIG_KEYS.map(CANON));
const KNOWN_KEYS = new Set<string>([...PUBLIC_KEYS, ...PRIVATE_KEYS]);

export const ENVIRONMENT_ONLY_KEYS = [
  "CI",
  "COLORTERM",
  "DEBUG",
  "DENO_TRACE_PERMISSIONS",
  "FORCE_COLOR",
  "FORCE_DB_BACKEND",
  "NODE_ENV",
  "NODE_PG_FORCE_NATIVE",
  "REPL_HOME",
  "REPL_SLUG",
  "REPLIT_DEV_DOMAIN",
  "SQLITE_DB_PATH",
  "TEAMCITY_VERSION",
  "TERM",
  "TF_BUILD",
  "USER",
  "WS_NO_BUFFER_UTIL",
];
/** Extra internal keys that _should_ bypass tag-scraping. */
export const INTERNAL_KEYS: Set<string> = new Set<string>([
  "BF_ENV",
  "BF_CACHE_TTL_SEC", // 1Password-stored refresh TTL
  "BF_CACHE_ENV", // disable caching (e.g. for tests)
]);
for (const k of INTERNAL_KEYS) KNOWN_KEYS.add(CANON(k));

function isPublicKey(name: string): boolean {
  return PUBLIC_KEYS.has(CANON(name));
}
function isKnownKey(name: string): boolean {
  return KNOWN_KEYS.has(CANON(name)) ||
    ENVIRONMENT_ONLY_KEYS.includes(CANON(name));
}

/* ───────────  existing imports deferred to avoid log-cycle  ─────────── */
let logger: Logger;
(async () => {
  const { getLogger } = await import("@bolt-foundry/logger");
  logger = getLogger(import.meta);
})();

/* ───────────  util helpers  ─────────── */
type Maybe<T> = T | undefined;
const text = new TextDecoder();
const isSet = (v: string | undefined): v is string => !!v?.trim();

/* ───────────  cache knobs  ─────────── */
const SHOULD_CACHE: boolean = (typeof Deno !== "undefined")
  ? Deno.env.get("BF_CACHE_ENV") !== "false"
  : false;
const DEFAULT_TTL_SEC = 60 * 5; // 5-min fallback
const TTL_ITEM_NAME = "BF_CACHE_TTL_SEC"; // value in vault

/* ───────────  permission helper  ─────────── */
const canRunOpPromise: Promise<boolean> = (async () => {
  if (typeof Deno === "undefined" || !("permissions" in Deno)) return false;
  try {
    const s = await Deno.permissions.query({
      name: "run",
      command: "op" as const,
    });
    return s.state === "granted";
  } catch {
    return false;
  }
})();
async function canRunOp() {
  const ok = await canRunOpPromise;
  logger?.debug(`1Password CLI available: ${ok}`);
  return ok;
}

/* ───────────  env helpers (browser / Deno / Node)  ─────────── */
function browserEnv(name: string): Maybe<string> {
  // @ts-expect-error build-time global injected by Vite / bff
  return globalThis.window && globalThis.__ENVIRONMENT__?.[name];
}
function runtimeEnv(name: string): Maybe<string> {
  return (typeof Deno !== "undefined") ? Deno.env.get(name) : undefined;
}

/* ───────────  caches  ─────────── */
const promiseCache = new Map<string, Promise<string | undefined>>();
const valueCache = new Map<string, string | undefined>();

/* ───────────  vault discovery (cached)  ─────────── */
let vaultId = "";
async function firstVault(): Promise<string> {
  if (vaultId) return vaultId;
  if (!(await canRunOp())) {
    throw new Error("1Password disabled — run with --allow-run=op");
  }
  const { stdout } = await new Deno.Command("op", {
    args: ["vault", "list", "--format=json"],
    stdout: "piped",
  }).output();
  try {
    const vaults = JSON.parse(text.decode(stdout));
    if (!vaults.length) throw new Error("No 1Password vaults visible");
    if (vaults.length > 1) {
      throw new Error("Multiple vaults visible; hard-coding not yet supported");
    }
    vaultId = vaults[0].id;
    return vaultId;
  } catch {
    const log = logger ?? console;
    log.error("Failed to parse 1Password vault list", text.decode(stdout));
    throw new Error("Failed to parse 1Password vault list");
  }
}

/* ───────────  low-level read  ─────────── */
function cachedRead(
  ref: string,
  useCache = SHOULD_CACHE,
): Promise<string | undefined> {
  if (useCache && valueCache.has(ref)) {
    return Promise.resolve(valueCache.get(ref));
  }
  if (useCache && promiseCache.has(ref)) return promiseCache.get(ref)!;

  const p = new Deno.Command("op", {
    args: ["read", ref],
    stdout: "piped",
    stderr: "piped",
  }).output().then(({ success, stdout, stderr }) => {
    if (!success) {
      promiseCache.delete(ref);
      throw new Error(
        `Failed to resolve ${ref}: ${new TextDecoder().decode(stderr)}`,
      );
    }
    const val = new TextDecoder().decode(stdout).trim();
    valueCache.set(ref, val);
    return val;
  });

  if (useCache) promiseCache.set(ref, p);
  return p;
}

/* ───────────  PUBLIC API — sync  ─────────── */
export function getConfigurationVariable(
  name: string,
  requirePublic = true,
): Maybe<string> {
  if (!isKnownKey(name)) return undefined; // ✋ unknown key

  const b = browserEnv(name);
  if (isSet(b)) return b; // 1️⃣ compile-time env
  const r = runtimeEnv(name);
  if (isSet(r)) return r; // 2️⃣ runtime env

  // 3️⃣ cached secret
  const vPath = vaultId ? `op://${vaultId}/${name}/value` : "";
  const val = vPath ? valueCache.get(vPath) : undefined;
  if (!isSet(val)) return undefined;
  return requirePublic ? (isPublicKey(name) ? val : undefined) : val;
}

/* ───────────  PUBLIC API — async  ─────────── */
export async function fetchConfigurationVariable(
  name: string,
  useCache = SHOULD_CACHE,
  requirePublic = true,
): Promise<string | undefined> {
  const sync = getConfigurationVariable(name, requirePublic); // fast-path
  if (isSet(sync)) return sync;

  if (!isKnownKey(name)) return undefined; // unknown

  if (!(await canRunOp())) return undefined;
  if (requirePublic && !isPublicKey(name)) return undefined;

  const vault = await firstVault();
  const val = await cachedRead(`op://${vault}/${name}/value`, useCache);
  return isSet(val) ? val : undefined;
}

/* ───────────  helper aliases for private access  ─────────── */
export const getPrivateConfigurationVariable = (
  name: string,
): string | undefined =>
  getConfigurationVariable(name, /*requirePublic=*/ false);

export const fetchPrivateConfigurationVariable = (
  name: string,
  useCache = SHOULD_CACHE,
): Promise<string | undefined> =>
  fetchConfigurationVariable(name, useCache, /*requirePublic=*/ false);

/* ───────────  BULK WARM + AUTO-REFRESH  ─────────── */
async function injectMany(names: string[]): Promise<Record<string, string>> {
  const vault = await firstVault();
  const template: Record<string, string> = {};
  for (const n of names) template[n] = `op://${vault}/${n}/value`;

  const cmd = new Deno.Command("op", {
    args: ["inject", "--format=json"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const child = cmd.spawn();
  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(JSON.stringify(template)));
  await writer.close();

  const { success, stdout, stderr } = await child.output();
  if (!success) throw new Error(`op inject failed: ${text.decode(stderr)}`);
  return JSON.parse(text.decode(stdout));
}

async function refreshAllSecrets() {
  const names = Array.from(KNOWN_KEYS);
  let payload;
  try {
    payload = await injectMany(names);
  } catch (err) {
    logger?.warn(`Bulk warm-up skipped – some items missing`, err);
    return;
  }
  const vault = await firstVault();
  for (const [name, val] of Object.entries(payload)) {
    const p = Promise.resolve(val);
    promiseCache.set(`op://${vault}/${name}/value`, p);
    valueCache.set(`op://${vault}/${name}/value`, val);
  }
  logger?.info(`Refreshed ${names.length} secrets from vault ${vaultId}`);
}

let ttlSeconds = DEFAULT_TTL_SEC;
async function resolveTTL(): Promise<number> {
  const raw = await fetchConfigurationVariable(TTL_ITEM_NAME, false);
  const sec = raw ? Number.parseInt(raw, 10) : NaN;
  ttlSeconds = Number.isFinite(sec) && sec > 0 ? sec : DEFAULT_TTL_SEC;
  return ttlSeconds;
}

/** Starts the periodic 1Password warm-up loop. */
export function startAutoRefresh(): {
  stop(): Promise<void>;
  [Symbol.dispose](): Promise<void>;
  [Symbol.asyncDispose](): Promise<void>;
} {
  refreshAllSecrets().catch(() => {});
  resolveTTL().catch(() => {});
  const pending = new Set<Promise<void>>();
  const timer = setInterval(() => {
    const run = refreshAllSecrets().catch(() => {
      pending.delete(run);
    });
    pending.add(run);
  }, ttlSeconds * 1_000);

  async function stop() {
    clearInterval(timer);
    await Promise.allSettled(pending);
    pending.clear();
  }
  return { stop, [Symbol.dispose]: stop, [Symbol.asyncDispose]: stop };
}

/* ════════════════════════════════════════════════════════════════════════
   ⏬ NEW FEATURE — WRITE CURRENT SECRETS TO A .env FILE
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Writes all known configuration variables to a “dotenv”-compatible file.
 *
 * @param filePath         Destination file (default: "./.env")
 * @param opts.includePrivate  Dump private keys too?  (default: false)
 * @param opts.useCache         Use in-memory cache if possible (default: true)
 *
 * Values are fetched **once** (honouring cache knobs) and written as
 *   MY_KEY=some-value
 *   OTHER_KEY="value with spaces"
 *
 * Lines are skipped for keys that can’t be resolved.
 */
export async function writeEnvFile(
  filePath = ".env",
  opts: { includePrivate?: boolean; useCache?: boolean } = {},
): Promise<void> {
  const { includePrivate = true, useCache = SHOULD_CACHE } = opts;
  const keys = Array.from(KNOWN_KEYS).filter((k) =>
    includePrivate ? true : isPublicKey(k)
  );

  const lines: string[] = [];

  for (const name of keys) {
    const val = includePrivate
      ? await fetchPrivateConfigurationVariable(name, useCache)
      : await fetchConfigurationVariable(
        name,
        useCache,
        /*requirePublic=*/ true,
      );

    if (!isSet(val)) continue; // skip unresolved

    lines.push(`${name}=${val}`);
  }

  if (!lines.length) {
    logger?.warn("writeEnvFile(): nothing to write – no secrets resolved");
    return;
  }

  await Deno.writeTextFile(filePath, lines.join("\n") + "\n");
  logger?.info(`.env written → ${filePath} (${lines.length} keys)`);
}

if (import.meta.main) {
  await refreshAllSecrets();
  await writeEnvFile();
}
