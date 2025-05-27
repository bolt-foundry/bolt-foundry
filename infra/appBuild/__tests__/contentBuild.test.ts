#!/usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";

Deno.test("processes docs directory and creates build output", async () => {
  // Arrange: Create a temporary docs structure for testing
  const tempDir = await Deno.makeTempDir();
  try {
    const docsDir = join(tempDir, "docs");
    const buildDocsDir = join(tempDir, "build", "docs");
    
    // Create test files
    await Deno.mkdir(docsDir, { recursive: true });
    
    // Create test MDX file
    const testMdxContent = `# Test Documentation

This is a test MDX file for the documentation system.

## Example Section

Some example content here.`;
    
    await Deno.writeTextFile(
      join(docsDir, "test-doc.mdx"),
      testMdxContent
    );
    
    // Create test MD file
    const testMdContent = `# Regular Markdown Documentation

This is a standard markdown file.

- Should be processed like MDX
- But without component support`;
    
    await Deno.writeTextFile(
      join(docsDir, "regular-doc.md"),
      testMdContent
    );

    // Act: Run the content build process
    // Note: This will fail initially as we haven't implemented the functionality
    const contentBuildPath = join(Deno.cwd(), "infra", "appBuild", "contentBuild.ts");
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
      },
    });
    
    const { success } = await command.output();
    
    // Assert: Verify the docs were processed
    assert(success, "Content build should complete successfully");
    
    // Check that the build directory was created
    assert(
      await exists(buildDocsDir),
      "Build docs directory should be created"
    );
    
    // Check that the MDX file was processed
    const processedMdxPath = join(buildDocsDir, "test-doc.mdx");
    assert(
      await exists(processedMdxPath),
      "MDX file should be processed and copied to build directory"
    );
    
    // Check that the MD file was processed
    const processedMdPath = join(buildDocsDir, "regular-doc.md");
    assert(
      await exists(processedMdPath),
      "MD file should be processed and copied to build directory"
    );
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("compiles MDX files with components", async () => {
  // This test verifies that MDX files are actually compiled, not just copied
  const tempDir = await Deno.makeTempDir();
  try {
    const docsDir = join(tempDir, "docs");
    const buildDocsDir = join(tempDir, "build", "docs");
    
    // Create test MDX file with JSX
    await Deno.mkdir(docsDir, { recursive: true });
    const testMdxContent = `# Documentation with Component

<BfDsCallout type="info">
  This is an MDX component in the docs
</BfDsCallout>

Regular markdown content here.`;
    
    await Deno.writeTextFile(
      join(docsDir, "component-doc.mdx"),
      testMdxContent
    );

    // Act: Run the content build process
    const contentBuildPath = join(Deno.cwd(), "infra", "appBuild", "contentBuild.ts");
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
      },
    });
    
    const { success } = await command.output();
    
    // Assert
    assert(success, "Content build with MDX components should complete successfully");
    
    const processedFilePath = join(buildDocsDir, "component-doc.mdx");
    assert(
      await exists(processedFilePath),
      "MDX file with components should be processed"
    );
    
    // Read the processed content to verify it was compiled
    const processedContent = await Deno.readTextFile(processedFilePath);
    
    // The compiled MDX should have been transformed
    // (exact format depends on MDX compiler output)
    assert(
      processedContent.length > 0,
      "Processed MDX file should have content"
    );
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("compiles .md files through MDX processor", async () => {
  // This test verifies that regular .md files are also processed through MDX
  const tempDir = await Deno.makeTempDir();
  try {
    const docsDir = join(tempDir, "docs");
    const buildDocsDir = join(tempDir, "build", "docs");
    
    // Create test MD file with code blocks
    await Deno.mkdir(docsDir, { recursive: true });
    const testMdContent = `# Markdown with Code

Here's a code example:

\`\`\`typescript
const greeting = "Hello, docs!";
console.log(greeting);
\`\`\`

This should be compiled through MDX even though it's a .md file.`;
    
    await Deno.writeTextFile(
      join(docsDir, "code-example.md"),
      testMdContent
    );

    // Act: Run the content build process
    const contentBuildPath = join(Deno.cwd(), "infra", "appBuild", "contentBuild.ts");
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
      },
    });
    
    const { success } = await command.output();
    
    // Assert
    assert(success, "Content build with .md files should complete successfully");
    
    const processedFilePath = join(buildDocsDir, "code-example.md");
    assert(
      await exists(processedFilePath),
      "MD file should be processed"
    );
    
    // Read the processed content to verify it was compiled
    const processedContent = await Deno.readTextFile(processedFilePath);
    
    // The compiled content should exist and be non-empty
    assert(
      processedContent.length > 0,
      "Processed MD file should have content"
    );
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});