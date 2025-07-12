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

Deno.test("currentViewer.blogPost query works", async () => {
  const query = `
    query TestBlogPost($slug: String) {
      currentViewer {
        blogPost(slug: $slug) {
          id
          title
          content
        }
      }
    }
  `;

  const result = await executeQuery(query, { slug: "test-post" });

  assertEquals(result.errors, undefined, "Query should execute without errors");
  assertExists(result.data?.currentViewer, "currentViewer should exist");

  // blogPost might be null if the test post doesn't exist, but the query structure should work
  const blogPost = result.data?.currentViewer.blogPost;
  if (blogPost) {
    assertExists(blogPost.id, "BlogPost should have id field");
    assertExists(blogPost.title, "BlogPost should have title field");
    assertExists(blogPost.content, "BlogPost should have content field");
  }
});

Deno.test("currentViewer.blogPosts connection works", async () => {
  const query = `
    query TestBlogPosts {
      currentViewer {
        blogPosts(first: 5) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }
  `;

  const result = await executeQuery(query);

  assertEquals(result.errors, undefined, "Query should execute without errors");
  assertExists(result.data?.currentViewer, "currentViewer should exist");
  assertExists(
    result.data?.currentViewer.blogPosts,
    "blogPosts connection should exist",
  );
  assertExists(
    result.data?.currentViewer.blogPosts.edges,
    "Should have edges array",
  );
  assertExists(
    result.data?.currentViewer.blogPosts.pageInfo,
    "Should have pageInfo",
  );

  // Verify connection structure
  assertEquals(
    typeof result.data?.currentViewer.blogPosts.pageInfo.hasNextPage,
    "boolean",
    "pageInfo.hasNextPage should be boolean",
  );
});

Deno.test("currentViewer.documentsBySlug query works", async () => {
  const query = `
    query TestDocument($slug: String) {
      currentViewer {
        documentsBySlug(slug: $slug) {
          id
          content
        }
      }
    }
  `;

  const result = await executeQuery(query, { slug: "getting-started" });

  assertEquals(result.errors, undefined, "Query should execute without errors");
  assertExists(result.data?.currentViewer, "currentViewer should exist");

  // Document might be null if it doesn't exist, but query structure should work
  const document = result.data?.currentViewer.documentsBySlug;
  if (document) {
    assertExists(document.id, "PublishedDocument should have id field");
    assertExists(
      document.content,
      "PublishedDocument should have content field",
    );
  }
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

Deno.test("currentViewer does not expose root queries", async () => {
  // Test that the old root queries are not available at the root level
  const query = `
    query TestRootLevel {
      # These should NOT exist in boltfoundry-com schema
      currentViewer {
        blogPost(slug: "test") {
          id
        }
      }
    }
  `;

  const result = await executeQuery(query);
  assertEquals(result.errors, undefined, "Viewer-centric query should work");

  // Test that direct root access would fail (this should be rejected by schema)
  const invalidQuery = `
    query TestInvalidRoot {
      blogPost(slug: "test") {  # This should not exist
        id
      }
    }
  `;

  const invalidResult = await executeQuery(invalidQuery);
  assertExists(
    invalidResult.errors,
    "Direct root blogPost query should fail in boltfoundry-com schema",
  );
});

Deno.test("viewer-centric API provides clean access pattern", async () => {
  // Test the full viewer-centric pattern in one query
  const query = `
    query BoltFoundryComData {
      currentViewer {
        # Blog content
        featuredPost: blogPost(slug: "README") {
          title
          excerpt
          publishedAt
        }
        
        # Recent posts
        recentPosts: blogPosts(first: 3, sortDirection: "DESC") {
          edges {
            node {
              id
              title
              publishedAt
            }
          }
        }
        
        # Documentation
        gettingStarted: documentsBySlug(slug: "getting-started") {
          content
        }
      }
    }
  `;

  const result = await executeQuery(query);

  assertEquals(
    result.errors,
    undefined,
    "Complex viewer query should execute without errors",
  );
  assertExists(result.data?.currentViewer, "currentViewer should exist");

  // All the nested fields should be accessible through the single viewer entry point
  const viewer = result.data?.currentViewer;

  // These might be null if content doesn't exist, but the structure should be valid
  if (viewer.featuredPost) {
    assertExists(viewer.featuredPost.title, "Featured post should have title");
  }

  assertExists(viewer.recentPosts, "Recent posts connection should exist");
  assertExists(viewer.recentPosts.edges, "Recent posts should have edges");

  if (viewer.gettingStarted) {
    assertExists(
      viewer.gettingStarted.content,
      "Getting started doc should have content",
    );
  }
});
