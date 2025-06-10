#! /usr/bin/env -S bff test
import { assertEquals, assertExists } from "@std/assert";
import { graphql } from "graphql";
import { buildTestSchema } from "./TestHelpers.test.ts";
import { createContext } from "../graphqlContext.ts";
import { join } from "@std/path";

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

Deno.test("GraphQL BlogPost should expose front matter fields", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    // Create a post with full TOML front matter
    const content = `+++
author = "Jane Developer"
publishedAt = 2025-06-10T09:30:00-07:00
updatedAt = 2025-06-11T14:15:00-07:00
tags = ["graphql", "testing", "frontend"]
excerpt = "Learn how to test GraphQL endpoints with proper front matter support."
+++

# Testing GraphQL with Front Matter

This is the main content of the blog post that should be returned in the content field without the front matter block.

## Second Section

More content here to ensure the full body is returned.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-06-10-graphql-testing.md"),
      content,
    );

    const query = `
      query GetBlogPost($slug: String!) {
        blogPost(slug: $slug) {
          id
          author
          publishedAt
          updatedAt
          tags
          excerpt
          content
        }
      }
    `;

    const result = await executeQuery(query, {
      slug: "2025-06-10-graphql-testing",
    });

    assertExists(result.data, "Query should return data");
    assertExists(result.data.blogPost, "Should have blogPost");

    const post = result.data.blogPost;
    // @ts-expect-error - Type generation issue
    assertEquals(post.id, "2025-06-10-graphql-testing");
    // @ts-expect-error - Type generation issue
    assertEquals(post.author, "Jane Developer");
    // @ts-expect-error - Type generation issue
    assertEquals(post.publishedAt, "2025-06-10T16:30:00.000Z"); // Converted to UTC
    // @ts-expect-error - Type generation issue
    assertEquals(post.updatedAt, "2025-06-11T21:15:00.000Z"); // Converted to UTC
    // @ts-expect-error - Type generation issue
    assertEquals(post.tags, '["graphql","testing","frontend"]');
    // @ts-expect-error - Type generation issue
    assertEquals(
      post.excerpt,
      "Learn how to test GraphQL endpoints with proper front matter support.",
    );
    // @ts-expect-error - Type generation issue
    assertEquals(
      post.content.trim(),
      `# Testing GraphQL with Front Matter

This is the main content of the blog post that should be returned in the content field without the front matter block.

## Second Section

More content here to ensure the full body is returned.`,
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("GraphQL BlogPost should handle missing front matter", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const content = `# Simple Blog Post

This is a blog post without any front matter. The excerpt should be automatically generated from this first paragraph.

This is the second paragraph that won't be included in the excerpt.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-05-20-simple-post.md"),
      content,
    );

    const query = `
      query GetBlogPost($slug: String!) {
        blogPost(slug: $slug) {
          id
          author
          publishedAt
          updatedAt
          tags
          excerpt
          content
        }
      }
    `;

    const result = await executeQuery(query, {
      slug: "2025-05-20-simple-post",
    });

    const post = result.data?.blogPost;
    assertExists(post);

    // @ts-expect-error - Type generation issue
    assertEquals(post.id, "2025-05-20-simple-post");
    // @ts-expect-error - Type generation issue
    assertEquals(post.author, null); // No author in front matter
    // @ts-expect-error - Type generation issue
    assertEquals(post.publishedAt, "2025-05-20T00:00:00.000Z"); // Extracted from filename
    // @ts-expect-error - Type generation issue
    assertEquals(post.updatedAt, null); // No updatedAt without front matter
    // @ts-expect-error - Type generation issue
    assertEquals(post.tags, "[]"); // Empty array as JSON string
    // @ts-expect-error - Type generation issue
    assertEquals(
      post.excerpt,
      "This is a blog post without any front matter. The excerpt should be automatically generated from this first paragraph.",
    );
    // @ts-expect-error - Type generation issue
    assertEquals(post.content.trim(), content.trim());
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("GraphQL blogPosts connection should include front matter fields", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    // Create multiple posts with different front matter
    const posts = [
      {
        filename: "2025-06-15-newest.md",
        content: `+++
author = "Alice"
tags = ["newest", "test"]
+++

# Newest Post

Content for newest post.`,
      },
      {
        filename: "2025-06-10-middle.md",
        content: `+++
author = "Bob"
tags = ["middle"]
+++

# Middle Post

Content for middle post.`,
      },
      {
        filename: "2025-06-05-oldest.md",
        content: `# Oldest Post

Content for oldest post without front matter.`,
      },
    ];

    for (const post of posts) {
      await Deno.writeTextFile(
        join(tempDir, "docs", "blog", post.filename),
        post.content,
      );
    }

    const query = `
      query GetBlogPosts {
        blogPosts(first: 10) {
          edges {
            node {
              id
              author
              publishedAt
              updatedAt
              tags
              excerpt
            }
          }
        }
      }
    `;

    const result = await executeQuery(query);
    const edges = result.data?.blogPosts?.edges;
    assertExists(edges);

    // @ts-expect-error - Type generation issue
    assertEquals(edges.length, 3);

    // Check they're in reverse chronological order and have correct data
    // @ts-expect-error - Type generation issue
    assertEquals(edges[0].node.id, "2025-06-15-newest");
    // @ts-expect-error - Type generation issue
    assertEquals(edges[0].node.author, "Alice");
    // @ts-expect-error - Type generation issue
    assertEquals(edges[0].node.tags, '["newest","test"]');

    // @ts-expect-error - Type generation issue
    assertEquals(edges[1].node.id, "2025-06-10-middle");
    // @ts-expect-error - Type generation issue
    assertEquals(edges[1].node.author, "Bob");
    // @ts-expect-error - Type generation issue
    assertEquals(edges[1].node.tags, '["middle"]');

    // @ts-expect-error - Type generation issue
    assertEquals(edges[2].node.id, "2025-06-05-oldest");
    // @ts-expect-error - Type generation issue
    assertEquals(edges[2].node.author, null);
    // @ts-expect-error - Type generation issue
    assertEquals(edges[2].node.tags, "[]");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
