#! /usr/bin/env -S bff test
/**
 * infra/bff/friends/__tests__/IsoCommand.test.ts
 * Verifies that “bff iso” (Isograph code-gen) succeeds.
 */

import { assertEquals } from "@std/assert";
import { isoCommand } from "@bfmono/infra/bff/friends/iso.bff.ts";

/**
 * When invoked without options the helper exports the same numeric exit-code
 * that the actual CLI would return, so a simple equality assertion is enough.
 *
 *   0 → success
 *   ≠0 → compiler error (test fails)
 */
Deno.test("bff iso exits with code 0", async () => {
  const exitCode = await isoCommand([]);
  assertEquals(exitCode, 0);
});
