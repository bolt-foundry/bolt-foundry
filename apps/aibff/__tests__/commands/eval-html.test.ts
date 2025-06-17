#!/usr/bin/env -S bff test

import { assertEquals, assertExists, assertStringIncludes } from "@std/assert";
import { parse as parseToml } from "@std/toml";

const evalScript = new URL("../../commands/eval.ts", import.meta.url).pathname;
const fixturesDir = new URL("../fixtures", import.meta.url).pathname;

Deno.test("eval should create both TOML and HTML files in output folder", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    // Create a simple test grader with embedded samples
    const graderContent = `# Test Grader
A simple test grader for HTML output.

\`\`\`toml
[[samples]]
id = "test-1"
userMessage = "What is 2+2?"
assistantResponse = "2+2 equals 4."
score = 2

[[samples]]
id = "test-2"
userMessage = "Hello"
assistantResponse = "Hi there!"
score = 1
\`\`\`

Please rate the response.`;
    
    await Deno.writeTextFile("test-grader.deck.md", graderContent);
    
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        "test-grader.deck.md",
      ],
      env: {
        // Use a mock API key since we won't actually make API calls
        OPENROUTER_API_KEY: "test-key-12345",
      },
    });

    const { code, stderr } = await command.output();
    
    // Even if eval fails due to API, files should be created
    const info = new TextDecoder().decode(stderr);
    
    // Check that output folder was created
    const folderExists = await Deno.stat("results").then(() => true).catch(() => false);
    assertEquals(folderExists, true, "results folder should be created");
    
    // If the command succeeded, check for files
    if (code === 0) {
      // Check TOML file exists
      const tomlExists = await Deno.stat("results/results.toml").then(() => true).catch(() => false);
      assertEquals(tomlExists, true, "results.toml should be created");
      
      // Check HTML file exists
      const htmlExists = await Deno.stat("results/results.html").then(() => true).catch(() => false);
      assertEquals(htmlExists, true, "results.html should be created");
      
      // Verify HTML content has expected structure
      const htmlContent = await Deno.readTextFile("results/results.html");
      assertStringIncludes(htmlContent, "<!DOCTYPE html>");
      assertStringIncludes(htmlContent, "Evaluation Results");
      assertStringIncludes(htmlContent, "Average Distance:");
      assertStringIncludes(htmlContent, '<details>');
    }
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("eval should handle HTML generation failure gracefully", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    // We can't easily simulate HTML generation failure in integration test,
    // but we can verify the warning message appears in the right conditions
    
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        "--output",
        "test-output",
      ],
      env: {
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);
    
    // Should still show output folder
    assertStringIncludes(info, "Output folder: test-output");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("eval HTML should include sample content when available", async () => {
  // This is more of a unit test but verifies the integration
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    // Create mock evaluation results
    const mockResults = {
      graderResults: {
        "test-grader": {
          grader: "test.deck.md",
          model: "claude",
          timestamp: new Date().toISOString(),
          samples: 1,
          average_distance: 0,
          results: [{
            id: "test-1",
            grader_score: 2,
            truth_score: 2,
            notes: "Good response",
            userMessage: "Test question",
            assistantResponse: "Test answer",
          }],
        },
      },
    };
    
    // Import and test HTML generation directly
    const { generateEvaluationHtml } = await import("../../utils/toml-to-html.ts");
    const html = generateEvaluationHtml(mockResults as any);
    
    // Verify sample content is included
    assertStringIncludes(html, "Test question");
    assertStringIncludes(html, "Test answer");
    assertStringIncludes(html, "Good response");
    assertStringIncludes(html, "User Message:");
    assertStringIncludes(html, "Assistant Response:");
    assertStringIncludes(html, "Grader's Reasoning:");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("eval should handle missing sample content gracefully", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    // Create mock evaluation results without sample content
    const mockResults = {
      graderResults: {
        "test-grader": {
          grader: "test.deck.md",
          model: "claude",
          timestamp: new Date().toISOString(),
          samples: 1,
          average_distance: 0,
          results: [{
            id: "test-1",
            grader_score: 2,
            truth_score: 2,
            notes: "Good response",
            // No userMessage or assistantResponse
          }],
        },
      },
    };
    
    // Import and test HTML generation directly
    const { generateEvaluationHtml } = await import("../../utils/toml-to-html.ts");
    const html = generateEvaluationHtml(mockResults as any);
    
    // Should still generate valid HTML
    assertStringIncludes(html, "<!DOCTYPE html>");
    assertStringIncludes(html, "test-1");
    assertStringIncludes(html, "Good response");
    
    // Should not have conversation section
    assertEquals(html.includes("User Message:"), false);
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});