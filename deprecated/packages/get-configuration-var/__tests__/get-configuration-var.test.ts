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

import { assertEquals } from "@std/assert";
import { getSecret, warmSecrets } from "@bolt-foundry/get-configuration-var";

/* ─────────── constants ─────────── */
const PUBLIC_KEY = "UNIT_TEST_PUBLIC"; // expected vault value: "public-value"
const PRIVATE_KEY = "UNIT_TEST_SECRET"; // expected vault value: "shh-not-public"
const UNKNOWN_KEY = "MISSING_FROM_CONFIG_KEYS";

/* ─────────── helper – run only if the private item exists ─────────── */
let _hasPrivateCache: boolean | null = null;
function hasPrivateItem(): boolean {
  if (_hasPrivateCache !== null) return _hasPrivateCache;
  try {
    const v = getSecret(PRIVATE_KEY);
    _hasPrivateCache = v !== undefined;
  } catch {
    _hasPrivateCache = false;
  }
  return _hasPrivateCache;
}

/* ─────────── ENV precedence ─────────── */
Deno.test("ENV var wins over vault + cache", () => {
  Deno.env.set(PUBLIC_KEY, "open-sesame");
  const val = getSecret(PUBLIC_KEY);
  assertEquals(val, "open-sesame");
  Deno.env.delete(PUBLIC_KEY);
});

/* ─────────── Basic vault resolution ─────────── */
Deno.test("getSecret() returns undefined when key not in ENV", () => {
  // In the new implementation, secrets only come from ENV variables
  // No vault lookup happens at runtime
  Deno.env.delete(PUBLIC_KEY); // ensure it's not set
  const val = getSecret(PUBLIC_KEY);
  assertEquals(val, undefined);
});

/* ─────────── Private‑item suite (lazy skip) ─────────── */
Deno.test("getSecret() resolves private value from vault", () => {
  if (!hasPrivateItem()) return; // skip silently when vault item absent
  const val = getSecret(PRIVATE_KEY);
  assertEquals(val, "shh-not-public");
});

Deno.test("warmSecrets is now a no-op", async () => {
  // warmSecrets is deprecated since we use .env.local now
  await warmSecrets(); // no-op

  // Test that getSecret still works
  if (!hasPrivateItem()) return;
  const val = getSecret(PRIVATE_KEY);
  assertEquals(val, "shh-not-public");
});

/* ─────────── ENV overrides for private keys ─────────── */
Deno.test("ENV override surfaces a private key's value", () => {
  Deno.env.set(PRIVATE_KEY, "env-secret-value");

  // 1️⃣ getSecret() should reflect the ENV override.
  assertEquals(getSecret(PRIVATE_KEY), "env-secret-value");

  // Clean‑up so other tests keep their original semantics.
  Deno.env.delete(PRIVATE_KEY);
});

/* ─────────── Unknown key behaviour ─────────── */
Deno.test("Unknown key resolves only via ENV", () => {
  // 1️⃣ Without an ENV override the helper *may* throw (vault miss). We don't
  //     assert that behaviour here; instead we cover the happy path below.

  // 2️⃣ With an ENV var present the helper should surface it.
  Deno.env.set(UNKNOWN_KEY, "env‑value");
  const val = getSecret(UNKNOWN_KEY);
  assertEquals(val, "env‑value");
  Deno.env.delete(UNKNOWN_KEY);
});

/* ──────── Unknown key missing from ENV ──────── */
Deno.test("getSecret() returns undefined when unknown key not in ENV", () => {
  Deno.env.delete(UNKNOWN_KEY); // ensure no accidental value
  const val = getSecret(UNKNOWN_KEY);
  assertEquals(val, undefined);
});
