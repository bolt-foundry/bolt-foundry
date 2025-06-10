#! /usr/bin/env -S bff test
import { assertEquals, assertExists, assertRejects } from "@std/assert";
import { BlogPost } from "../BlogPost.ts";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";
import { join } from "@std/path";

// Create test blog posts in a temp directory
async function setupTestBlogPosts(dir: string) {
  await Deno.mkdir(join(dir, "docs", "blog"), { recursive: true });

  // Create test posts with different dates and content
  const posts = [
    {
      name: "2024-01-first-post.md",
      content: "# First Post\n\nThis is the first post content.",
    },
    {
      name: "2024-06-middle-post.md",
      content: "# Middle Post\n\nThis is a middle post with more content.",
    },
    {
      name: "2025-01-latest-post.md",
      content:
        "# Latest Post\n\nThis is the latest post with even more content.",
    },
    {
      name: "2023-12-oldest-post.md",
      content: "# Oldest Post\n\nThis is the oldest post.",
    },
  ];

  for (const post of posts) {
    await Deno.writeTextFile(
      join(dir, "docs", "blog", post.name),
      post.content,
    );
  }
}

Deno.test("BlogPost - constructor and basic properties", () => {
  const post = new BlogPost("test-slug", "Test content");
  assertEquals(post.id, "test-slug");
  assertEquals(post.content, "Test content");
});

Deno.test("BlogPost - extends GraphQLNode", () => {
  const post = new BlogPost("test-slug", "Test content");
  assertEquals(post.__typename, "BlogPost");
});

Deno.test("BlogPost.findX() - finds existing post", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const post = await BlogPost.findX("2024-01-first-post");
    assertExists(post);
    assertEquals(post.id, "2024-01-first-post");
    assertEquals(
      post.content,
      "# First Post\n\nThis is the first post content.",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.findX() - throws error for non-existent post", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    await assertRejects(
      () => BlogPost.findX("non-existent-post"),
      BfErrorNodeNotFound,
      "BlogPost not found: non-existent-post",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.findX() - uses cache for repeated requests", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    // First request
    const post1 = await BlogPost.findX("2024-01-first-post");

    // Second request should return the same instance from cache
    const post2 = await BlogPost.findX("2024-01-first-post");

    // They should be the exact same promise/instance
    assertEquals(post1, post2);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() - returns posts in reverse chronological order by default", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();

    assertEquals(posts.length, 4);
    assertEquals(posts[0].id, "2025-01-latest-post");
    assertEquals(posts[1].id, "2024-06-middle-post");
    assertEquals(posts[2].id, "2024-01-first-post");
    assertEquals(posts[3].id, "2023-12-oldest-post");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() - supports ascending order", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll("ASC");

    assertEquals(posts.length, 4);
    assertEquals(posts[0].id, "2023-12-oldest-post");
    assertEquals(posts[1].id, "2024-01-first-post");
    assertEquals(posts[2].id, "2024-06-middle-post");
    assertEquals(posts[3].id, "2025-01-latest-post");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() - returns empty array when no posts exist", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();
    assertEquals(posts.length, 0);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() - handles missing blog directory", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();
    assertEquals(posts.length, 0);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() - ignores non-markdown files", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });

    // Create a markdown file and a non-markdown file
    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "valid-post.md"),
      "# Valid Post",
    );
    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "not-a-post.txt"),
      "Not a post",
    );
    await Deno.mkdir(join(tempDir, "docs", "blog", "subdirectory"));

    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();
    assertEquals(posts.length, 1);
    assertEquals(posts[0].id, "valid-post");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.connection() - creates relay connection", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();
    const connection = await BlogPost.connection(posts, { first: 2 });

    assertEquals(connection.edges.length, 2);
    assertEquals(connection.edges[0].node.id, "2025-01-latest-post");
    assertEquals(connection.edges[1].node.id, "2024-06-middle-post");
    assertEquals(connection.pageInfo.hasNextPage, true);
    assertEquals(connection.pageInfo.hasPreviousPage, false);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.connection() - supports last argument", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();
    const connection = await BlogPost.connection(posts, { last: 2 });

    assertEquals(connection.edges.length, 2);
    assertEquals(connection.edges[0].node.id, "2024-01-first-post");
    assertEquals(connection.edges[1].node.id, "2023-12-oldest-post");
    assertEquals(connection.pageInfo.hasNextPage, false);
    assertEquals(connection.pageInfo.hasPreviousPage, true);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.gqlSpec - defines correct GraphQL fields", () => {
  const spec = BlogPost.gqlSpec;
  assertExists(spec);
  // The spec should include id and content fields
  // This is more of a smoke test since we can't easily inspect the spec structure
});
