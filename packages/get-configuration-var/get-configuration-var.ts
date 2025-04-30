// get-configuration-var.ts
// Bolt Foundry • secrets helper – “bulk-warm + auto-refresh” edition
// ------------------------------------------------------------------

type Maybe<T> = T | undefined;

/* ───────────  user-tunable knobs  ─────────── */
const SHOULD_CACHE: boolean = (typeof Deno !== "undefined")
  ? Deno.env.get("BF_CACHE_ENV") !== "false"
  : false;
const DEFAULT_TTL_SEC = 60 * 5; // 5-min fallback
const TTL_ITEM_NAME = "BF_CACHE_TTL_SEC"; // title inside vault

/* ───────────  util helpers  ─────────── */
const isSet = (v: string | undefined): v is string => !!v?.trim();
const text = new TextDecoder();

/* ───────────  permission helper  ───────────
 *
 * We ask Deno once whether we’re allowed to run `op`.
 * Everything that touches 1Password is gated behind this flag.
 */
const canRunOpPromise: Promise<boolean> = (async () => {
  if (typeof Deno === "undefined" || !("permissions" in Deno)) {
    return Promise.resolve(false);
  }
  try {
    const s = await Deno.permissions
      // (silently falls back to “denied” on older runtimes)
      .query({ name: "run", command: "op" as const });
    return s.state === "granted";
  } catch {
    return false;
  }
})();
function canRunOp(): Promise<boolean> {
  return canRunOpPromise;
}

/* ───────────  Cache layers  ───────────
 *
 * promiseCache – dedupes concurrent in-flight look-ups so we don’t
 *                spawn multiple `op read` processes for the same ref.
 * valueCache   – fully-resolved string values for ultra-fast sync reads
 *                (e.g. inside GraphQL resolvers that can’t await).
 */
const promiseCache = new Map<string, Promise<string | undefined>>();
const valueCache = new Map<string, string | undefined>();

/* ───────────  env helpers (browser / Deno / Node)  ─────────── */
function browserEnv(name: string): Maybe<string> {
  // @ts-expect-error browser-only global injected at build-time
  return globalThis.window && globalThis.__ENVIRONMENT__?.[name];
}
function runtimeEnv(name: string): Maybe<string> {
  return (typeof Deno !== "undefined") ? Deno.env.get(name) : undefined;
}

/* ───────────  vault discovery (cached once)  ─────────── */
let vaultId: string;
async function firstVault(): Promise<string> {
  if (vaultId) return vaultId;
  if (!(await canRunOp())) {
    throw new Error(
      "1Password integration disabled – re-run with --allow-run=op",
    );
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

/* ───────────  low-level per-ref fetch  ─────────── */
function cachedResolve(
  ref: string,
  useCache = SHOULD_CACHE,
): Promise<string | undefined> {
  // 1️⃣  Instant return if we already have a resolved value.
  if (useCache && valueCache.has(ref)) {
    return Promise.resolve(valueCache.get(ref));
  }

  // 2️⃣  Coalesce concurrent look-ups.
  if (useCache && promiseCache.has(ref)) {
    return promiseCache.get(ref)!;
  }

  // 3️⃣  Spawn the `op` CLI.
  const cmd = new Deno.Command("op", {
    args: ["read", ref],
    stdout: "piped",
    stderr: "piped",
  });

  const p = cmd.output().then(({ success, stdout, stderr }) => {
    if (!success) {
      promiseCache.delete(ref);
      throw new Error(
        `Failed to resolve ${ref}: ${new TextDecoder().decode(stderr)}`,
      );
    }
    const value = new TextDecoder().decode(stdout).trim();
    // Populate both caches.
    valueCache.set(ref, value);
    return value;
  });

  if (useCache) promiseCache.set(ref, p);
  return p;
}

/* ───────────  high-level single-var API  ─────────── */
export function getConfigurationVariable(name: string): Maybe<string> {
  // (1) browser stub
  const b = browserEnv(name);
  if (isSet(b)) return b;

  // (2) plain runtime env
  const r = runtimeEnv(name);
  if (isSet(r)) return r;

  // (3) 1Password value cache (only after at least one vault call)
  if (vaultId) {
    const cached = valueCache.get(`op://${vaultId}/${name}/value`);
    if (isSet(cached)) return cached;
  }
  return undefined;
}

export async function fetchConfigurationVariable(
  name: string,
  useCache = SHOULD_CACHE,
): Promise<string | undefined> {
  // fast paths first
  const sync = getConfigurationVariable(name);
  if (isSet(sync)) return sync;

  // 1Password look-up only if we have run permission
  if (!(await canRunOp())) return undefined;

  const vault = await firstVault();
  return cachedResolve(`op://${vault}/${name}/value`, useCache);
}

/* ───────────  BULK WARM + AUTO-REFRESH  ─────────── */

async function listItemTitles(): Promise<string[]> {
  const vault = await firstVault();
  const { stdout } = await new Deno.Command("op", {
    args: ["item", "list", "--vault", vault, "--format=json"],
    stdout: "piped",
  }).output();
  return JSON.parse(text.decode(stdout)).map((x: { title: string }) => x.title);
}

/**
 * Inject many secrets at once.
 * Uses **JSON templates + JSON output** so we no longer depend on an “env” format.
 */
async function injectMany(
  titles: string[],
): Promise<Record<string, string>> {
  const vault = await firstVault();

  // Build a JSON template like:
  // { "OPENAI_API_KEY": "op://<vault>/OPENAI_API_KEY/value", ... }
  const templateObj: Record<string, string> = {};
  for (const t of titles) templateObj[t] = `op://${vault}/${t}/value`;
  const templateJson = JSON.stringify(templateObj);

  const cmd = new Deno.Command("op", {
    args: ["inject", "--format=json"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const child = cmd.spawn();
  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(templateJson));
  await writer.close();

  const { success, stdout, stderr } = await child.output();
  if (!success) throw new Error(`op inject failed: ${text.decode(stderr)}`);

  return JSON.parse(text.decode(stdout));
}

async function refreshAllSecrets(): Promise<void> {
  const vault = await firstVault();
  const titles = await listItemTitles();
  const resolved = await injectMany(titles);

  // Replace caches with fresh values
  for (const [title, value] of Object.entries(resolved)) {
    const path = `op://${vault}/${title}/value`;
    promiseCache.set(path, Promise.resolve(value));
    valueCache.set(path, value);
  }
}

/* ───────────  TTL discovery & refresher bootstrap  ─────────── */

async function resolveTTL(): Promise<number> {
  const raw = await fetchConfigurationVariable(TTL_ITEM_NAME, false);
  const sec = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(sec) && sec > 0 ? sec : DEFAULT_TTL_SEC;
}

export async function startAutoRefresh() {
  if (!(await canRunOp())) return; // permission missing → no auto-refresh

  const [ttlSec] = await Promise.all([
    await resolveTTL(),
    await refreshAllSecrets(),
  ]);

  const timer = setTimeout(startAutoRefresh, ttlSec * 1_000); // then keep fresh
  Deno.unrefTimer(timer);
}
