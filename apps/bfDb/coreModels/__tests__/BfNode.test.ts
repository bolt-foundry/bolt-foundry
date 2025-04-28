#! /usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { storage } from "apps/bfDb/storage/storage.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { testBfNodeBase } from "apps/bfDb/classes/__tests__/BfNodeBaseTest.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";

testBfNodeBase(BfNode);

Deno.test("BfNode persists via storage adapter", async () => {
  await withIsolatedDb(async () => {
    const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
      "test",
      "test",
    );

    // create & save
    const n = await BfNode.__DANGEROUS__createUnattached(cv, { name: "alice" });

    // fetch raw through façade → adapter
    const raw = await storage.get(cv.bfOid, n.metadata.bfGid);
    assertExists(raw, "node didn’t save through storage");
    assertEquals(raw.props.name, "alice");
  });
});
