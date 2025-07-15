#! /usr/bin/env -S bff test
/**
 * BfNode.connection() – Tests for static connection method
 *
 * Tests the scratch GraphQL connections implementation that provides
 * basic connection functionality while throwing errors for pagination.
 */

import { assertEquals, assertThrows } from "@std/assert";
import { BfErrorNotImplemented } from "@bfmono/lib/BfError.ts";
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
  Deno.test(`BfNode.connection() - should throw BfErrorNotImplemented when ${testCase.name} provided`, () => {
    const nodes: Array<TestNode> = [];

    assertThrows(
      () => BfNode.connection(nodes, testCase.args as ConnectionArguments),
      BfErrorNotImplemented,
      "Cursor-based pagination requires node traversal methods",
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

Deno.test("BfNode.connection() - error message should be helpful and specific", () => {
  const nodes: Array<TestNode> = [];
  const args: ConnectionArguments = { first: 10 };

  assertThrows(
    () => BfNode.connection(nodes, args),
    BfErrorNotImplemented,
    "Use static queries without pagination args for now",
  );
});
