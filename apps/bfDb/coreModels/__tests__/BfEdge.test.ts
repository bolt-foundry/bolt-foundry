#! /usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { storage } from "apps/bfDb/storage/storage.ts";
import { BfEdge } from "apps/bfDb/coreModels/BfEdge.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { testBfEdgeBase } from "apps/bfDb/classes/__tests__/BfEdgeBaseTest.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";

testBfEdgeBase(BfEdge);

Deno.test("BfEdge persists via storage adapter", async () => {
  await withIsolatedDb(async () => {
    const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
      "test",
      "test",
    );

    const src = await BfNode.__DANGEROUS__createUnattached(cv, { name: "src" });
    const tgt = await BfNode.__DANGEROUS__createUnattached(cv, { name: "tgt" });

    const e = await BfEdge.createBetweenNodes(cv, src, tgt, { role: "friend" });

    const raw = await storage.get(cv.bfOid, e.metadata.bfGid);
    assertExists(raw, "edge didn’t save through storage");
    assertEquals(raw.props.role, "friend");
  });
});
