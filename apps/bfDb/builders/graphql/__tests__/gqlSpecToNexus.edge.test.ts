#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";

/**
 * Tests for edge relationships in gqlSpecToNexus
 *
 * These tests verify that we can properly define and resolve relationships
 * between nodes like BfPerson and BfOrganization.
 */

Deno.test("gqlSpecToNexus supports defining edge relationships", () => {
  // Create a simple spec with an edge relationship
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .object("memberOf", {
        type: "BfOrganization",
        isEdgeRelationship: true, // Marks this as an edge relationship
        edgeRole: "member", // The role of the edge
      })
  );

  // Convert to Nexus types
  const result = gqlSpecToNexus(personSpec, "BfPerson");

  // Check that the relation is defined correctly
  let relationDefined = false;
  const mockBuilder = {
    field: (name: string, config: Record<string, unknown>) => {
      if (name === "memberOf") {
        relationDefined = true;
        assertEquals(
          config.type,
          "BfOrganization",
          "Should use the correct target type",
        );
        assert(
          typeof config.resolve === "function",
          "Should have a resolver function",
        );
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder);
  assert(relationDefined, "The edge relationship should be defined");
});

Deno.test("gqlSpecToNexus correctly configures edge relationship options", async () => {
  // Create a spec with an edge relationship with all options
  const personSpec = makeGqlSpec((gql) =>
    gql
      .string("name")
      .object("memberOf", {
        type: "BfOrganization",
        isEdgeRelationship: true,
        edgeRole: "member",
      })
  );

  // Convert to Nexus types
  const result = gqlSpecToNexus(personSpec, "BfPerson");

  // Inspect that all edge options are correctly passed through
  let relationConfig: Record<string, unknown> = null as unknown as Record<
    string,
    unknown
  >;
  const mockBuilder = {
    field: (name: string, config: Record<string, unknown>) => {
      if (name === "memberOf") {
        relationConfig = config;
      }
      return mockBuilder;
    },
  };

  result.mainType.definition(mockBuilder);

  // Make sure relationConfig was set
  assert(relationConfig !== null, "Should have found the memberOf relation");

  // Verify that the resolver is correctly created
  assert(
    typeof relationConfig.resolve === "function",
    "Should have a resolver function",
  );

  // Execute the resolver with a mock root to verify it works
  const mockRoot = {
    metadata: { bfGid: "test-id", className: "BfPerson" },
    // Add minimal mock implementation to pass initial validation
    currentViewer: {},
  };

  const mockContext = {
    findNode: () => Promise.resolve(null), // Mock findNode to return null
  };

  // The resolver now returns a Promise
  const resolvePromise = relationConfig.resolve(mockRoot, {}, mockContext);

  // Verify it's a Promise
  assert(resolvePromise instanceof Promise, "Resolver should return a Promise");

  // Wait for the Promise to resolve
  const resolveResult = await resolvePromise;

  // The resolver should return null when running in tests
  assertEquals(
    resolveResult,
    null,
    "Resolver should return null in test environment",
  );
});

// Integration test for resolvers would need a mock for BfEdge.query
// This would be implemented once we have the basic structure in place
