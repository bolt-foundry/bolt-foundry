#! /usr/bin/env -S bff test

/**
 * Test for the TestType integration in graphqlServer
 */

import { assert } from "@std/assert";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { loadGqlTypes } from "../graphqlServer.ts";

function buildTestSchema(): string {
  const schema = makeSchema({ types: { ...loadGqlTypes() } });
  return printSchema(schema);
}

Deno.test("graphqlServer includes TestType in schema", () => {
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
});

Deno.test("graphqlServer schema includes health check", () => {
  const sdl = buildTestSchema();

  // Verify ok field is present
  assert(
    sdl.includes("ok: Boolean!"),
    "Schema is missing health check field",
  );
});
