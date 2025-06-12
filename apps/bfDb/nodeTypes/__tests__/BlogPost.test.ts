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
      content: `+++
publishedAt = 2024-01-15T10:00:00-07:00
+++

# First Post

This is the first post.`,
    },
    {
      name: "2024-06-middle-post.md",
      content: `+++
publishedAt = 2024-06-15T10:00:00-07:00
+++

# Middle Post

This is a middle post.`,
    },
    {
      name: "2025-01-latest-post.md",
      content: `+++
publishedAt = 2025-01-15T10:00:00-07:00
+++

# Latest Post

This is the latest post.`,
    },
    {
      name: "2023-12-oldest-post.md",
      content: `+++
publishedAt = 2023-12-15T10:00:00-07:00
+++

# Oldest Post

This is the oldest post.`,
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
    assertEquals(post.publishedAt?.toISOString(), "2025-06-10T21:30:00.000Z");
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
    assertEquals(post.publishedAt, undefined); // No publishedAt without front matter
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
    assertEquals(post.publishedAt, undefined); // Not provided in front matter
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

Deno.test("BlogPost should not extract publishedAt from filename without front matter", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const testCases = [
      "2025-06-15-test.md",
      "2025-6-5-test.md",
      "2025-12-25-christmas.md",
      "no-date-in-filename.md",
    ];

    for (const filename of testCases) {
      await Deno.writeTextFile(
        join(tempDir, "docs", "blog", filename),
        "# Test\n\nContent",
      );

      const id = filename.replace(".md", "");
      const post = await BlogPost.load(id);

      // Without explicit publishedAt in front matter, should be undefined
      assertEquals(post.publishedAt, undefined);
    }
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should filter out posts without publishedAt", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    // Create one post with publishedAt and one without
    const publishedPost = `+++
author = "Published Author"
publishedAt = 2025-06-10T10:00:00-07:00
+++

# Published Post

This post should appear in the list.`;

    const draftPost = `+++
author = "Draft Author"
+++

# Draft Post

This post should NOT appear in the list.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-06-10-published.md"),
      publishedPost,
    );

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-06-10-draft.md"),
      draftPost,
    );

    const posts = await BlogPost.listAll();

    // Should only return the published post
    assertEquals(posts.length, 1, "Should only include posts with publishedAt");
    assertEquals(posts[0].id, "2025-06-10-published");
    assertEquals(posts[0].author, "Published Author");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should filter out future-dated posts", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    const now = new Date();
    const past = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow

    // Create posts with different dates
    const pastPost = `+++
author = "Past Author"
publishedAt = ${past.toISOString()}
+++

# Past Post

This post was published yesterday.`;

    const futurePost = `+++
author = "Future Author"
publishedAt = ${future.toISOString()}
+++

# Future Post

This post is scheduled for tomorrow.`;

    const todayPost = `+++
author = "Today Author"
publishedAt = ${now.toISOString()}
+++

# Today Post

This post was published today.`;

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-01-01-past.md"),
      pastPost,
    );

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-12-31-future.md"),
      futurePost,
    );

    await Deno.writeTextFile(
      join(tempDir, "docs", "blog", "2025-06-15-today.md"),
      todayPost,
    );

    const posts = await BlogPost.listAll();

    // Should only return past and today's posts, not future posts
    assertEquals(posts.length, 2, "Should exclude future-dated posts");

    // Verify the future post is correctly excluded
    const futurePostIncluded = posts.some((p) => p.id === "2025-12-31-future");
    assertEquals(
      futurePostIncluded,
      false,
      "Future post is correctly excluded",
    );

    // Past and today posts should be included
    const pastPostIncluded = posts.some((p) => p.id === "2025-01-01-past");
    const todayPostIncluded = posts.some((p) => p.id === "2025-06-15-today");
    assertEquals(pastPostIncluded, true, "Past post should be included");
    assertEquals(todayPostIncluded, true, "Today's post should be included");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BlogPost.listAll() should sort by publishedAt date not filename", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    await Deno.mkdir(join(tempDir, "docs", "blog"), { recursive: true });
    Deno.chdir(tempDir);

    // Create posts where filename date doesn't match publishedAt date
    const posts = [
      {
        // Filename suggests January, but published in December
        name: "2025-01-wrong-date.md",
        content: `+++
author = "Test Author"
publishedAt = 2024-12-01T10:00:00-07:00
+++

# Post with mismatched dates

Filename says January 2025 but published December 2024.`,
      },
      {
        // Filename suggests June, but published in January
        name: "2025-06-another-wrong.md",
        content: `+++
author = "Test Author"
publishedAt = 2025-01-15T10:00:00-07:00
+++

# Another mismatched post

Filename says June 2025 but published January 2025.`,
      },
      {
        // Correct matching dates
        name: "2025-03-correct.md",
        content: `+++
author = "Test Author"
publishedAt = 2025-03-15T10:00:00-07:00
+++

# Correctly dated post

Filename and publishedAt both say March 2025.`,
      },
    ];

    for (const post of posts) {
      await Deno.writeTextFile(
        join(tempDir, "docs", "blog", post.name),
        post.content,
      );
    }

    const postsList = await BlogPost.listAll("DESC");

    // Should be sorted by publishedAt date (DESC): March 2025, Jan 2025, Dec 2024
    assertEquals(
      postsList[0].id,
      "2025-03-correct",
      "March 2025 should be first",
    );
    assertEquals(
      postsList[1].id,
      "2025-06-another-wrong",
      "January 2025 should be second",
    );
    assertEquals(
      postsList[2].id,
      "2025-01-wrong-date",
      "December 2024 should be last",
    );

    // Verify they're actually sorted by publishedAt
    const dates = postsList.map((p) => p.publishedAt?.getTime() || 0);
    for (let i = 1; i < dates.length; i++) {
      assertEquals(
        dates[i - 1] >= dates[i],
        true,
        "Dates should be in descending order",
      );
    }
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
