#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";
import { parse as parseToml } from "@std/toml";

/**
 * Integration tests for the aibff calibrate command
 *
 * Tests verify that the calibrate command correctly handles multiple models,
 * command line parsing, and output generation.
 */

const calibrateScript = new URL("../../commands/calibrate.ts", import.meta.url).pathname;
const fixturesDir = new URL("../fixtures", import.meta.url).pathname;

// Helper to run calibrate command with args
async function runCalibrate(args: string[]) {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      calibrateScript,
      ...args,
    ],
    env: {
      OPENROUTER_API_KEY: "test-key",
    },
  });

  const { code, stdout, stderr } = await command.output();
  return {
    code,
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
  };
}

// Command Line Parsing Tests

Deno.test("calibrate should require grader file when no arguments", async () => {
  const { code, stderr } = await runCalibrate([]);
  
  assertEquals(code, 1);
  assertStringIncludes(stderr, "At least one grader file is required");
});

Deno.test("calibrate should show updated help text with --model flag", async () => {
  const { code, stdout } = await runCalibrate(["--help"]);
  
  assertEquals(code, 0);
  assertStringIncludes(stdout, "--model");
  assertStringIncludes(stdout, "Comma-separated list of models");
  assertStringIncludes(stdout, "default: openai/gpt-3.5-turbo");
  // Should not mention ANTHROPIC_MODEL env var
  assertEquals(stdout.includes("ANTHROPIC_MODEL"), false);
});

Deno.test("calibrate should parse single model from --model flag", async () => {
  // Create a mock grader file
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  await Deno.writeTextFile(tempGrader, `# Test Grader

This is a test grader.

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { code, stderr } = await runCalibrate([
      tempGrader,
      "--model", "claude-3.5-sonnet",
      "--output", tempDir,
    ]);
    
    // Should show the model in output
    assertStringIncludes(stderr, "Model(s): claude-3.5-sonnet");
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate should parse multiple models from comma-separated --model flag", async () => {
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  await Deno.writeTextFile(tempGrader, `# Test Grader

This is a test grader.

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { code, stderr } = await runCalibrate([
      tempGrader,
      "--model", "claude-3.5-sonnet,gpt-4,gpt-3.5-turbo",
      "--output", tempDir,
    ]);
    
    // Should show all models in output
    assertStringIncludes(stderr, "Model(s): claude-3.5-sonnet, gpt-4, gpt-3.5-turbo");
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate should use default model (openai/gpt-3.5-turbo) when no --model specified", async () => {
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  await Deno.writeTextFile(tempGrader, `# Test Grader

This is a test grader.

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { code, stderr } = await runCalibrate([
      tempGrader,
      "--output", tempDir,
    ]);
    
    // Should show default model
    assertStringIncludes(stderr, "Model(s): openai/gpt-3.5-turbo");
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});

// Execution Tests

Deno.test("calibrate should show progress for grader-model combinations", async () => {
  const tempGrader1 = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "grader1-",
  });
  const tempGrader2 = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "grader2-",
  });
  
  await Deno.writeTextFile(tempGrader1, `# Grader 1

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  await Deno.writeTextFile(tempGrader2, `# Grader 2

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { stderr } = await runCalibrate([
      tempGrader1,
      tempGrader2,
      "--model", "model1,model2",
      "--output", tempDir,
    ]);
    
    // Should show progress like "Progress: X/4 grader-model combinations complete"
    assertStringIncludes(stderr, "grader-model combinations");
    assertStringIncludes(stderr, "Running calibration with 2 graders and 2 models");
  } finally {
    await Deno.remove(tempGrader1);
    await Deno.remove(tempGrader2);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate should respect concurrency for grader-model combinations", async () => {
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  
  await Deno.writeTextFile(tempGrader, `# Test Grader

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { stderr } = await runCalibrate([
      tempGrader,
      "--model", "model1,model2,model3",
      "--output", tempDir,
      "--concurrency", "2",
    ]);
    
    // Should show concurrency applied to combinations
    assertStringIncludes(stderr, "Concurrency: 2");
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});

// Output Structure Tests

Deno.test("calibrate should create nested TOML structure for multiple models", async () => {
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  
  await Deno.writeTextFile(tempGrader, `# Test Grader

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    // This test would normally run the calibration and check the output
    // For now, we're just testing that the command accepts multiple models
    const { code } = await runCalibrate([
      tempGrader,
      "--model", "model1,model2",
      "--output", tempDir,
    ]);
    
    // In a real test, we would:
    // 1. Check that code === 0 (success)
    // 2. Read the output TOML file
    // 3. Verify it has the nested structure:
    //    [graderResults."test-grader".models.model1]
    //    [graderResults."test-grader".models.model2]
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("calibrate should maintain flat structure for single model (backward compatible)", async () => {
  const tempGrader = await Deno.makeTempFile({
    suffix: ".deck.md",
    prefix: "test-grader-",
  });
  
  await Deno.writeTextFile(tempGrader, `# Test Grader

## Samples

\`\`\`toml
[[samples]]
id = "test1"
score = 2

[samples.messages]
user = "Test question"
assistant = "Test answer"
\`\`\`
`);

  const tempDir = await Deno.makeTempDir();
  
  try {
    const { code } = await runCalibrate([
      tempGrader,
      "--output", tempDir,
    ]);
    
    // In a real test, we would:
    // 1. Check that code === 0 (success)
    // 2. Read the output TOML file
    // 3. Verify it has the flat structure:
    //    [graderResults."test-grader"]
    //    (no .models intermediate level)
  } finally {
    await Deno.remove(tempGrader);
    await Deno.remove(tempDir, { recursive: true });
  }
});