import { assertEquals, assertStringIncludes } from "@std/assert";
import { renderCommand } from "@bfmono/apps/aibff/commands/render.ts";
import { join } from "@std/path";

// Test removed - render command doesn't show help, just exits

Deno.test("render command - shows help with --help flag", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintLn = console.log;
  const originalExit = Deno.exit;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Mock Deno.exit
  let exitCode: number | undefined;
  // deno-lint-ignore no-explicit-any
  (Deno as any).exit = (code: number) => {
    exitCode = code;
    throw new Error("exit");
  };

  try {
    await renderCommand.run(["--help"]);
  } catch (e) {
    if (e instanceof Error && e.message !== "exit") throw e;
  }

  // Restore original functions
  // deno-lint-ignore no-console
  console.log = originalPrintLn;
  Deno.exit = originalExit;

  // --help should show usage and exit with code 0
  assertStringIncludes(
    output,
    "Usage: aibff render <deck.md> [--format openai|markdown]",
  );
  assertEquals(exitCode, 0);
});

Deno.test("render command - renders deck successfully", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintLn = console.log;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Create a temporary test deck file
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  await Deno.writeTextFile(deckPath, "# Test Deck\n\nA simple test deck.");

  await renderCommand.run([deckPath]);

  // Restore original functions
  // deno-lint-ignore no-console
  console.log = originalPrintLn;

  // Clean up
  await Deno.remove(tempDir, { recursive: true });

  // Should output JSON with messages array
  const result = JSON.parse(output);
  assertEquals(Array.isArray(result.messages), true);
  assertEquals(result.messages[0].role, "system");
});

Deno.test("render command - handles non-existent file", async () => {
  let errorOutput = "";
  // deno-lint-ignore no-console
  const originalPrintErr = console.error;
  const originalExit = Deno.exit;

  // Mock console.error to capture output
  // deno-lint-ignore no-console
  console.error = (msg: string) => {
    errorOutput += msg + "\n";
  };

  // Mock Deno.exit
  let exitCode: number | undefined;
  // deno-lint-ignore no-explicit-any
  (Deno as any).exit = (code: number) => {
    exitCode = code;
    throw new Error("exit");
  };

  try {
    await renderCommand.run(["/non/existent/file.deck.md"]);
  } catch (e) {
    if (e instanceof Error && e.message !== "exit") throw e;
  }

  // Restore original functions
  // deno-lint-ignore no-console
  console.error = originalPrintErr;
  Deno.exit = originalExit;

  assertStringIncludes(errorOutput, "Error: File not found:");
  assertEquals(exitCode, 1);
});

Deno.test("render command - renders deck as JSON", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintln = console.log;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Create a temporary test deck file
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  const deckContent = `# Test Deck

A simple test deck for rendering.

## Test Card

This is a test specification.`;

  await Deno.writeTextFile(deckPath, deckContent);

  try {
    await renderCommand.run([deckPath]);
  } finally {
    // Restore original function
    // deno-lint-ignore no-console
    console.log = originalPrintln;

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }

  // Check that output is valid JSON with proper formatting
  const parsed = JSON.parse(output);
  assertEquals(typeof parsed, "object");
  assertStringIncludes(output, "  "); // Should have indentation for JSON output
});

Deno.test("render command - outputs to stdout", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintln = console.log;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");

  const deckContent = `# Test Deck

A simple test deck for rendering.`;

  await Deno.writeTextFile(deckPath, deckContent);

  try {
    await renderCommand.run([deckPath]);

    // Verify output was written to stdout
    const parsed = JSON.parse(output);
    assertEquals(typeof parsed, "object");
    assertEquals(Array.isArray(parsed.messages), true);
  } finally {
    // Restore original function
    // deno-lint-ignore no-console
    console.log = originalPrintln;

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command - --format openai outputs JSON", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintln = console.log;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");

  const deckContent = `# Test Deck

A simple test deck for rendering.`;

  await Deno.writeTextFile(deckPath, deckContent);

  try {
    await renderCommand.run([deckPath, "--format", "openai"]);

    // Verify output is valid JSON with OpenAI structure
    const parsed = JSON.parse(output);
    assertEquals(typeof parsed, "object");
    assertEquals(Array.isArray(parsed.messages), true);
    assertEquals(parsed.messages[0].role, "system");
    assertStringIncludes(parsed.messages[0].content, "# Test Deck");
  } finally {
    // Restore original function
    // deno-lint-ignore no-console
    console.log = originalPrintln;

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command - --format markdown outputs system message content", async () => {
  let output = "";
  // deno-lint-ignore no-console
  const originalPrintln = console.log;

  // Mock console.log to capture output
  // deno-lint-ignore no-console
  console.log = (msg: string) => {
    output += msg + "\n";
  };

  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");

  const deckContent = `# Test Deck

A simple test deck for rendering.`;

  await Deno.writeTextFile(deckPath, deckContent);

  try {
    await renderCommand.run([deckPath, "--format", "markdown"]);

    // Verify output is plain markdown (not JSON)
    assertStringIncludes(output, "# Test Deck");
    assertStringIncludes(output, "A simple test deck for rendering.");

    // Should not be JSON
    try {
      JSON.parse(output);
      throw new Error("Output should not be valid JSON");
    } catch (e) {
      if (e instanceof SyntaxError) {
        // This is expected - output should not be JSON
      } else {
        throw e;
      }
    }
  } finally {
    // Restore original function
    // deno-lint-ignore no-console
    console.log = originalPrintln;

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("render command - invalid format shows error", async () => {
  let errorOutput = "";
  // deno-lint-ignore no-console
  const originalPrintErr = console.error;
  const originalExit = Deno.exit;

  // Mock console.error to capture output
  // deno-lint-ignore no-console
  console.error = (msg: string) => {
    errorOutput += msg + "\n";
  };

  // Mock Deno.exit
  let exitCode: number | undefined;
  // deno-lint-ignore no-explicit-any
  (Deno as any).exit = (code: number) => {
    exitCode = code;
    throw new Error("exit");
  };

  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  await Deno.writeTextFile(deckPath, "# Test");

  try {
    await renderCommand.run([deckPath, "--format", "invalid"]);
  } catch (e) {
    if (e instanceof Error && e.message !== "exit") throw e;
  } finally {
    // Restore original functions
    // deno-lint-ignore no-console
    console.error = originalPrintErr;
    Deno.exit = originalExit;

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }

  assertStringIncludes(errorOutput, "--format must be 'openai' or 'markdown'");
  assertEquals(exitCode, 1);
});
