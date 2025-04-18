#! /usr/bin/env -S bff test

// ------------------------------------------------------------------
// RED‑phase test: proves that withIsolatedDb automatically registers a
// backend adapter (InMemory by default).
// This will FAIL until we implement `registerDefaultAdapter()` and wire it
// into withIsolatedDb (Refactors #6/#7).
// ------------------------------------------------------------------
import { assertExists } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { AdapterRegistry } from "apps/bfDb/storage/AdapterRegistry.ts";
import { registerDefaultAdapter } from "apps/bfDb/storage/registerDefaultAdapter.ts";

registerDefaultAdapter();
// Simple dummy node model for the test
class TestNode extends BfNode<{ name: string }> {}

Deno.test("withIsolatedDb auto‑registers adapter (future green)", async () => {
  await withIsolatedDb(async () => {
    const cv = BfCurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
      "tester",
      "tester",
    );

    // Creating a node should not throw even though we didn't manually register an adapter.
    const node = await TestNode.__DANGEROUS__createUnattached(cv, {
      name: "auto",
    });
    assertExists(node);

    // And the adapter registry should have an active adapter.
    const adapter = AdapterRegistry.get();
    assertExists(adapter);
  });
});
