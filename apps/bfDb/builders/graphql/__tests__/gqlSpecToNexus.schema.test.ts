#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";

/**
 * Tests to verify that the GraphQL schema correctly exposes the edge relationships.
 * These tests focus on the schema structure rather than resolver logic.
 */

Deno.test("BfPerson exposes memberOf relationship to BfOrganization", () => {
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .string("email")
      .object(
        "memberOf",
        () => class BfOrganization {}, // Using thunk style for type reference
        {
          isEdgeRelationship: true, // Explicitly mark as edge relationship
        }
      )
  );

  const result = gqlSpecToNexus(personSpec, "BfPerson");

  let hasRelation = false;
  const mockBuilder = {
    field: (name: string, config: Record<string, unknown>) => {
      if (name === "memberOf") {
        hasRelation = true;
        assertEquals(
          config.type,
          "BfPerson_memberOf_BfOrganization", // Use pattern SourceType_RelationName_TargetType for uniqueness
          "Relation should use source and target type names in the relationship type name",
        );
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder);
  assert(hasRelation, "The schema should expose the memberOf relationship");
});

Deno.test("Nexus schema correctly maps edge relationship configuration", () => {
  // This tests the basic structure mapping, not the resolver logic
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .object(
        "memberOf",
        () => class BfOrganization {}, // Using thunk style for type reference
        {
          isEdgeRelationship: true, // Explicitly mark as edge relationship
        }
      )
  );

  const result = gqlSpecToNexus(personSpec, "BfPerson");

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
    "BfPerson_memberOf_BfOrganization", // Use pattern SourceType_RelationName_TargetType for uniqueness
    "Should use source and target type names in the relationship type name",
  );
  assert(
    typeof fields.memberOf.resolve === "function",
    "Should have a resolver function",
  );
});
