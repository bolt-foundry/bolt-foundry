#! /usr/bin/env -S bff test

/**
 * 🔴 Red test – turns green once the root `currentViewer` field exists.
 */

import { assert } from "@std/assert";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { loadModelTypes } from "apps/bfDb/graphql/builder/loadSpecs.ts";

function buildSdl(): string {
  const schema = makeSchema({ types: { ...loadModelTypes() } });
  return printSchema(schema);
}

Deno.test("Query.currentViewer root field is present", () => {
  const sdl = buildSdl();

  assert(
    sdl.includes("type Query") &&
      sdl.includes("currentViewer: CurrentViewer!"),
    "Schema is missing `currentViewer` on root Query",
  );
});
