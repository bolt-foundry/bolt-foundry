#!/usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import {
  fetchConfigurationVariable,
  getConfigurationVariable,
} from "@bolt-foundry/get-configuration-var";

/*
  Test policy: we now assume the **1Password CLI** (`op`) is installed *and* already
  signed‑in for the current user.  There are **no fallbacks or shims** – tests call
  the real binary.  Secrets required by the assertions must be present in the CI
  vault (or in a local developer vault with identical paths).
*/

/* ────────────────  getConfigurationVariable (sync)  ──────────────── */
Deno.test("getConfigurationVariable – returns value when env var is set", () => {
  Deno.env.set("UNIT_TEST_ENV_VAR", "expected-value");
  assertEquals(getConfigurationVariable("UNIT_TEST_ENV_VAR"), "expected-value");
  Deno.env.delete("UNIT_TEST_ENV_VAR");
});

Deno.test("getConfigurationVariable – returns undefined when env var missing", () => {
  assertEquals(getConfigurationVariable("MISSING_ENV_VAR"), undefined);
});

Deno.test("getConfigurationVariable – treats empty string as undefined", () => {
  Deno.env.set("EMPTY_ENV_VAR", "");
  assertEquals(getConfigurationVariable("EMPTY_ENV_VAR"), undefined);
  Deno.env.delete("EMPTY_ENV_VAR");
});

/* ────────────────  fetchConfigurationVariable (async)  ──────────────── */

const TEST_OP_KEY = "unit-test-secret";

Deno.test("fetchConfigurationVariable – resolves a 1Password reference via CLI", async () => {
  // Call the library under test ➜ this *should* invoke `op read --raw` internally
  const libValue = await fetchConfigurationVariable(TEST_OP_KEY);

  if (libValue === undefined) {
    throw new Error(
      `Expected secret ${TEST_OP_KEY} to be available via 1Password CLI (is the CI vault configured?)`,
    );
  }
  assertEquals(libValue, "unit-test-secret-value");
});
