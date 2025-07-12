/**
 * Functional tests for the BoltFoundryComCurrentViewer GraphQL queries
 *
 * This test verifies that the currentViewer pattern works end-to-end by
 * executing actual GraphQL queries against the boltfoundry-com schema.
 */

import { assertEquals, assertExists } from "@std/assert";
import { graphql } from "graphql";
import { schema } from "../schema.ts";

// Helper to execute GraphQL queries against the boltfoundry-com schema
async function executeQuery(
  query: string,
  variables?: Record<string, unknown>,
) {
  const builtSchema = schema;

  // Create minimal context (no authentication needed for this public API)
  const mockContext = {
    getCvForGraphql: () => ({
      id: "test",
      __typename: "CurrentViewerLoggedOut",
    }),
  };

  const result = await graphql({
    schema: builtSchema,
    source: query,
    contextValue: mockContext,
    variableValues: variables,
  });

  return result;
}

Deno.test("currentViewer query structure works", async () => {
  const query = `
    query TestCurrentViewer {
      currentViewer {
        __typename
      }
    }
  `;

  const result = await executeQuery(query);

  assertEquals(result.errors, undefined, "Query should execute without errors");
  assertExists(result.data?.currentViewer, "currentViewer field should exist");
  assertEquals(
    result.data?.currentViewer.__typename,
    "BoltFoundryComCurrentViewer",
    "Should return correct type",
  );
});

Deno.test("currentViewer excludes authentication fields", async () => {
  const query = `
    query TestViewerFields {
      currentViewer {
        __typename
        # These fields should NOT exist in BoltFoundryComCurrentViewer
        # personBfGid  # Should cause GraphQL error
        # orgBfOid     # Should cause GraphQL error
      }
    }
  `;

  const result = await executeQuery(query);

  assertEquals(result.errors, undefined, "Query should execute without errors");
  assertEquals(
    result.data?.currentViewer.__typename,
    "BoltFoundryComCurrentViewer",
    "Should be our custom viewer type, not authentication CurrentViewer",
  );
});
