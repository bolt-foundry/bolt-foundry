#! /usr/bin/env -S bff test
import { assertEquals, assertExists } from "@std/assert";
import {
  type BlogFrontMatter,
  extractToml,
  generateExcerpt,
  safeExtractFrontmatter,
} from "../contentUtils.ts";

Deno.test("extractToml - parses TOML front matter", () => {
  const content = `+++
title = "Test Blog Post"
author = "John Doe"
publishedAt = 2025-06-10T14:30:00-07:00
updatedAt = 2025-06-11T10:00:00-07:00
tags = ["testing", "toml", "deno"]
excerpt = "This is a test excerpt"
+++

# Test Blog Post

This is the body content of the blog post.`;

  const result = extractToml<BlogFrontMatter>(content);

  assertExists(result.attrs);
  assertEquals(result.attrs.title, "Test Blog Post");
  assertEquals(result.attrs.author, "John Doe");
  assertEquals(result.attrs.publishedAt, new Date("2025-06-10T14:30:00-07:00"));
  assertEquals(result.attrs.updatedAt, new Date("2025-06-11T10:00:00-07:00"));
  assertEquals(result.attrs.tags, ["testing", "toml", "deno"]);
  assertEquals(result.attrs.excerpt, "This is a test excerpt");
  assertEquals(
    result.body.trim(),
    "# Test Blog Post\n\nThis is the body content of the blog post.",
  );
});

Deno.test("safeExtractFrontmatter - handles TOML format", () => {
  const content = `+++
author = "Jane Smith"
tags = ["partial"]
+++

# Partial Front Matter

Some content.`;

  const result = safeExtractFrontmatter(content, {}, "toml");

  assertEquals(result.attrs.author, "Jane Smith");
  assertEquals(result.attrs.tags, ["partial"]);
  assertEquals(result.body.trim(), "# Partial Front Matter\n\nSome content.");
});

Deno.test("safeExtractFrontmatter - handles missing TOML front matter", () => {
  const content = `# Blog Post Without Front Matter

This is just a regular markdown file.`;

  const result = safeExtractFrontmatter(content, {}, "toml");

  assertEquals(Object.keys(result.attrs).length, 0);
  assertEquals(result.body.trim(), content.trim());
});

Deno.test("safeExtractFrontmatter - handles empty TOML front matter", () => {
  const content = `+++
+++

# Blog Post

Content here.`;

  const result = safeExtractFrontmatter(content, {}, "toml");

  assertEquals(Object.keys(result.attrs).length, 0);
  assertEquals(result.body.trim(), "# Blog Post\n\nContent here.");
});

Deno.test("generateExcerpt - creates excerpt from first paragraph", () => {
  const content = `# Blog Title

This is the first paragraph that should become the excerpt. It contains some interesting information about the topic.

This is the second paragraph that should not be included in the excerpt.

And here's a third paragraph.`;

  const excerpt = generateExcerpt(content);

  assertEquals(
    excerpt,
    "This is the first paragraph that should become the excerpt. It contains some interesting information about the topic.",
  );
});

Deno.test("generateExcerpt - limits to 150 words", () => {
  const longParagraph =
    `This is a very long first paragraph that contains way more than 150 words. ` +
    `It goes on and on with lots of detailed information about various topics. ` +
    `The purpose is to test that our excerpt generation properly truncates at 150 words. ` +
    `We need to make sure it doesn't just cut off in the middle of a word. ` +
    `Instead, it should find a natural breaking point at a word boundary. ` +
    `This paragraph continues with more and more text to ensure we exceed the limit. ` +
    `Here's some additional content to make it even longer. ` +
    `And more text to really push past that 150 word limit. ` +
    `We're adding sentence after sentence to make this as long as possible. ` +
    `The excerpt function should handle this gracefully and return exactly 150 words. ` +
    `Or fewer if it needs to break at a word boundary. ` +
    `Let's add even more content here to be absolutely certain we're over the limit. ` +
    `This should definitely be more than 150 words by now. ` +
    `In fact, it's probably closer to 200 or more words at this point.`;

  const content = `# Title\n\n${longParagraph}\n\nSecond paragraph.`;
  const excerpt = generateExcerpt(content);

  const wordCount = excerpt.split(/\s+/).length;
  assertEquals(wordCount <= 150, true);
  assertEquals(excerpt.endsWith("..."), true);
});

Deno.test("generateExcerpt - handles content without paragraphs", () => {
  const content = `# Just a Title`;

  const excerpt = generateExcerpt(content);

  assertEquals(excerpt, "");
});

Deno.test("generateExcerpt - skips headers to find first paragraph", () => {
  const content = `# Main Title

## Subtitle

### Another Header

This is the actual first paragraph of content.

More content here.`;

  const excerpt = generateExcerpt(content);

  assertEquals(excerpt, "This is the actual first paragraph of content.");
});

Deno.test("generateExcerpt - handles markdown formatting", () => {
  const content = `# Title

This paragraph has **bold text**, *italic text*, and [a link](https://example.com). It also has \`inline code\`.

Another paragraph.`;

  const excerpt = generateExcerpt(content);

  // Should preserve markdown formatting in excerpt
  assertEquals(
    excerpt,
    "This paragraph has **bold text**, *italic text*, and [a link](https://example.com). It also has `inline code`.",
  );
});
