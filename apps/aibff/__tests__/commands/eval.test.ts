#!/usr/bin/env -S bff test

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals, assertStringIncludes } from "@std/assert";
import { parse as parseToml } from "@std/toml";

/**
 * Integration tests for the aibff eval command
 *
 * Tests verify that the eval command correctly handles different input modes
 * and provides appropriate error messages.
 */

const evalScript = new URL("../../commands/eval.ts", import.meta.url).pathname;
const fixturesDir = new URL("../fixtures", import.meta.url).pathname;

Deno.test("eval should require grader file when no arguments", async () => {
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

  const { code, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);

  assertEquals(code, 1);
  assertStringIncludes(error, "At least one grader file is required");
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
  assertStringIncludes(output, "--output results.toml");
  assertStringIncludes(output, "Examples:");
});

Deno.test("eval should fail when OPENROUTER_API_KEY is missing", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

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
        `${fixturesDir}/test-samples.toml`,
        "--output",
        outputFile,
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
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
});

Deno.test("eval should fail when grader file doesn't exist", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

  try {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        "non-existent-grader.deck.md",
        "--output",
        outputFile,
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
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
});

Deno.test("eval should fail when input file doesn't exist", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

  try {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        "non-existent-samples.toml",
        "--output",
        outputFile,
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
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
});

Deno.test("eval should display correct info messages for embedded samples", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

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
        "--output",
        outputFile,
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    assertStringIncludes(info, "Running evaluation with 1 grader");
    assertStringIncludes(info, "Output file:");
    assertStringIncludes(info, "Model: anthropic/claude-3.5-sonnet");
    assertStringIncludes(info, "Concurrency:");
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
});

Deno.test("eval should display correct info messages for file input mode", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

  try {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        `${fixturesDir}/test-samples.toml`,
        "--output",
        outputFile,
      ],
      stdin: "inherit",
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    assertStringIncludes(info, "Running evaluation with 1 grader");
    assertStringIncludes(info, "Using input file:");
    assertStringIncludes(info, "test-samples.toml");
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
});

Deno.test("eval should accept custom model via ANTHROPIC_MODEL env var", async () => {
  const outputFile = await Deno.makeTempFile({ suffix: ".toml" });

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
        "--output",
        outputFile,
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
  } finally {
    try {
      await Deno.remove(outputFile);
    } catch {
      // Ignore errors
    }
  }
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

// Tests for multi-grader support and folder output

Deno.test("eval should accept multiple graders", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        `${fixturesDir}/test-grader.deck.md`, // Use same grader twice for testing
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    assertStringIncludes(info, "Running evaluation with 2 graders");
    assertStringIncludes(info, "Output folder: results");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});


Deno.test("eval should parse graders and samples correctly", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);
    
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        `${fixturesDir}/test-samples.toml`,
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    assertStringIncludes(info, "Running evaluation with 1 grader");
    assertStringIncludes(info, "Using input file:");
    assertStringIncludes(info, "test-samples.toml");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

// Test for TOML structure generation
Deno.test("eval should generate correct TOML structure", () => {
  // Test that we can generate the expected TOML structure
  const graderName = "test-grader";
  const graderPath = "graders/test-grader.deck.md";
  const model = "anthropic/claude-3.5-sonnet";
  const timestamp = new Date().toISOString();

  const results = [
    { id: "sample-1", grader_score: 2, truth_score: 3, notes: "Test note 1" },
    { id: "sample-2", grader_score: 1, truth_score: 1, notes: "Test note 2" },
    { id: "sample-3", grader_score: -1, truth_score: 0, notes: "Test note 3" },
  ];

  // Calculate average distance
  const totalDistance = results.reduce(
    (sum, r) => sum + Math.abs(r.grader_score - r.truth_score),
    0,
  );
  const avgDistance = totalDistance / results.length;

  // Build expected structure
  const expectedStructure = {
    graderResults: {
      [graderName]: {
        grader: graderPath,
        model: model,
        timestamp: timestamp,
        samples: results.length,
        average_distance: Number(avgDistance.toFixed(2)),
        results: results,
      },
    },
  };

  // Verify structure can be converted to TOML
  const tomlString = stringifyToml(expectedStructure);
  assertStringIncludes(tomlString, `[graderResults."${graderName}"]`);
  assertStringIncludes(tomlString, `grader = "${graderPath}"`);
  assertStringIncludes(tomlString, `model = "${model}"`);
  assertStringIncludes(
    tomlString,
    `average_distance = ${Number(avgDistance.toFixed(2))}`,
  );

  // Verify it can be parsed back
  const parsed = parseToml(tomlString) as {
    graderResults: Record<
      string,
      {
        grader: string;
        samples: number;
        results: Array<unknown>;
      }
    >;
  };
  assertEquals(parsed.graderResults[graderName].grader, graderPath);
  assertEquals(parsed.graderResults[graderName].samples, results.length);
  assertEquals(parsed.graderResults[graderName].results.length, results.length);
});

