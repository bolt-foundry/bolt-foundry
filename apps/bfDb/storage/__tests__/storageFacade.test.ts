#! /usr/bin/env -S bff test
import { assertEquals, assertExists } from "@std/assert";
import { storage } from "@bfmono/apps/bfDb/storage/storage.ts";
import { AdapterRegistry } from "@bfmono/apps/bfDb/storage/AdapterRegistry.ts";
import { InMemoryAdapter } from "@bfmono/apps/bfDb/storage/InMemoryAdapter.ts";
import type { BfGid } from "@bfmono/lib/types.ts";

Deno.test("storage facade auto‑registers default adapter", async () => {
  AdapterRegistry.clear();
  await storage.initialize();
  assertExists(AdapterRegistry.get());
});

Deno.test("delegates CRUD to adapter", async () => {
  AdapterRegistry.clear();
  const spy = new InMemoryAdapter();
  AdapterRegistry.register(spy);

  const props = { name: "foo" };
  const meta = {
    bfGid: ("g1" as BfGid),
    bfOid: ("o1" as BfGid),
    className: "Test",
    createdAt: new Date(),
    lastUpdated: new Date(),
    sortValue: 1,
    bfCid: ("c1" as BfGid),
  };

  // put
  await storage.put(props, meta);
  const stored = await storage.get(meta.bfOid, meta.bfGid);
  assertEquals(stored?.props, props);

  // delete
  await storage.delete(meta.bfOid, meta.bfGid);
  const removed = await storage.get(meta.bfOid, meta.bfGid);
  assertEquals(removed, null);
});
