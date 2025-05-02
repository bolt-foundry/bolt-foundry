#!/usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import {
  fetchConfigurationVariable,
  fetchPrivateConfigurationVariable,
  getConfigurationVariable,
  getPrivateConfigurationVariable,
  startAutoRefresh,
} from "@bolt-foundry/get-configuration-var";

/* ─────────── constants ─────────── */
const PUBLIC_KEY = "UNIT_TEST_PUBLIC";
const PRIVATE_KEY = "UNIT_TEST_SECRET";

/* ─────────── helper – run only if the private item exists ─────────── */
let _hasPrivateCache: Promise<boolean> | null = null;
function hasPrivateItem(): Promise<boolean> {
  if (_hasPrivateCache) return _hasPrivateCache;
  _hasPrivateCache = (async () => {
    try {
      const v = await fetchPrivateConfigurationVariable(
        PRIVATE_KEY,
        /*cache=*/ false,
      );
      return v !== undefined;
    } catch {
      return false;
    }
  })();
  return _hasPrivateCache;
}

/* ─────────── ENV behaviour ─────────── */
Deno.test("ENV var wins and ignores public flag", () => {
  Deno.env.set(PUBLIC_KEY, "open-sesame");
  assertEquals(getConfigurationVariable(PUBLIC_KEY), "open-sesame");
  Deno.env.delete(PUBLIC_KEY);
});

/* ─────────── Public-only defaults ─────────── */
Deno.test("Default call returns public value", async () => {
  const val = await fetchConfigurationVariable(PUBLIC_KEY);
  assertEquals(val, "public-value");
});

/* ─────────── Private-item suite (lazy skip) ─────────── */

Deno.test("Default call hides private value", async () => {
  if (!(await hasPrivateItem())) return; // skip silently
  const val = await fetchConfigurationVariable(PRIVATE_KEY);
  assertEquals(val, undefined);
});

Deno.test("Opt-in flag returns private value", async () => {
  if (!(await hasPrivateItem())) return;
  const val = await fetchConfigurationVariable(PRIVATE_KEY, true, false);
  assertEquals(val, "shh-not-public");
});

Deno.test("After warm + opt-in, sync getter can see private value", async () => {
  if (!(await hasPrivateItem())) return;
  await fetchPrivateConfigurationVariable(PRIVATE_KEY); // warm cache
  assertEquals(getPrivateConfigurationVariable(PRIVATE_KEY), "shh-not-public");
});

Deno.test("getPrivateConfigurationVariable – sync lookup returns private value", async () => {
  if (!(await hasPrivateItem())) return;
  assertEquals(getPrivateConfigurationVariable(PRIVATE_KEY), "shh-not-public");
});

Deno.test("fetchPrivateConfigurationVariable – async lookup returns private value", async () => {
  if (!(await hasPrivateItem())) return;
  const val = await fetchPrivateConfigurationVariable(PRIVATE_KEY);
  assertEquals(val, "shh-not-public");
});

Deno.test("ENV override surfaces a private key's value", async () => {
  Deno.env.set(PRIVATE_KEY, "env-secret-value");

  // 1️⃣ Public-only path *still* sees the value because we short-circuit
  //    at the ENV layer before any public/private gating happens.
  assertEquals(
    await fetchConfigurationVariable(PRIVATE_KEY),
    "env-secret-value",
  );

  // 2️⃣ Private helpers should obviously see it too.
  assertEquals(
    getPrivateConfigurationVariable(PRIVATE_KEY),
    "env-secret-value",
  );

  // 3️⃣ Clean-up so the other tests keep their original semantics.
  Deno.env.delete(PRIVATE_KEY);
});

const UNKNOWN_KEY = "MISSING_FROM_CONFIG_KEYS";

Deno.test("unknown key must NOT resolve, even via ENV", async () => {
  // Simulate someone defining an env-var that _isn't_ in the generated lists.
  Deno.env.set(UNKNOWN_KEY, "should-never-escape");

  // 1️⃣ Public helpers should refuse it …
  assertEquals(
    getConfigurationVariable(UNKNOWN_KEY), // sync
    undefined,
    "Public sync accessor leaked an unknown key",
  );
  assertEquals(
    await fetchConfigurationVariable(UNKNOWN_KEY), // async
    undefined,
    "Public async accessor leaked an unknown key",
  );

  // 2️⃣ … and so should the private helpers.
  assertEquals(
    getPrivateConfigurationVariable(UNKNOWN_KEY), // sync
    undefined,
    "Private sync accessor leaked an unknown key",
  );
  assertEquals(
    await fetchPrivateConfigurationVariable(UNKNOWN_KEY), // async
    undefined,
    "Private async accessor leaked an unknown key",
  );

  // Clean-up so other tests aren’t polluted.
  Deno.env.delete(UNKNOWN_KEY);
});

Deno.test.ignore("startAutoRefresh survives unknown vault items", async () => {
  // ignored b/c test cleanup is really hard...
  const { stop } = startAutoRefresh();
  await stop();
});