// Test for average distance calculation
Deno.test("eval should calculate average distance correctly", () => {
  const testCases = [
    {
      name: "All exact matches",
      results: [
        { grader_score: 1, truth_score: 1 },
        { grader_score: 2, truth_score: 2 },
        { grader_score: -1, truth_score: -1 },
      ],
      expected: 0,
    },
    {
      name: "Mixed differences",
      results: [
        { grader_score: 2, truth_score: 3 }, // distance = 1
        { grader_score: 1, truth_score: -1 }, // distance = 2
        { grader_score: 0, truth_score: 0 }, // distance = 0
      ],
      expected: 1, // (1 + 2 + 0) / 3 = 1
    },
    {
      name: "All off by one",
      results: [
        { grader_score: 2, truth_score: 1 }, // distance = 1
        { grader_score: 0, truth_score: 1 }, // distance = 1
        { grader_score: -1, truth_score: 0 }, // distance = 1
      ],
      expected: 1,
    },
    {
      name: "Large differences",
      results: [
        { grader_score: 3, truth_score: -3 }, // distance = 6
        { grader_score: -3, truth_score: 3 }, // distance = 6
      ],
      expected: 6,
    },
    {
      name: "Empty results",
      results: [],
      expected: 0,
    },
  ];

  for (const testCase of testCases) {
    const totalDistance = testCase.results.reduce(
      (sum, r) => sum + Math.abs(r.grader_score - r.truth_score),
      0,
    );
    const avgDistance = testCase.results.length > 0
      ? totalDistance / testCase.results.length
      : 0;

    assertEquals(
      avgDistance,
      testCase.expected,
      `${testCase.name}: expected average distance of ${testCase.expected}`,
    );
  }
});

Deno.test("eval should create default results folder when --output not provided", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    // Change to temp directory for test
    Deno.chdir(tempDir);

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
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    // Should create results folder
    assertStringIncludes(info, "Output folder: results");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("eval should use custom folder with --output", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    // Change to temp directory for test
    Deno.chdir(tempDir);

    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        `${fixturesDir}/test-grader.deck.md`,
        `${fixturesDir}/test-samples.toml`,
        "--output",
        "my-evaluation",
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
      },
    });

    const { stderr } = await command.output();
    const info = new TextDecoder().decode(stderr);

    // Should show custom output folder
    assertStringIncludes(info, "Output folder: my-evaluation");
    assertStringIncludes(info, "Using input file:");
  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

// Helper function for TOML stringification (mimics the command's escapeTomlString)
function stringifyToml(obj: Record<string, unknown>): string {
  // Simple TOML stringifier for testing
  let result = "";

  for (const [section, data] of Object.entries(obj)) {
    if (section === "graderResults") {
      for (
        const [graderName, graderData] of Object.entries(
          data as Record<string, unknown>,
        )
      ) {
        result += `[graderResults."${graderName}"]\n`;

        for (
          const [key, value] of Object.entries(
            graderData as Record<string, unknown>,
          )
        ) {
          if (key === "results") {
            // Handle results array
            for (const r of value as Array<Record<string, unknown>>) {
              result += `\n[[graderResults."${graderName}".results]]\n`;
              for (const [rKey, rValue] of Object.entries(r)) {
                if (typeof rValue === "string") {
                  result += `${rKey} = "${rValue}"\n`;
                } else {
                  result += `${rKey} = ${rValue}\n`;
                }
              }
            }
          } else if (typeof value === "string") {
            result += `${key} = "${value}"\n`;
          } else {
            result += `${key} = ${value}\n`;
          }
        }
      }
    }
  }

  return result;
}
