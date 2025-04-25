#! /usr/bin/env -S bff test

/**
 * 🔴 Red test – will fail until `CurrentViewer.ts` is migrated from
 * `BfCurrentViewer.ts` and exports a `gqlSpec`.
 */

import { assertExists } from "@std/assert";

Deno.test("CurrentViewer class exists and defines gqlSpec", async () => {
  // Dynamic import lets the suite compile even before the file is created.
  const moduleUrl = new URL("../../classes/CurrentViewer.ts", import.meta.url)
    .href;

  let mod: unknown;
  try {
    mod = await import(moduleUrl);
  } catch {
    throw new Error("CurrentViewer.ts module is missing");
  }

  // @ts-expect-error – runtime shape only
  const { CurrentViewer } = mod;
  assertExists(CurrentViewer, "CurrentViewer export missing");
  assertExists(CurrentViewer.gqlSpec, "CurrentViewer.gqlSpec missing");
});
