#! /usr/bin/env -S bff test

import { assertExists } from "@std/assert";
import { AdapterRegistry } from "../AdapterRegistry.ts";
import { storage } from "../storage.ts";

Deno.test("storage facade auto‑registers a default adapter", async () => {
  // Ensure a pristine registry so we can observe the auto‑registration effect.
  AdapterRegistry.clear();

  // Any storage operation should trigger registration; initialize() is the
  // lightest‑weight call.
  await storage.initialize();

  const adapter = AdapterRegistry.get();
  assertExists(adapter, "adapter should be registered by storage facade");

  await storage.close();
});
