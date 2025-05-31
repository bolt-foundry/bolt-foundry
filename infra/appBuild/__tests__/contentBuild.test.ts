#!/usr/bin/env -S bff test

import { assert, assertEquals, assertExists } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import { buildDocs, processDocsContent } from "../contentBuild.ts";

// Test processing a single markdown file
Deno.test("processDocsContent - converts markdown to MDX module", async (t) => {
  const testContent = `# Test Document

This is a test document with some **bold** text.`;

  await t.step("should compile markdown to JavaScript module", async () => {
    const result = await processDocsContent(testContent);

    // Should return valid JavaScript
    assertExists(result);
    assertEquals(typeof result, "string");

    // Should contain MDX compiled output markers
    assert(result.includes("export"), "Should have exports");
    assert(result.includes("function"), "Should have function definitions");
  });

  await t.step("should handle MDX with frontmatter", async () => {
    const contentWithFrontmatter = `---
title: Test Doc
description: A test document
---

# Test Document

Content goes here.`;

    const result = await processDocsContent(contentWithFrontmatter);
    assertExists(result);
    assertEquals(typeof result, "string");
  });
});

// Test the full build process
Deno.test("buildDocs - processes all docs from /docs to /build/docs", async (t) => {
  // Clean up any existing build directory
  const buildDir = join(Deno.cwd(), "build", "docs");
  if (await exists(buildDir)) {
    await Deno.remove(buildDir, { recursive: true });
  }

  await t.step("should create build/docs directory", async () => {
    await buildDocs();

    const buildDirExists = await exists(buildDir);
    assertEquals(buildDirExists, true, "build/docs directory should exist");
  });

  await t.step("should process markdown files from /docs", async () => {
    // This assumes we have at least README.md in /docs
    await buildDocs();

    const readmePath = join(buildDir, "README.js");
    const readmeExists = await exists(readmePath);
    assertEquals(readmeExists, true, "README.js should be generated");
  });

  await t.step("should preserve directory structure", async () => {
    // If there are subdirectories in /docs, they should be preserved
    await buildDocs();

    // Check that the build completed without errors
    // More specific checks would depend on actual /docs structure
    const buildDirExists = await exists(buildDir);
    assertEquals(buildDirExists, true);
  });

  // Cleanup after test
  await t.step("cleanup", async () => {
    if (await exists(buildDir)) {
      await Deno.remove(buildDir, { recursive: true });
    }
  });
});

// Test error handling
Deno.test("processDocsContent - handles invalid content gracefully", async (t) => {
  await t.step("should handle empty content", async () => {
    const result = await processDocsContent("");
    assertExists(result);
  });

  await t.step("should handle malformed MDX", async () => {
    const malformedContent = `# Title

{{{ this is not valid MDX }}}

Some content`;

    // Should not throw, but log error
    const result = await processDocsContent(malformedContent);
    assertExists(result);
  });
});
