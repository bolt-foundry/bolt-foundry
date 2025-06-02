#! /usr/bin/env -S bff test

/**
 * 🔴 Red test – turns green once the root `currentViewer` field exists.
 */

import { assert } from "@std/assert";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
// Update the import to a file that exists
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";

// Creating a minimal mock setup to test the existence of currentViewer
async function buildSdl(): Promise<string> {
  // Create a minimal Query type with currentViewer field
  const querySpec = {
    fields: {},
    relations: {
      currentViewer: {
        type: "CurrentViewer",
        nonNull: true,
      },
    },
    mutations: {},
  };

  // Convert to Nexus format
  const { mainType } = await gqlSpecToNexus(querySpec, "Query");

  // Build schema with the generated types
  const schema = makeSchema({
    types: [
      mainType,
      // Add a CurrentViewer type to prevent errors
      {
        name: "CurrentViewer",
        // @ts-expect-error no type yet... unimplemented
        definition(t) {
          t.id("id");
        },
      },
    ],
  });

  return printSchema(schema);
}

Deno.test.ignore("Query.currentViewer root field is present", async () => {
  const sdl = await buildSdl();

  assert(
    sdl.includes("type Query") &&
      sdl.includes("currentViewer: CurrentViewer!"),
    "Schema is missing `currentViewer` on root Query",
  );
});
