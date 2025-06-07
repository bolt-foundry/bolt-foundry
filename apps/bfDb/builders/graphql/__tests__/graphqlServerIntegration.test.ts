#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";

/**
 * Simplified test mock for Nexus/GraphQL integration
 * that works with our new builder implementation
 */

Deno.test("GraphQL Builder creates valid GraphQL type definitions", () => {
  // Create a spec using our builder
  const spec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .nonNull.id("id")
      .boolean("isActive")
      .int("count")
  );

  // Verify the spec has the expected fields
  const fields = spec.fields as Record<
    string,
    { type: string; nonNull?: boolean }
  >;
  assert(fields.name, "name field should exist");
  assert(fields.id, "id field should exist");
  assert(fields.isActive, "isActive field should exist");
  assert(fields.count, "count field should exist");

  // Check specific field properties
  assertEquals(fields.name.type, "String", "name should be a String");
  assertEquals(fields.id.type, "ID", "id should be an ID");
  assertEquals(fields.id.nonNull, true, "id should be nonNull");
});

Deno.test("GraphQL Builder supports field resolvers", () => {
  // Create a spec with a resolver
  const spec = makeGqlSpec((gql) =>
    gql.string("hello", {
      resolve: () => "world",
    })
  );

  // Verify the resolver is included
  type ResolverField = {
    type: string;
    resolve?: (...args: Array<unknown>) => unknown;
  };

  const field = spec.fields.hello as ResolverField;
  assert(field, "hello field should exist");
  assert(
    typeof field.resolve === "function",
    "hello should have a resolver function",
  );

  // Test the resolver
  if (field.resolve) {
    const result = field.resolve();
    assertEquals(result, "world", "Resolver should return the expected value");
  }
});
