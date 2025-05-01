// packages/get-configuration-var/get-configuration-var.ts
// Bolt Foundry • secrets helper — “tag-based” edition
// ------------------------------------------------------------------

import type { Logger } from "@bolt-foundry/logger";
import {
  PRIVATE_CONFIG_KEYS,
  PUBLIC_CONFIG_KEYS,
} from "apps/boltFoundry/__generated__/configKeys.ts";

/* ───────────  public / private classification via tags  ─────────── */
const CANON = (s: string) => s.trim().toUpperCase();

const PUBLIC_KEYS = new Set<string>(PUBLIC_CONFIG_KEYS.map(CANON));
const PRIVATE_KEYS = new Set<string>(PRIVATE_CONFIG_KEYS.map(CANON));
const KNOWN_KEYS = new Set<string>([
  ...PUBLIC_KEYS,
  ...PRIVATE_KEYS,
]);

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
  "BF_CACHE_ENV", // disable caching (e.g. for tests)"
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
  if (typeof Deno === "undefined" || !("permissions" in Deno)) {
    return Promise.resolve(false);
  }
  try {
    const s = await Deno.permissions
      .query({ name: "run", command: "op" as const });
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
    throw new Error("1Password integration disabled — run with --allow-run=op");
  }
  const { stdout } = await new Deno.Command("op", {
    args: ["vault", "list", "--format=json"],
    stdout: "piped",
  }).output();
  const vaults = JSON.parse(text.decode(stdout));
  if (!vaults.length) throw new Error("No 1Password vaults visible");
  if (vaults.length > 1) {
    throw new Error("Multiple vaults visible; hard-coding not yet supported");
  }
  vaultId = vaults[0].id;
  return vaultId;
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
  // ✋ Reject immediately if caller asks for an unknown key
  if (!isKnownKey(name)) return undefined;

  // 1️⃣ browser compile-time env
  const b = browserEnv(name);
  if (isSet(b)) return b;

  // 2️⃣ runtime env (Deno / Node)
  const r = runtimeEnv(name);
  if (isSet(r)) return r;

  // 3️⃣ cached secret from 1Password (if already warm)
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
  // Fast-path first
  const sync = getConfigurationVariable(name, requirePublic);
  if (isSet(sync)) return sync;

  // Bail early if not recognised
  if (!isKnownKey(name)) return undefined;

  // 1Password path
  if (!(await canRunOp())) return undefined;
  if (requirePublic && !isPublicKey(name)) return undefined;

  const vault = await firstVault();
  const val = await cachedRead(`op://${vault}/${name}/value`, useCache);
  return isSet(val) ? val : undefined;
}

/* ───────────  helper aliases for private access  ─────────── */
export function getPrivateConfigurationVariable(
  name: string,
): string | undefined {
  return getConfigurationVariable(name, /*requirePublic=*/ false);
}
export function fetchPrivateConfigurationVariable(
  name: string,
  useCache = SHOULD_CACHE,
): Promise<string | undefined> {
  return fetchConfigurationVariable(name, useCache, /*requirePublic=*/ false);
}

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
    logger?.warn(`Bulk warm-up skipped – some items missing in the vault`, err);
    return;
  }
  const vault = await firstVault();

  for (const [name, val] of Object.entries(payload)) {
    const path = `op://${vault}/${name}/value`;
    promiseCache.set(path, Promise.resolve(val));
    valueCache.set(path, val);
  }
  logger?.info(
    `Refreshed ${names.length} secrets from 1Password vault ${vaultId}`,
  );
}

let ttlSeconds: number = DEFAULT_TTL_SEC;
/* ───────────  TTL handling  ─────────── */
async function resolveTTL(): Promise<number> {
  const raw = await fetchConfigurationVariable(TTL_ITEM_NAME, false);
  const sec = raw ? Number.parseInt(raw, 10) : NaN;
  ttlSeconds = Number.isFinite(sec) && sec > 0 ? sec : DEFAULT_TTL_SEC;
  return ttlSeconds;
}

/**
 * Starts the periodic 1Password warm-up loop once per <TTL>.
 *
 * @returns  A handle that stops the loop when disposed.  It implements both
 *           `stop()` *and* `[Symbol.dispose]()` so you can use it manually
 *           **or** with the `using` keyword (TS ≥ 5.2 / Deno ≥ 1.40).
 */

export function startAutoRefresh(): { stop(): Promise<void> } {
  // (1) immediate warm-up (fire-and-forget)
  refreshAllSecrets().catch(() => {/* swallow, already logged */});
  resolveTTL().catch(() => {/* we don't care */});
  const pendingJobs = new Set<Promise<void>>();

  // (2) schedule the recurring job
  const timer = setInterval(() => {
    const refreshPromise = refreshAllSecrets().catch(() => {
      pendingJobs.delete(refreshPromise);
    });
    pendingJobs.add(refreshPromise);
  }, ttlSeconds * 1_000); // ttl seconds will be one tick behind probably, but that's fine
  async function stop() {
    clearInterval(timer);
    await Promise.allSettled(pendingJobs);
    pendingJobs.clear();
  }
  // (3) return a disposable
  const handle = {
    stop,
    [Symbol.dispose]: stop,
    [Symbol.asyncDispose]: stop,
  };
  return handle;
}
