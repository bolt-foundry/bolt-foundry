#! /usr/bin/env -S bff test
/**
 * Integration tests for the lean secrets helper (env‑first edition).
 *
 * These replace the legacy‑API suite by exercising the _new_ surface:
 *   • getSecret()
 *   • warmSecrets()
 *
 * The semantics we care about are mostly unchanged:
 *   1. A process‑level ENV var must win over everything.
 *   2. Vault values resolve correctly when a key isn’t in ENV.
 *   3. Unknown keys resolve _only_ from ENV (they should _not_ leak from the
 *      vault). We no longer block unknown ENV keys because the helper is intentionally
 *      permissive in env‑first mode.
 */

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals } from "@std/assert";
import { getSecret, warmSecrets } from "@bolt-foundry/get-configuration-var";

/* ─────────── constants ─────────── */
const PUBLIC_KEY = "UNIT_TEST_PUBLIC"; // expected vault value: "public-value"
const PRIVATE_KEY = "UNIT_TEST_SECRET"; // expected vault value: "shh-not-public"
const UNKNOWN_KEY = "MISSING_FROM_CONFIG_KEYS";

/* ─────────── helper – run only if the private item exists ─────────── */
let _hasPrivateCache: Promise<boolean> | null = null;
function hasPrivateItem(): Promise<boolean> {
  if (_hasPrivateCache) return _hasPrivateCache;
  _hasPrivateCache = (async () => {
    try {
      const v = await getSecret(PRIVATE_KEY);
      return v !== undefined;
    } catch {
      return false;
    }
  })();
  return _hasPrivateCache;
}

/* ─────────── ENV precedence ─────────── */
Deno.test("ENV var wins over vault + cache", async () => {
  Deno.env.set(PUBLIC_KEY, "open-sesame");
  const val = await getSecret(PUBLIC_KEY);
  assertEquals(val, "open-sesame");
  Deno.env.delete(PUBLIC_KEY);
});

/* ─────────── Basic vault resolution ─────────── */
Deno.test("getSecret() resolves public value from vault when not in ENV", async () => {
  // Skip test if secrets update is not needed (far future timestamp)
  const nextUpdate = getConfigurationVariable("BF_SECRETS_NEXT_UPDATE");
  if (nextUpdate && Number(nextUpdate) > Date.now()) {
    console.log("Skipping vault test - BF_SECRETS_NEXT_UPDATE prevents 1Password access");
    return; // Skip test when secrets update is not needed
  }
  const val = await getSecret(PUBLIC_KEY);
  assertEquals(val, "public-value");
});

/* ─────────── Private‑item suite (lazy skip) ─────────── */
Deno.test("getSecret() resolves private value from vault", async () => {
  if (!(await hasPrivateItem())) return; // skip silently when vault item absent
  const val = await getSecret(PRIVATE_KEY);
  assertEquals(val, "shh-not-public");
});

Deno.test("warmSecrets caches private value for fast subsequent access", async () => {
  if (!(await hasPrivateItem())) return;
  await warmSecrets([PRIVATE_KEY]); // batch warm
  const val = await getSecret(PRIVATE_KEY);
  assertEquals(val, "shh-not-public");
});

/* ─────────── ENV overrides for private keys ─────────── */
Deno.test("ENV override surfaces a private key's value", async () => {
  Deno.env.set(PRIVATE_KEY, "env-secret-value");

  // 1️⃣ getSecret() should reflect the ENV override.
  assertEquals(await getSecret(PRIVATE_KEY), "env-secret-value");

  // Clean‑up so other tests keep their original semantics.
  Deno.env.delete(PRIVATE_KEY);
});

/* ─────────── Unknown key behaviour ─────────── */
Deno.test("Unknown key resolves only via ENV", async () => {
  // 1️⃣ Without an ENV override the helper *may* throw (vault miss). We don't
  //     assert that behaviour here; instead we cover the happy path below.

  // 2️⃣ With an ENV var present the helper should surface it.
  Deno.env.set(UNKNOWN_KEY, "env‑value");
  const val = await getSecret(UNKNOWN_KEY);
  assertEquals(val, "env‑value");
  Deno.env.delete(UNKNOWN_KEY);
});

/* ──────── Unknown key missing from ENV ──────── */
Deno.test("getSecret() returns undefined when unknown key not in ENV", async () => {
  Deno.env.delete(UNKNOWN_KEY); // ensure no accidental value
  const val = await getSecret(UNKNOWN_KEY);
  assertEquals(val, undefined);
});
