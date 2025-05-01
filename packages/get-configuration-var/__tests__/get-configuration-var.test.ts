#!/usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import {
  fetchConfigurationVariable,
  fetchPrivateConfigurationVariable,
  getConfigurationVariable,
  getPrivateConfigurationVariable,
} from "@bolt-foundry/get-configuration-var";

/* ─────────── constants ─────────── */
const PUBLIC_KEY = "unit-test-public";
const PRIVATE_KEY = "unit-test-secret";

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

Deno.test("startAutoRefresh survives unknown vault items", async () => {
  // Keep originals so we can restore them afterwards
  const RealCommand = Deno.Command;

  // Minimal mock that (1) lets `vault list` work, (2) makes `inject` fail
  class MockCommand {
    #args: string[];
    constructor(_: string, opts: Deno.CommandOptions) {
      this.#args = opts.args ?? [];
    }

    /* used by firstVault() */
    // deno-lint-ignore require-await
    async output() {
      if (this.#args[0] === "vault") {
        return {
          success: true,
          stdout: new TextEncoder().encode('[{ "id": "vault_dummy" }]'),
          stderr: new Uint8Array(),
        };
      }
      // default: fail
      return {
        success: false,
        stdout: new Uint8Array(),
        stderr: new TextEncoder().encode(
          "could not resolve item UUID for item BF_CACHE_ENV",
        ),
      };
    }

    /* used by injectMany() */
    spawn() {
      // deno-lint-ignore no-this-alias
      const self = this;
      return {
        stdin: {
          getWriter() {
            return {
              async write(_: Uint8Array) {},
              async close() {},
            };
          },
        },
        // deno-lint-ignore require-await
        async output() {
          return self.output();
        },
      };
    }
  }

  // Patch
  Deno.Command = MockCommand as unknown as typeof Deno.Command;

  // Import lazily so the patched Command is in place for any code-path that re-evaluates permissions
  const { startAutoRefresh } = await import(
    "@bolt-foundry/get-configuration-var"
  );

  // use `using` so the timer is cleared when the block ends
  using _refresher = startAutoRefresh();

  // Give it one macro-tick so the initial warm-up promise settles
  Deno.Command = RealCommand;
  await Promise.resolve();
});
