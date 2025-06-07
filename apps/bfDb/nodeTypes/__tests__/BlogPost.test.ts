#! /usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import { BlogPost } from "../BlogPost.ts";
import { join } from "@std/path";

// Create test blog posts in a temp directory
async function setupTestBlogPosts(dir: string) {
  await Deno.mkdir(join(dir, "docs", "blog"), { recursive: true });

  // Create test posts with different dates
  const posts = [
    {
      name: "2024-01-first-post.md",
      content: "# First Post\n\nThis is the first post.",
    },
    {
      name: "2024-06-middle-post.md",
      content: "# Middle Post\n\nThis is a middle post.",
    },
    {
      name: "2025-01-latest-post.md",
      content: "# Latest Post\n\nThis is the latest post.",
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

Deno.test("BlogPost.listAll() should return posts in reverse chronological order by default", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();

    assertEquals(posts.length, 4, "Should find all 4 posts");

    // Check order - newest first
    assertEquals(posts[0].id, "2025-01-latest-post");
    assertEquals(posts[1].id, "2024-06-middle-post");
    assertEquals(posts[2].id, "2024-01-first-post");
    assertEquals(posts[3].id, "2023-12-oldest-post");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should support ascending order", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await setupTestBlogPosts(tempDir);
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll("ASC");

    assertEquals(posts.length, 4, "Should find all 4 posts");

    // Check order - oldest first
    assertEquals(posts[0].id, "2023-12-oldest-post");
    assertEquals(posts[1].id, "2024-01-first-post");
    assertEquals(posts[2].id, "2024-06-middle-post");
    assertEquals(posts[3].id, "2025-01-latest-post");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should return empty array when no posts exist", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    // Create docs/blog directory but no posts
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();

    assertEquals(posts.length, 0, "Should return empty array");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should handle missing blog directory", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    // Don't create docs/blog directory
    Deno.chdir(tempDir);

    const posts = await BlogPost.listAll();

    assertEquals(
      posts.length,
      0,
      "Should return empty array when directory doesn't exist",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
