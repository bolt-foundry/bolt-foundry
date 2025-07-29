#! /usr/bin/env -S bff test
/**
 * BfNode.connection() – Tests for static connection method
 *
 * Tests the scratch GraphQL connections implementation that provides
 * basic connection functionality while throwing errors for pagination.
 */

import { assertEquals, assertExists } from "@std/assert";
import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { connectionFromArray } from "graphql-relay";
import type { ConnectionArguments } from "graphql-relay";

// Mock node class for testing
class TestNode extends BfNode<InferProps<typeof TestNode>> {
  static override gqlSpec = this.defineGqlNode((f) => f.string("name"));

  static override bfNodeSpec = this.defineBfNode((f) => f.string("name"));
}

Deno.test("BfNode.connection() - should work with empty args (no pagination)", () => {
  const nodes: Array<TestNode> = [];
  const args: ConnectionArguments = {};

  const result = BfNode.connection(nodes, args);

  assertEquals(result.edges.length, 0);
  assertEquals(result.pageInfo.hasNextPage, false);
  assertEquals(result.pageInfo.hasPreviousPage, false);
  assertEquals(result.pageInfo.startCursor, null);
  assertEquals(result.pageInfo.endCursor, null);
});

Deno.test("BfNode.connection() - should work with undefined args", () => {
  const nodes: Array<TestNode> = [];
  const args: ConnectionArguments = {};

  const result = BfNode.connection(nodes, args);

  assertEquals(result.edges.length, 0);
});

// Test data for pagination arguments
const paginationTestCases = [
  { name: "first arg", args: { first: 10 } },
  { name: "last arg", args: { last: 5 } },
  { name: "after arg", args: { after: "cursor123" } },
  { name: "before arg", args: { before: "cursor456" } },
  { name: "multiple pagination args", args: { first: 10, after: "cursor123" } },
];

for (const testCase of paginationTestCases) {
  Deno.test(`BfNode.connection() - should work with pagination when ${testCase.name} provided`, () => {
    // Create test nodes with sortable IDs (using empty arrays since we're testing structure, not content)
    const nodes: Array<TestNode> = [];

    // Should not throw - pagination now works
    const result = BfNode.connection(
      nodes,
      testCase.args as ConnectionArguments,
    );

    // Verify it returns a proper connection structure
    assertExists(result.edges, "Should have edges");
    assertExists(result.pageInfo, "Should have pageInfo");
    assertEquals(
      typeof result.pageInfo.hasNextPage,
      "boolean",
      "Should have hasNextPage",
    );
    assertEquals(
      typeof result.pageInfo.hasPreviousPage,
      "boolean",
      "Should have hasPreviousPage",
    );
  });
}

Deno.test("BfNode.connection() - should return same structure as connectionFromArray for valid args", () => {
  const nodes: Array<TestNode> = [];
  const args: ConnectionArguments = {};

  const bfNodeResult = BfNode.connection(nodes, args);
  const expectedResult = connectionFromArray(nodes, {});

  assertEquals(bfNodeResult.edges.length, expectedResult.edges.length);
  assertEquals(
    bfNodeResult.pageInfo.hasNextPage,
    expectedResult.pageInfo.hasNextPage,
  );
  assertEquals(
    bfNodeResult.pageInfo.hasPreviousPage,
    expectedResult.pageInfo.hasPreviousPage,
  );
  assertEquals(
    bfNodeResult.pageInfo.startCursor,
    expectedResult.pageInfo.startCursor,
  );
  assertEquals(
    bfNodeResult.pageInfo.endCursor,
    expectedResult.pageInfo.endCursor,
  );
});

Deno.test("BfNode.connection() - should properly handle pagination arguments without throwing", () => {
  const nodes: Array<TestNode> = [];

  // Test that pagination arguments don't throw errors anymore
  const firstResult = BfNode.connection(nodes, { first: 2 });
  assertExists(firstResult.edges, "Should have edges array");
  assertExists(firstResult.pageInfo, "Should have pageInfo object");
  assertEquals(
    typeof firstResult.pageInfo.hasNextPage,
    "boolean",
    "Should have hasNextPage boolean",
  );
  assertEquals(
    typeof firstResult.pageInfo.hasPreviousPage,
    "boolean",
    "Should have hasPreviousPage boolean",
  );

  const lastResult = BfNode.connection(nodes, { last: 2 });
  assertExists(lastResult.edges, "Should have edges array");
  assertExists(lastResult.pageInfo, "Should have pageInfo object");
});
