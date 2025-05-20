#! /usr/bin/env -S bff test

/**
 * Tests for loading GraphQL interfaces into the schema
 */

import { assert, assertExists } from "@std/assert";
import { printSchema } from "graphql";
import { makeSchema } from "nexus";

// We'll implement this file next
import { loadGqlTypes } from "../loadGqlTypes.ts";

Deno.test("loadGqlTypes should include interface types", () => {
  // Load the types
  const types = loadGqlTypes();
  
  // Find the Node interface type in the loaded types
  const nodeInterface = types.find(
    // deno-lint-ignore no-explicit-any
    (type: any) => (type.name === "Node" || type.name === "GraphQLNode") && type.kind === "interface"
  );
  
  // Should find the Node interface
  assertExists(
    nodeInterface,
    "Node interface should be included in loaded types"
  );
});

Deno.test("Generated schema should include Node interface", () => {
  // Load all types 
  const types = loadGqlTypes();
  
  // Create schema from loaded types
  const schema = makeSchema({ types });
  
  // Print schema to SDL
  const sdl = printSchema(schema);
  
  // Should include the Node interface definition
  assert(
    sdl.includes("interface Node {"),
    "Schema should include Node interface definition"
  );
  
  // Should include id field on Node interface
  assert(
    sdl.includes("interface Node {") && sdl.includes("id: ID!"),
    "Node interface should have non-null ID field"
  );
  
  // A class implementing Node should show the interface implementation
  assert(
    sdl.includes("implements Node"),
    "Schema should include objects implementing Node interface"
  );
});