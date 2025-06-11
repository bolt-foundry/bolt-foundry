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

Deno.test("BlogPost should parse TOML front matter", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const content = `+++
author = "Alice Johnson"
publishedAt = 2025-06-10T14:30:00-07:00
updatedAt = 2025-06-11T09:00:00-07:00
tags = ["typescript", "deno", "testing"]
excerpt = "This is a custom excerpt for the blog post."
+++

# Test Post with Front Matter

This is the body content of the blog post. It should be returned without the front matter.

Second paragraph with more content.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-06-test-post.md"),
      content,
    );

    const post = await BlogPost.load("2025-06-test-post");

    assertEquals(post.id, "2025-06-test-post");
    assertEquals(post.author, "Alice Johnson");
    assertEquals(post.publishedAt.toISOString(), "2025-06-10T21:30:00.000Z");
    assertEquals(post.updatedAt?.toISOString(), "2025-06-11T16:00:00.000Z");
    assertEquals(post.tags, ["typescript", "deno", "testing"]);
    assertEquals(post.excerpt, "This is a custom excerpt for the blog post.");
    assertEquals(
      post.content.trim(),
      "# Test Post with Front Matter\n\nThis is the body content of the blog post. It should be returned without the front matter.\n\nSecond paragraph with more content.",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost should handle missing front matter with defaults", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const content = `# Post Without Front Matter

This is the first paragraph which should become the excerpt automatically since no excerpt is provided in front matter.

This is the second paragraph that won't be in the excerpt.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-05-15-no-frontmatter.md"),
      content,
    );

    const post = await BlogPost.load("2025-05-15-no-frontmatter");

    assertEquals(post.id, "2025-05-15-no-frontmatter");
    assertEquals(post.author, undefined); // Frontend will handle missing author
    assertEquals(post.publishedAt.toISOString(), "2025-05-15T00:00:00.000Z"); // Date from filename
    assertEquals(post.updatedAt, undefined); // No updatedAt without front matter
    assertEquals(post.tags, []); // Empty array for tags
    assertEquals(
      post.excerpt,
      "This is the first paragraph which should become the excerpt automatically since no excerpt is provided in front matter.",
    );
    assertEquals(post.content.trim(), content.trim());
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost should handle partial front matter", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const content = `+++
author = "Bob Smith"
tags = ["partial", "test"]
+++

# Partial Front Matter Post

This post has some front matter fields but not all. The publishedAt should come from the filename and excerpt should be auto-generated.

More content here.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-04-20-partial.md"),
      content,
    );

    const post = await BlogPost.load("2025-04-20-partial");

    assertEquals(post.id, "2025-04-20-partial");
    assertEquals(post.author, "Bob Smith");
    assertEquals(post.publishedAt.toISOString(), "2025-04-20T00:00:00.000Z"); // From filename
    assertEquals(post.updatedAt, undefined); // Not provided
    assertEquals(post.tags, ["partial", "test"]);
    assertEquals(
      post.excerpt,
      "This post has some front matter fields but not all. The publishedAt should come from the filename and excerpt should be auto-generated.",
    );
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost should handle long content for excerpt generation", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const longParagraph = Array(200).fill("word").join(" ");
    const content = `+++
author = "Long Writer"
+++

# Long Post

${longParagraph}

Second paragraph.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-03-10-long.md"),
      content,
    );

    const post = await BlogPost.load("2025-03-10-long");

    const excerptWords = post.excerpt.split(/\s+/);
    assertEquals(excerptWords.length <= 150, true);
    assertEquals(post.excerpt.endsWith("..."), true);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost should extract publishedAt from various filename formats", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const testCases = [
      { filename: "2025-06-15-test.md", expected: "2025-06-15T00:00:00.000Z" },
      { filename: "2025-6-5-test.md", expected: "2025-06-05T00:00:00.000Z" }, // Single digit month/day
      {
        filename: "2025-12-25-christmas.md",
        expected: "2025-12-25T00:00:00.000Z",
      },
      {
        filename: "no-date-in-filename.md",
        expected: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
      }, // Today's date
    ];

    for (const { filename, expected } of testCases) {
      await Deno.writeTextFile(
        join(tempDir, "docs", "blog", filename),
        "# Test\n\nContent",
      );

      const id = filename.replace(".md", "");
      const post = await BlogPost.load(id);

      if (filename === "no-date-in-filename.md") {
        // For posts without date in filename, just check it's today
        const postDate = post.publishedAt.toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        assertEquals(postDate, today);
      } else {
        assertEquals(post.publishedAt.toISOString(), expected);
      }
    }
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
