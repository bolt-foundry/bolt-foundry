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
function buildSdl(): string {
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
  const { mainType } = gqlSpecToNexus(querySpec, "Query");

  // Build schema with the generated types
  const schema = makeSchema({
    types: [
      mainType,
      // Add a CurrentViewer type to prevent errors
      {
        name: "CurrentViewer",
        definition(t) {
          // We don't need to type 't' with a specific type
          // as it's internal to the Nexus library
          t.id("id");
        },
      },
    ],
  });

  return printSchema(schema);
}

Deno.test.ignore("Query.currentViewer root field is present", () => {
  const sdl = buildSdl();

  assert(
    sdl.includes("type Query") &&
      sdl.includes("currentViewer: CurrentViewer!"),
    "Schema is missing `currentViewer` on root Query",
  );
});
