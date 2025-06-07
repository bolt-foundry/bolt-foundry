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

  return posts;
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
    assertExists(connection.pageInfo, "Should have pageInfo");
    assertExists(connection.edges, "Should have edges");
    assertExists(connection.nodes, "Should have nodes");

    // Check pagination info - we have at least 3 test posts plus any existing ones
    assertEquals(
      connection.pageInfo.hasPreviousPage,
      false,
      "Should not have previous page",
    );
    assertExists(connection.pageInfo.startCursor, "Should have start cursor");
    assertExists(connection.pageInfo.endCursor, "Should have end cursor");

    // Check edges
    assertEquals(connection.edges.length, 2, "Should return 2 edges");
    // Since we're ordering DESC by default, check that first edge is newer than second
    const firstId = connection.edges[0].node.id;
    const secondId = connection.edges[1].node.id;
    assert(
      firstId > secondId,
      `First post (${firstId}) should be newer than second (${secondId})`,
    );
    assertExists(connection.edges[0].cursor, "Each edge should have cursor");
    assertExists(connection.edges[1].cursor, "Each edge should have cursor");

    // Check nodes shortcut
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

    const afterCursor = firstResult.data?.blogPosts?.edges[0]?.cursor;
    assertExists(afterCursor, "Should get cursor from first query");
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

    assert(connection.edges.length > 0, "Should return edges");
    // Verify we skipped the first post
    assert(
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

    assertEquals(connection.edges.length, 2, "Should return 2 edges");
    assertEquals(
      connection.edges[0].node.id,
      "2024-12-test-second",
      "Should be second post",
    );
    assertEquals(
      connection.edges[1].node.id,
      "2024-11-test-third",
      "Should be third post",
    );
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
      connection.edges.length >= 3,
      `Should have at least 3 posts, got ${connection.edges.length}`,
    );
  } finally {
    await cleanupTestPosts();
  }
});
