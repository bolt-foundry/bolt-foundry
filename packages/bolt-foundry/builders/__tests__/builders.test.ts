#! /usr/bin/env -S bff test

import { assertEquals } from "@std/assert";

import { makeSpecBuilder, type Spec } from "../builders.ts";

Deno.test("SpecBuilder - simple values and groups", () => {
  const builder = makeSpecBuilder()
    .spec("Optimistic")
    .specs("wants", (s) =>
      s
        .spec("To help")
        .spec("To learn"))
    .spec("Patient");

  const specs = builder.getSpecs();
  assertEquals(specs.length, 3);

  // Simple value
  assertEquals(specs[0].value, "Optimistic");
  assertEquals(specs[0].name, undefined);

  // Group
  assertEquals(specs[1].name, "wants");
  const wantsSpecs = specs[1].value as Array<Spec>;
  assertEquals(wantsSpecs.length, 2);
  assertEquals(wantsSpecs[0].value, "To help");

  // Another simple value
  assertEquals(specs[2].value, "Patient");
});
