import { assertEquals, assertStringIncludes } from "@std/assert";
import { renderCommand } from "@bfmono/apps/aibff/commands/render.ts";
import { join } from "@std/path";
import { createCapturingUI, ui } from "@bfmono/packages/tui/tui.ts";

// Test removed - render command doesn't show help, just exits

Deno.test("render command - shows help with --help flag", async () => {
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  const originalExit = Deno.exit;

  // Replace ui methods with capturing versions
  Object.assign(ui, captureUI);

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
  Object.assign(ui, originalUI);
  Deno.exit = originalExit;

  // Should show help message
  const infoMessages = captureUI.captured
    .filter((m) => m.type === "info")
    .map((m) => m.message)
    .join("\n");
  assertStringIncludes(infoMessages, "Usage: aibff render");
  assertStringIncludes(infoMessages, "--context-file");
  assertEquals(exitCode, 1);
});

Deno.test("render command - renders deck successfully", async () => {
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };

  // Replace ui methods with capturing versions
  Object.assign(ui, captureUI);

  // Create a temporary test deck file
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  await Deno.writeTextFile(deckPath, "# Test Deck\n\nA simple test deck.");

  await renderCommand.run([deckPath]);

  // Restore original functions
  Object.assign(ui, originalUI);

  // Clean up
  await Deno.remove(tempDir, { recursive: true });

  // Should output JSON with messages array
  const outputMessages = captureUI.captured
    .filter((m) => m.type === "output")
    .map((m) => m.message)
    .join("\n");
  const result = JSON.parse(outputMessages);
  assertEquals(Array.isArray(result.messages), true);
  assertEquals(result.messages[0].role, "system");
});

Deno.test("render command - handles non-existent file", async () => {
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };
  const originalExit = Deno.exit;

  // Replace ui methods with capturing versions
  Object.assign(ui, captureUI);

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
  Object.assign(ui, originalUI);
  Deno.exit = originalExit;

  const errorMessages = captureUI.captured
    .filter((m) => m.type === "error")
    .map((m) => m.message)
    .join("\n");
  assertStringIncludes(errorMessages, "File not found:");
  assertEquals(exitCode, 1);
});

Deno.test("render command - renders deck as JSON", async () => {
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };

  // Replace ui methods with capturing versions
  Object.assign(ui, captureUI);

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
    Object.assign(ui, originalUI);

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }

  // Check that output is valid JSON with proper formatting
  const outputMessages = captureUI.captured
    .filter((m) => m.type === "output")
    .map((m) => m.message)
    .join("\n");
  const parsed = JSON.parse(outputMessages);
  assertEquals(typeof parsed, "object");
  assertStringIncludes(outputMessages, "  "); // Should have indentation for JSON output
});

Deno.test("render command - outputs to stdout", async () => {
  const captureUI = createCapturingUI();
  const originalUI = { ...ui };

  // Replace ui methods with capturing versions
  Object.assign(ui, captureUI);

  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");

  const deckContent = `# Test Deck

A simple test deck for rendering.`;

  await Deno.writeTextFile(deckPath, deckContent);

  try {
    await renderCommand.run([deckPath]);

    // Verify output was written to stdout
    const outputMessages = captureUI.captured
      .filter((m) => m.type === "output")
      .map((m) => m.message)
      .join("\n");
    const parsed = JSON.parse(outputMessages);
    assertEquals(typeof parsed, "object");
    assertEquals(Array.isArray(parsed.messages), true);
  } finally {
    // Restore original function
    Object.assign(ui, originalUI);

    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});
