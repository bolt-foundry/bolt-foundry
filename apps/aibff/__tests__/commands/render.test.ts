import { assertEquals, assertStringIncludes } from "@std/assert";
import { renderCommand } from "../../commands/render.ts";
import { join } from "@std/path";

Deno.test("render command - shows help with no arguments", async () => {
  let output = "";
  const originalPrintln = console.log;
  const originalExit = Deno.exit;
  
  // Mock console.log to capture output
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
    await renderCommand.run([]);
  } catch (e) {
    if (e instanceof Error && e.message !== "exit") throw e;
  }
  
  // Restore original functions
  console.log = originalPrintln;
  Deno.exit = originalExit;
  
  assertStringIncludes(output, "Usage: aibff render <deck.md>");
  assertEquals(exitCode, 1);
});

Deno.test("render command - shows help with --help flag", async () => {
  let output = "";
  const originalPrintln = console.log;
  const originalExit = Deno.exit;
  
  // Mock console.log to capture output
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
  console.log = originalPrintln;
  Deno.exit = originalExit;
  
  assertStringIncludes(output, "Usage: aibff render <deck.md>");
  assertStringIncludes(output, "Renders a deck file");
  assertStringIncludes(output, "--output");
  assertStringIncludes(output, "--context");
  assertEquals(exitCode, 0);
});


Deno.test("render command - validates context JSON", async () => {
  let errorOutput = "";
  const originalPrintErr = console.error;
  const originalExit = Deno.exit;
  
  // Mock console.error to capture output
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
  
  // Create a temporary test deck file
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  await Deno.writeTextFile(deckPath, "# Test Deck\n\nA simple test deck.");
  
  try {
    await renderCommand.run([deckPath, "--context", "invalid json"]);
  } catch (e) {
    if (e instanceof Error && e.message !== "exit") throw e;
  }
  
  // Restore original functions
  console.error = originalPrintErr;
  Deno.exit = originalExit;
  
  // Clean up
  await Deno.remove(tempDir, { recursive: true });
  
  assertStringIncludes(errorOutput, "Error parsing context JSON");
  assertEquals(exitCode, 1);
});

Deno.test("render command - handles non-existent file", async () => {
  let errorOutput = "";
  const originalPrintErr = console.error;
  const originalExit = Deno.exit;
  
  // Mock console.error to capture output
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
  console.error = originalPrintErr;
  Deno.exit = originalExit;
  
  assertStringIncludes(errorOutput, "Deck file not found");
  assertEquals(exitCode, 1);
});

Deno.test("render command - renders deck as JSON", async () => {
  let output = "";
  const originalPrintln = console.log;
  
  // Mock console.log to capture output
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
    console.log = originalPrintln;
    
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
  
  // Check that output is valid JSON with proper formatting
  const parsed = JSON.parse(output);
  assertEquals(typeof parsed, "object");
  assertStringIncludes(output, "  "); // Should have indentation for JSON output
});

Deno.test("render command - writes to output file", async () => {
  let output = "";
  const originalPrintln = console.log;
  
  // Mock console.log to capture output
  console.log = (msg: string) => {
    output += msg + "\n";
  };
  
  // Create a temporary directory
  const tempDir = await Deno.makeTempDir();
  const deckPath = join(tempDir, "test.deck.md");
  const outputPath = join(tempDir, "output.json");
  
  const deckContent = `# Test Deck

A simple test deck for rendering.`;
  
  await Deno.writeTextFile(deckPath, deckContent);
  
  try {
    await renderCommand.run([deckPath, "--output", outputPath]);
    
    // Verify file was created
    const fileContent = await Deno.readTextFile(outputPath);
    const parsed = JSON.parse(fileContent);
    assertEquals(typeof parsed, "object");
    
    // Verify success message
    assertStringIncludes(output, `Rendered deck written to: ${outputPath}`);
  } finally {
    // Restore original function
    console.log = originalPrintln;
    
    // Clean up
    await Deno.remove(tempDir, { recursive: true });
  }
});
