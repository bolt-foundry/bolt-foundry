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
      id: "2025-01-custom-latest",
      content: "# Latest Post\n\nThis is the latest test post.",
    },
    {
      id: "2024-12-custom-second",
      content: "# Second Post\n\nThis is the second test post.",
    },
    {
      id: "2024-11-custom-third",
      content: "# Third Post\n\nThis is the third test post.",
    },
    {
      id: "2023-10-custom-old",
      content: "# Old Post\n\nThis is an old test post.",
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
    if (entry.name.includes("custom-")) {
      await Deno.remove(`${testDir}/${entry.name}`);
    }
  }
}

Deno.test("GraphQL blogPosts connection should support sortDirection argument", async () => {
  await setupTestPosts();

  try {
    // Query with ASC sort direction
    const ascQuery = `
      query AscendingPosts {
        blogPosts(first: 3, sortDirection: "ASC") {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const ascResult = await executeQuery(ascQuery);
    assertExists(ascResult.data?.blogPosts, "Should have blogPosts field");

    const blogPostsAsc = ascResult.data.blogPosts as { edges: Array<{ node: { id: string } }> };
    const ascEdges = blogPostsAsc.edges;
    assert(ascEdges.length > 0, "Should have edges");

    // Verify ascending order
    for (let i = 1; i < ascEdges.length; i++) {
      const prevId = ascEdges[i - 1].node.id;
      const currId = ascEdges[i].node.id;
      assert(
        prevId < currId,
        `Posts should be in ascending order: ${prevId} < ${currId}`,
      );
    }

    // Query with DESC sort direction
    const descQuery = `
      query DescendingPosts {
        blogPosts(first: 3, sortDirection: "DESC") {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const descResult = await executeQuery(descQuery);
    const blogPostsDesc = descResult.data!.blogPosts as { edges: Array<{ node: { id: string } }> };
    const descEdges = blogPostsDesc.edges;

    // Verify descending order
    for (let i = 1; i < descEdges.length; i++) {
      const prevId = descEdges[i - 1].node.id;
      const currId = descEdges[i].node.id;
      assert(
        prevId > currId,
        `Posts should be in descending order: ${prevId} > ${currId}`,
      );
    }
  } finally {
    await cleanupTestPosts();
  }
});

Deno.test("GraphQL blogPosts connection should support filterByYear argument", async () => {
  await setupTestPosts();

  try {
    // Query for 2024 posts only
    const query = `
      query FilteredByYear {
        blogPosts(first: 10, filterByYear: "2024") {
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

    const blogPostsData = result.data.blogPosts as { edges: Array<{ node: { id: string; content: string } }> };
    const edges = blogPostsData.edges;
    assertEquals(edges.length, 2, "Should have exactly 2 posts from 2024");

    // Verify all posts are from 2024
    for (const edge of edges) {
      assert(
        edge.node.id.startsWith("2024"),
        `Post ${edge.node.id} should be from 2024`,
      );
    }

    // Verify the specific posts
    const ids = edges.map((e: { node: { id: string } }) => e.node.id);
    assert(
      ids.includes("2024-12-custom-second"),
      "Should include December 2024 post",
    );
    assert(
      ids.includes("2024-11-custom-third"),
      "Should include November 2024 post",
    );
  } finally {
    await cleanupTestPosts();
  }
});

Deno.test("GraphQL schema introspection should show custom args", async () => {
  const query = `
    query IntrospectBlogPosts {
      __type(name: "Query") {
        fields {
          name
          args {
            name
            type {
              name
              kind
            }
          }
        }
      }
    }
  `;

  const result = await executeQuery(query);
  assertExists(result.data?.__type, "Should have type introspection");

  const typeInfo = result.data.__type as { fields: Array<{ name: string; args: Array<{ name: string; type: { name?: string; ofType?: { name?: string } } }> }> };
  const queryFields = typeInfo.fields;
  const blogPostsField = queryFields.find((f: { name: string }) =>
    f.name === "blogPosts"
  );
  assertExists(blogPostsField, "Should have blogPosts field");

  const argNames = blogPostsField.args.map((a: { name: string }) => a.name);

  // Should have standard Relay args
  assert(argNames.includes("first"), "Should have first arg");
  assert(argNames.includes("last"), "Should have last arg");
  assert(argNames.includes("after"), "Should have after arg");
  assert(argNames.includes("before"), "Should have before arg");

  // Should have custom args
  assert(argNames.includes("sortDirection"), "Should have sortDirection arg");
  assert(argNames.includes("filterByYear"), "Should have filterByYear arg");
});
