#! /usr/bin/env -S bff test

/**
 * 🔴 Red test – turns green once the root `currentViewer` field exists.
 */

import { assert } from "@std/assert";
import { printSchema } from "graphql";
import { buildTestSchema } from "./TestHelpers.test.ts";

Deno.test.ignore("Query.currentViewer root field is present", async () => {
  // Use production schema to check for currentViewer field
  const schema = await buildTestSchema();
  const sdl = printSchema(schema);

  assert(
    sdl.includes("type Query") &&
      sdl.includes("currentViewer: CurrentViewer!"),
    "Schema is missing `currentViewer` on root Query",
  );
});
