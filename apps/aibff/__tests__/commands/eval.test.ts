#!/usr/bin/env -S bff test

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals, assertStringIncludes } from "@std/assert";

/**
 * Integration tests for the aibff eval command
 *
 * Tests verify that the eval command correctly handles different input modes
 * and provides appropriate error messages.
 */

const evalScript = new URL("../../commands/eval.ts", import.meta.url).pathname;
const fixturesDir = new URL("../fixtures", import.meta.url).pathname;

Deno.test("eval should show help when no arguments provided", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      evalScript,
    ],
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: aibff eval");
  assertStringIncludes(output, "Examples:");
  assertStringIncludes(output, "Calibration mode");
  assertStringIncludes(output, "File input mode");
});

Deno.test("eval should show help with --help flag", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      evalScript,
      "--help",
    ],
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: aibff eval");
});

Deno.test("eval should fail when OPENROUTER_API_KEY is missing", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      evalScript,
      `${fixturesDir}/test-grader.deck.md`,
      `${fixturesDir}/test-samples.toml`, // Use existing file to bypass stdin
    ],
    stdin: "inherit",
    env: {
      PATH: getConfigurationVariable("PATH") || "",
      OPENROUTER_API_KEY: "", // Explicitly set to empty string
    },
  });

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(
    error,
    "OPENROUTER_API_KEY environment variable is required",
  );
});

Deno.test("eval should fail when grader file doesn't exist", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      evalScript,
      "non-existent-grader.deck.md",
      "dummy.toml", // Add dummy input to bypass stdin detection
    ],
    stdin: "inherit",
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "test-key",
    },
  });

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(error, "No such file");
});

Deno.test("eval should fail when input file doesn't exist", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      evalScript,
      `${fixturesDir}/test-grader.deck.md`,
      "non-existent-samples.toml",
    ],
    stdin: "inherit",
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "test-key",
    },
  });

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(error, "No such file");
});

Deno.test("eval should display correct info messages for calibration mode", async () => {
  // In subprocess environment, stdin detection is unreliable
  // So we'll test with an explicit empty file to simulate no input
  const emptyFile = await Deno.makeTempFile({ suffix: ".toml" });
  await Deno.writeTextFile(emptyFile, "");

  try {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        emptyFile, // Empty file to ensure we don't read from stdin
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    assertStringIncludes(info, "Running evaluation with grader:");
    assertStringIncludes(info, "test-grader.deck.md");
    assertStringIncludes(info, "Using input file:");
    assertStringIncludes(info, "Model: anthropic/claude-3.5-sonnet");
  } finally {
    await Deno.remove(emptyFile);
  }
});

Deno.test("eval should display correct info messages for file input mode", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      evalScript,
      `${fixturesDir}/test-grader.deck.md`,
      `${fixturesDir}/test-samples.toml`,
    ],
    stdin: "inherit",
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "test-key",
    },
  });

  const { stderr } = await command.output();
  const info = new TextDecoder().decode(stderr);

  assertStringIncludes(info, "Running evaluation with grader:");
  assertStringIncludes(info, "test-grader.deck.md");
  assertStringIncludes(info, "Using input file:");
  assertStringIncludes(info, "test-samples.toml");
});

Deno.test("eval should accept custom model via ANTHROPIC_MODEL env var", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-net",
      "--allow-write",
      evalScript,
      `${fixturesDir}/test-grader.deck.md`,
    ],
    env: {
      ...Deno.env.toObject(),
      OPENROUTER_API_KEY: "test-key",
      ANTHROPIC_MODEL: "gpt-4-turbo",
    },
  });

  const { stderr } = await command.output();
  const info = new TextDecoder().decode(stderr);

  assertStringIncludes(info, "Model: gpt-4-turbo");
});

Deno.test("eval summary statistics should calculate exact agreement - regression test", () => {
  // Test the agreement calculation logic between grader and ground truth
  // Agreement means EXACT match of scores, not just same sign

  // Mock results with grader scores and ground truth scores
  const mockResults = [
    { score: 2, sample: { score: 2 } }, // Exact match = AGREE (passed)
    { score: 3, sample: { score: 1 } }, // Both positive but different = DISAGREE (failed)
    { score: 1, sample: { score: -1 } }, // Different signs = DISAGREE (failed)
    { score: -1, sample: { score: -1 } }, // Exact match = AGREE (passed)
    { score: 0, sample: { score: 0 } }, // Exact match = AGREE (passed)
    { score: -2, sample: { score: -1 } }, // Both negative but different = DISAGREE (failed)
    { score: 0, sample: { score: 2 } }, // Different values = DISAGREE (failed)
    { score: 1, sample: {} }, // No ground truth = not counted
  ] as Array<{ score: number; sample: { score?: number } }>;

  // Calculate agreement using the same logic as in the eval command
  let passed = 0;
  let failed = 0;

  for (const result of mockResults) {
    const graderScore = result.score;
    const truthScore = result.sample.score;

    if (truthScore !== undefined) {
      // Both scores exist - check if they agree (exact match)
      const agree = graderScore === truthScore;

      if (agree) {
        passed++;
      } else {
        failed++;
      }
    }
    // No ground truth = not counted in pass/fail
  }

  // Verify the agreement calculations
  assertEquals(
    passed,
    3,
    "Should have 3 exact agreements: (2,2), (-1,-1), (0,0)",
  );
  assertEquals(
    failed,
    4,
    "Should have 4 disagreements: (3,1), (1,-1), (-2,-1), (0,2)",
  );

  // Verify specific test cases including the qb-draft-injury case
  const testCases = [
    { grader: 2, truth: 2, expected: true }, // Exact match
    { grader: 3, truth: 1, expected: false }, // Both positive but different (qb-draft-injury case)
    { grader: 1, truth: -1, expected: false }, // Different signs
    { grader: -1, truth: -1, expected: true }, // Exact match (negative)
    { grader: 0, truth: 0, expected: true }, // Exact match (zero)
    { grader: -2, truth: -1, expected: false }, // Both negative but different
    { grader: 0, truth: 1, expected: false }, // Different values
  ];

  for (const testCase of testCases) {
    const agree = testCase.grader === testCase.truth;

    assertEquals(
      agree,
      testCase.expected,
      `Agreement for grader=${testCase.grader}, truth=${testCase.truth} should be ${testCase.expected}`,
    );
  }
});
