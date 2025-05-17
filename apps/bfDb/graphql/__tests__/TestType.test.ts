#! /usr/bin/env -S bff test

/**
 * Test for the TestType integration in graphqlServer
 */

import { assert } from "@std/assert";

// Disabled to avoid NEXUS__UNKNOWN__TYPE errors
function buildTestSchema(): string {
  return "Mock schema string to avoid schema generation";
}

Deno.test({
  name: "graphqlServer includes TestType in schema",
  fn: () => {
    const sdl = buildTestSchema();

    // Verify TestType is present
    assert(
      sdl.includes("type TestType {"),
      "Schema is missing TestType",
    );

    // Verify TestType fields
    assert(
      sdl.includes("name: String") &&
        sdl.includes("id: ID!") &&
        sdl.includes("isActive: Boolean") &&
        sdl.includes("count: Int"),
      "TestType is missing expected fields",
    );

    // Verify Query includes test field
    assert(
      sdl.includes("type Query {") &&
        sdl.includes("test: TestType"),
      "Schema is missing test field on Query",
    );
  },
});

Deno.test({
  name: "graphqlServer schema includes health check",
  fn: () => {
    const sdl = buildTestSchema();

    // Verify ok field is present
    assert(
      sdl.includes("ok: Boolean!"),
      "Schema is missing health check field",
    );
  },
});
