#! /usr/bin/env -S bff test
import { assertEquals, assertExists } from "@std/assert";
import { BlogPost } from "../BlogPost.ts";
import type { ConnectionArguments } from "graphql-relay";

// Mock blog posts for testing
const mockPosts = [
  new BlogPost("2025-01-latest", "Latest content"),
  new BlogPost("2024-12-second", "Second content"),
  new BlogPost("2024-11-third", "Third content"),
  new BlogPost("2024-10-fourth", "Fourth content"),
  new BlogPost("2024-09-fifth", "Fifth content"),
];

Deno.test("BlogPost.connection() should return a valid connection with edges and pageInfo", async () => {
  const args: ConnectionArguments = { first: 3 };
  const connection = await BlogPost.connection(mockPosts, args);

  assertExists(connection, "Connection should exist");
  assertExists(connection.edges, "Connection should have edges");
  assertExists(connection.pageInfo, "Connection should have pageInfo");

  assertEquals(connection.edges.length, 3, "Should return 3 edges");
  assertEquals(connection.edges[0].node.id, "2025-01-latest");
  assertEquals(connection.edges[1].node.id, "2024-12-second");
  assertEquals(connection.edges[2].node.id, "2024-11-third");

  assertExists(connection.edges[0].cursor, "Each edge should have a cursor");
  assertEquals(connection.pageInfo.hasNextPage, true, "Should have next page");
  assertEquals(
    connection.pageInfo.hasPreviousPage,
    false,
    "Should not have previous page",
  );
});

Deno.test("BlogPost.connection() should handle last argument", async () => {
  const args: ConnectionArguments = { last: 2 };
  const connection = await BlogPost.connection(mockPosts, args);

  assertEquals(connection.edges.length, 2, "Should return 2 edges");
  assertEquals(connection.edges[0].node.id, "2024-10-fourth");
  assertEquals(connection.edges[1].node.id, "2024-09-fifth");

  assertEquals(
    connection.pageInfo.hasNextPage,
    false,
    "Should not have next page",
  );
  assertEquals(
    connection.pageInfo.hasPreviousPage,
    true,
    "Should have previous page",
  );
});

Deno.test("BlogPost.connection() should handle after cursor", async () => {
  // First get a connection to get a cursor
  const firstConn = await BlogPost.connection(mockPosts, { first: 2 });
  const afterCursor = firstConn.edges[1].cursor;

  // Now use that cursor
  const args: ConnectionArguments = { first: 2, after: afterCursor };
  const connection = await BlogPost.connection(mockPosts, args);

  assertEquals(connection.edges.length, 2, "Should return 2 edges");
  assertEquals(connection.edges[0].node.id, "2024-11-third");
  assertEquals(connection.edges[1].node.id, "2024-10-fourth");
});

Deno.test("BlogPost.connection() should handle before cursor", async () => {
  // First get a connection to get cursors
  const firstConn = await BlogPost.connection(mockPosts, { first: 5 });
  const beforeCursor = firstConn.edges[3].cursor; // Fourth item

  // Now use that cursor
  const args: ConnectionArguments = { last: 2, before: beforeCursor };
  const connection = await BlogPost.connection(mockPosts, args);

  assertEquals(connection.edges.length, 2, "Should return 2 edges");
  assertEquals(connection.edges[0].node.id, "2024-12-second");
  assertEquals(connection.edges[1].node.id, "2024-11-third");
});

Deno.test("BlogPost.connection() should handle empty array", async () => {
  const args: ConnectionArguments = { first: 10 };
  const connection = await BlogPost.connection([], args);

  assertEquals(connection.edges.length, 0, "Should return no edges");
  assertEquals(connection.pageInfo.hasNextPage, false);
  assertEquals(connection.pageInfo.hasPreviousPage, false);
  assertEquals(
    connection.pageInfo.startCursor,
    null,
    "Start cursor should be null for empty connection",
  );
  assertEquals(
    connection.pageInfo.endCursor,
    null,
    "End cursor should be null for empty connection",
  );
});

Deno.test("BlogPost.connection() should handle no pagination args", async () => {
  // When no first/last is provided, should return all items
  const args: ConnectionArguments = {};
  const connection = await BlogPost.connection(mockPosts, args);

  assertEquals(connection.edges.length, 5, "Should return all edges");
  assertEquals(connection.pageInfo.hasNextPage, false);
  assertEquals(connection.pageInfo.hasPreviousPage, false);
});
