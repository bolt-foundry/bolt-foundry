#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";

const mainScript = new URL("../main.ts", import.meta.url).pathname;
const oldEvalScript = new URL("../eval.ts", import.meta.url).pathname;
const fixturesDir = new URL("./fixtures", import.meta.url).pathname;

/**
 * Backward compatibility tests to ensure the new command structure
 * maintains the same behavior as the old eval.ts script
 */

Deno.test("aibff eval should show help with no arguments", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript, "eval"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: eval.ts");
  assertStringIncludes(output, "Examples:");
  assertStringIncludes(output, "Calibration mode");
});

Deno.test("aibff eval --help should show help", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript, "eval", "--help"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: eval.ts");
});

Deno.test("aibff eval should fail when OPENROUTER_API_KEY is missing", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-all",
      mainScript,
      "eval",
      `${fixturesDir}/test-grader.deck.md`,
    ],
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "", // Clear the key
    },
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(
    error,
    "Error: OPENROUTER_API_KEY environment variable is required",
  );
});

Deno.test("aibff eval should display correct info for calibration mode", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-all",
      mainScript,
      "eval",
      `${fixturesDir}/test-grader.deck.md`,
    ],
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "test-key",
    },
    stdout: "piped",
    stderr: "piped",
  });

  const { stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  // Will fail because test-key is not valid, but we can check the info messages
  assertStringIncludes(
    error,
    `Running evaluation with grader: ${fixturesDir}/test-grader.deck.md`,
  );
  // The test environment may detect stdin, so we check for either case
  const hasEmbeddedSamples = error.includes(
    "Using embedded samples from grader deck",
  );
  const hasInputFile = error.includes("Using input file:");
  assertEquals(hasEmbeddedSamples || hasInputFile, true);
  assertStringIncludes(error, "Model: anthropic/claude-3.5-sonnet");
});

Deno.test("direct eval.ts execution should still work", async () => {
  // The eval.ts file should still work directly for backward compatibility
  const directCommand = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", oldEvalScript, "--help"],
    stdout: "piped",
    stderr: "piped",
  });

  const directResult = await directCommand.output();
  const directOutput = new TextDecoder().decode(directResult.stdout);

  // Running through main.ts
  const mainCommand = new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", mainScript, "eval", "--help"],
    stdout: "piped",
    stderr: "piped",
  });

  const mainResult = await mainCommand.output();
  const mainOutput = new TextDecoder().decode(mainResult.stdout);

  // Both should produce the same help output
  assertEquals(directOutput, mainOutput);
});
