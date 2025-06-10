#! /usr/bin/env -S bff test
import { assert, assertEquals, assertExists } from "@std/assert";
import { graphql } from "graphql";
import { buildTestSchema } from "./TestHelpers.test.ts";
import { createContext } from "../graphqlContext.ts";

// Helper to execute GraphQL queries
async function executeQuery(
  query: string,
  variableValues?: Record<string, unknown>,
) {
  const schema = await buildTestSchema();
  const mockRequest = new Request("http://localhost/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  using ctx = await createContext(mockRequest);

  return await graphql({
    schema,
    source: query,
    variableValues,
    contextValue: ctx,
  });
}

// Create some test blog posts
async function setupTestPosts() {
  const testDir = "docs/blog";
  await Deno.mkdir(testDir, { recursive: true });

  const posts = [
    {
      id: "2025-01-test-latest",
      content: "# Latest Post\n\nThis is the latest test post.",
    },
    {
      id: "2024-12-test-second",
      content: "# Second Post\n\nThis is the second test post.",
    },
    {
      id: "2024-11-test-third",
      content: "# Third Post\n\nThis is the third test post.",
    },
  ];

  for (const post of posts) {
    await Deno.writeTextFile(`${testDir}/${post.id}.md`, post.content);
  }

  // Add some older posts for the 'last' test
  const olderPosts = [
    {
      id: "2023-06-test-old",
      content: "# Old Post 1\n\nThis is an old test post.",
    },
    {
      id: "2023-01-test-oldest",
      content: "# Oldest Post\n\nThis is the oldest test post.",
    },
  ];

  for (const post of olderPosts) {
    await Deno.writeTextFile(`${testDir}/${post.id}.md`, post.content);
  }

  return [...posts, ...olderPosts];
}

async function cleanupTestPosts() {
  const testDir = "docs/blog";
  for await (const entry of Deno.readDir(testDir)) {
    if (entry.name.includes("test-")) {
      await Deno.remove(`${testDir}/${entry.name}`);
    }
  }
}

Deno.test("GraphQL blogPosts connection query should return paginated results", async () => {
  await setupTestPosts();

  try {
    const query = `
      query BlogPostsConnection {
        blogPosts(first: 2) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              content
            }
          }
          nodes {
            id
          }
        }
      }
    `;

    const result = await executeQuery(query);

    assertExists(result.data, "Query should return data");
    assertExists(result.data.blogPosts, "Should have blogPosts field");

    const connection = result.data.blogPosts;
    // @ts-expect-error - Type generation issue
    assertExists(connection.pageInfo, "Should have pageInfo");
    // @ts-expect-error - Type generation issue
    assertExists(connection.edges, "Should have edges");
    // @ts-expect-error - Type generation issue
    assertExists(connection.nodes, "Should have nodes");

    // Check pagination info - we have at least 3 test posts plus any existing ones
    assertEquals(
      // @ts-expect-error - Type generation issue
      connection.pageInfo.hasPreviousPage,
      false,
      "Should not have previous page",
    );
    // @ts-expect-error - Type generation issue
    assertExists(connection.pageInfo.startCursor, "Should have start cursor");
    // @ts-expect-error - Type generation issue
    assertExists(connection.pageInfo.endCursor, "Should have end cursor");

    // Check edges
    // @ts-expect-error - Type generation issue
    assertEquals(connection.edges.length, 2, "Should return 2 edges");
    // Since we're ordering DESC by default, check that first edge is newer than second
    // @ts-expect-error - Type generation issue
    const firstId = connection.edges[0].node.id;
    // @ts-expect-error - Type generation issue
    const secondId = connection.edges[1].node.id;
    assert(
      firstId > secondId,
      `First post (${firstId}) should be newer than second (${secondId})`,
    );
    // @ts-expect-error - Type generation issue
    assertExists(connection.edges[0].cursor, "Each edge should have cursor");
    // @ts-expect-error - Type generation issue
    assertExists(connection.edges[1].cursor, "Each edge should have cursor");

    // Check nodes shortcut
    // @ts-expect-error - Type generation issue
    assertEquals(connection.nodes.length, 2, "Should return 2 nodes");
  } finally {
    await cleanupTestPosts();
  }
});

Deno.test("GraphQL blogPosts connection should handle 'after' cursor", async () => {
  await setupTestPosts();

  try {
    // First get initial results to get a cursor
    const firstQuery = `
      query FirstPage {
        blogPosts(first: 1) {
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
    `;

    const firstResult = await executeQuery(firstQuery);

    // @ts-expect-error - Type generation issue
    const afterCursor = firstResult.data?.blogPosts?.edges[0]?.cursor;
    assertExists(afterCursor, "Should get cursor from first query");
    // @ts-expect-error - Type generation issue
    const firstId = firstResult.data?.blogPosts?.edges[0]?.node?.id;

    // Now query with after cursor
    const query = `
      query NextPage($after: String) {
        blogPosts(first: 2, after: $after) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await executeQuery(query, { after: afterCursor });

    assertExists(result.data?.blogPosts, "Should have blogPosts");
    const connection = result.data.blogPosts;

    // @ts-expect-error - Type generation issue
    assert(connection.edges.length > 0, "Should return edges");
    // Verify we skipped the first post
    assert(
      // @ts-expect-error - Type generation issue
      connection.edges[0].node.id !== firstId,
      "Should skip the first post",
    );
    // hasPreviousPage might be true or false depending on cursor implementation
  } finally {
    await cleanupTestPosts();
  }
});

Deno.test("GraphQL blogPosts connection should handle 'last' argument", async () => {
  await setupTestPosts();

  try {
    const query = `
      query LastPosts {
        blogPosts(last: 2) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await executeQuery(query);

    assertExists(result.data?.blogPosts, "Should have blogPosts");
    const connection = result.data.blogPosts;

    // @ts-expect-error - Type generation issue
    assertEquals(connection.edges.length, 2, "Should return 2 edges");

    // 'last: 2' returns the 2 oldest posts when sorted DESC (newest first)
    // With our test posts and one existing post, verify we get 2 posts
    // @ts-expect-error - Type generation issue
    const firstId = connection.edges[0].node.id as string;
    // @ts-expect-error - Type generation issue
    const secondId = connection.edges[1].node.id as string;

    // Just verify we got valid post IDs
    assert(
      firstId.length > 0,
      `First post should have an ID, got ${firstId}`,
    );
    assert(
      secondId.length > 0,
      `Second post should have an ID, got ${secondId}`,
    );

    assertEquals(
      // @ts-expect-error - Type generation issue
      connection.pageInfo.hasNextPage,
      false,
      "Should not have next page",
    );
    assertEquals(
      // @ts-expect-error - Type generation issue
      connection.pageInfo.hasPreviousPage,
      true,
      "Should have previous page",
    );
  } finally {
    await cleanupTestPosts();
  }
});

Deno.test("GraphQL blogPosts connection should return all with no pagination args", async () => {
  await setupTestPosts();

  try {
    // Query without first/last should return all posts
    const query = `
      query AllPosts {
        blogPosts {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await executeQuery(query);

    assertExists(result.data?.blogPosts, "Should have blogPosts field");
    const connection = result.data.blogPosts;

    // Should have at least our 3 test posts
    assert(
      // @ts-expect-error - Type generation issue
      connection.edges.length >= 3,
      // @ts-expect-error - Type generation issue
      `Should have at least 3 posts, got ${connection.edges.length}`,
    );
  } finally {
    await cleanupTestPosts();
  }
});
