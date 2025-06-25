#! /usr/bin/env -S bff test
import { assertEquals, assertThrows } from "@std/assert";
import { AdapterRegistry } from "@bfmono/apps/bfDb/storage/AdapterRegistry.ts";

// Dummy adapter that fulfils the (aliased) interface shape at compile‑time.
// Cast as `never` for now – we never call its methods in this test.
const dummyAdapter = {} as never;

Deno.test("AdapterRegistry.get throws before register()", () => {
  AdapterRegistry.clear();
  assertThrows(() => AdapterRegistry.get());
});

Deno.test("AdapterRegistry registers & returns the same instance", () => {
  AdapterRegistry.clear();
  AdapterRegistry.register(dummyAdapter);

  // ↓ This *should* return the adapter we just registered.
  // With the current stub, `get()` still throws, so this test fails (red).
  const active = AdapterRegistry.get();
  assertEquals(active, dummyAdapter);
});
