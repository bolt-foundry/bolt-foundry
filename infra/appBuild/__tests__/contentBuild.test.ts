#!/usr/bin/env -S bff test

import { assert } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";

Deno.test("processes docs directory and creates build output", async () => {
  // Arrange: Create a temporary docs structure for testing
  const tempDir = await Deno.makeTempDir();
  try {
    const docsDir = join(tempDir, "docs");
    const buildDocsDir = join(tempDir, "build", "docs");
    const generatedDir = join(tempDir, "generated");

    // Create test files
    await Deno.mkdir(docsDir, { recursive: true });

    // Create test MDX file
    const testMdxContent = `# Test Documentation

This is a test MDX file for the documentation system.

## Example Section

Some example content here.`;

    await Deno.writeTextFile(
      join(docsDir, "test-doc.mdx"),
      testMdxContent,
    );

    // Create test MD file
    const testMdContent = `# Regular Markdown Documentation

This is a standard markdown file.

- Should be processed like MDX
- But without component support`;

    await Deno.writeTextFile(
      join(docsDir, "regular-doc.md"),
      testMdContent,
    );

    // Act: Run the content build process
    // Note: This will fail initially as we haven't implemented the functionality
    const contentBuildPath = join(
      Deno.cwd(),
      "infra",
      "appBuild",
      "contentBuild.ts",
    );
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
        GENERATED_DIR: generatedDir,
      },
    });

    const { success } = await command.output();

    // Assert: Verify the docs were processed
    assert(success, "Content build should complete successfully");

    // Check that the build directory was created
    assert(
      await exists(buildDocsDir),
      "Build docs directory should be created",
    );

    // Check that the MDX file was compiled to JS
    const processedMdxPath = join(buildDocsDir, "test-doc.js");
    assert(
      await exists(processedMdxPath),
      "MDX file should be compiled to JS in build directory",
    );

    // Check that the MD file was compiled to JS
    const processedMdPath = join(buildDocsDir, "regular-doc.js");
    assert(
      await exists(processedMdPath),
      "MD file should be compiled to JS in build directory",
    );
    
    // Check that import map was generated
    const importMapPath = join(generatedDir, "docsImportMap.ts");
    assert(
      await exists(importMapPath),
      "Import map should be generated",
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
      testMdxContent,
    );

    // Act: Run the content build process
    const contentBuildPath = join(
      Deno.cwd(),
      "infra",
      "appBuild",
      "contentBuild.ts",
    );
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
      },
    });

    const { success } = await command.output();

    // Assert
    assert(
      success,
      "Content build with MDX components should complete successfully",
    );

    const processedFilePath = join(buildDocsDir, "component-doc.js");
    assert(
      await exists(processedFilePath),
      "MDX file with components should be compiled to JS",
    );

    // Read the processed content to verify it was compiled to a module
    const processedContent = await Deno.readTextFile(processedFilePath);

    // The compiled MDX should be a valid ES module
    assert(
      processedContent.length > 0,
      "Processed MDX file should have content",
    );
    assert(
      processedContent.includes("export") || processedContent.includes("function"),
      "Compiled MDX should contain module code",
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
      testMdContent,
    );

    // Act: Run the content build process
    const contentBuildPath = join(
      Deno.cwd(),
      "infra",
      "appBuild",
      "contentBuild.ts",
    );
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: join(tempDir, "build"),
      },
    });

    const { success } = await command.output();

    // Assert
    assert(
      success,
      "Content build with .md files should complete successfully",
    );

    const processedFilePath = join(buildDocsDir, "code-example.js");
    assert(
      await exists(processedFilePath),
      "MD file should be compiled to JS",
    );

    // Read the processed content to verify it was compiled
    const processedContent = await Deno.readTextFile(processedFilePath);

    // The compiled content should exist and be non-empty
    assert(
      processedContent.length > 0,
      "Processed MD file should have content",
    );
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("generates import map for docs directory", async () => {
  // This test verifies that the content build generates a proper import map
  // for all MDX files in the docs directory with lazy loading support
  const tempDir = await Deno.makeTempDir();
  try {
    const docsDir = join(tempDir, "docs");
    const buildDir = join(tempDir, "build");
    const generatedDir = join(tempDir, "apps", "boltFoundry", "__generated__");

    // Create test MDX files
    await Deno.mkdir(docsDir, { recursive: true });
    await Deno.mkdir(generatedDir, { recursive: true });

    const quickstartContent = `# Quickstart
    
This is the quickstart guide.`;

    const gettingStartedContent = `# Getting Started

Learn the basics here.`;

    await Deno.writeTextFile(
      join(docsDir, "quickstart.mdx"),
      quickstartContent,
    );

    await Deno.writeTextFile(
      join(docsDir, "getting-started.mdx"),
      gettingStartedContent,
    );

    // Act: Run the content build process
    const contentBuildPath = join(
      Deno.cwd(),
      "infra",
      "appBuild",
      "contentBuild.ts",
    );
    const command = new Deno.Command("deno", {
      args: ["run", "-A", contentBuildPath],
      env: {
        DOCS_DIR: docsDir,
        BUILD_DIR: buildDir,
        GENERATED_DIR: generatedDir,
      },
    });

    const { success } = await command.output();

    // Assert: Build succeeds
    assert(
      success,
      "Content build with import map generation should complete successfully",
    );

    // Check that the import map was generated
    const importMapPath = join(generatedDir, "docsImportMap.ts");
    assert(
      await exists(importMapPath),
      "Import map should be generated at __generated__/docsImportMap.ts",
    );

    // Read and verify the import map content
    const importMapContent = await Deno.readTextFile(importMapPath);

    // Should have imports for both MDX files
    assert(
      importMapContent.includes("quickstart"),
      "Import map should include quickstart",
    );
    assert(
      importMapContent.includes("getting-started"),
      "Import map should include getting-started",
    );

    // Should export availableDocs Set
    assert(
      importMapContent.includes("export const availableDocs"),
      "Import map should export availableDocs",
    );

    // Should have lazy loader function
    assert(
      importMapContent.includes("export async function loadDocComponent"),
      "Import map should export loadDocComponent function",
    );

    // Should have correct slugs in the Set
    assert(
      importMapContent.includes('"quickstart"'),
      "Import map should include quickstart slug",
    );
    assert(
      importMapContent.includes('"getting-started"'),
      "Import map should include getting-started slug",
    );
  } finally {
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});
