#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";

/**
 * Tests to verify that the GraphQL schema correctly exposes the edge relationships.
 * These tests focus on the schema structure rather than resolver logic.
 */

Deno.test("BfPerson exposes memberOf relationship to BfOrganization", async () => {
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .string("email")
      .object(
        "memberOf",
        () => Promise.resolve(class BfOrganization {}), // Using thunk style for type reference
        // No options needed - field name "memberOf" automatically becomes the edge role
      )
  );

  const result = await gqlSpecToNexus(personSpec, "BfPerson");

  let hasRelation = false;
  const mockBuilder = {
    field: (name: string, config: Record<string, unknown>) => {
      if (name === "memberOf") {
        hasRelation = true;
        assertEquals(
          config.type,
          "BfOrganization", // Field type should be the target type
          "Relation should use target type name as the field type",
        );
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder);
  assert(hasRelation, "The schema should expose the memberOf relationship");
});

Deno.test("Nexus schema correctly maps edge relationship configuration", async () => {
  // This tests the basic structure mapping, not the resolver logic
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .object(
        "memberOf",
        () => Promise.resolve(class BfOrganization {}), // Using thunk style for type reference
        // No options needed - field name "memberOf" automatically becomes the edge role
      )
  );

  const result = await gqlSpecToNexus(personSpec, "BfPerson");

  // Extract the definition function for testing
  const definitionFn = result.mainType.definition;

  // Create a mock builder to collect schema information
  const fields: Record<string, Record<string, unknown>> = {};
  const mockBuilder = {
    field: (name: string, config: Record<string, unknown>) => {
      fields[name] = { ...config };
      return mockBuilder;
    },
  };

  // Execute the definition function with our mock builder
  definitionFn(mockBuilder);

  // Verify the schema structure
  assert(fields.memberOf, "The memberOf field should be defined");
  assertEquals(
    fields.memberOf.type,
    "BfOrganization", // Field type should be the target type
    "Should use target type name as the field type",
  );
  assert(
    typeof fields.memberOf.resolve === "function",
    "Should have a resolver function",
  );
});
