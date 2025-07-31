#! /usr/bin/env -S deno test
/**
 * infra/bff/__tests__/iso.test.ts
 * Verifies that "bft iso" (Isograph code-gen) succeeds.
 *
 * NOTE: This test has been updated to test the new bft iso command
 * instead of the deprecated bff iso command.
 */

import { assertEquals } from "@std/assert";
import { isoCommand } from "@bfmono/infra/bft/tasks/iso.bft.ts";

/**
 * When invoked without options the helper exports the same numeric exit-code
 * that the actual CLI would return, so a simple equality assertion is enough.
 *
 *   0 → success
 *   ≠0 → compiler error (test fails)
 */
Deno.test("bft iso exits with code 0", async () => {
  const exitCode = await isoCommand([]);
  assertEquals(exitCode, 0);
});
