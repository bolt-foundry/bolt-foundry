#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import { parse as parseToml } from "@std/toml";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Integration test for the aibff eval command
 * Tests the full command execution with mocked API calls
 */

// Mock fetch to intercept OpenRouter API calls
const originalFetch = globalThis.fetch;
let fetchCallCount = 0;

function mockFetch(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  const url = typeof input === "string"
    ? input
    : input instanceof URL
    ? input.toString()
    : (input as Request).url;

  if (url === "https://openrouter.ai/api/v1/chat/completions") {
    fetchCallCount++;

    // Return a mock response based on the request
    const body = JSON.parse(init?.body as string);
    logger.debug("Intercepted API call:", {
      model: body.model,
      messageCount: body.messages?.length,
    });

    // Simulate different scores for different samples
    const scores = [2, 1, -1]; // Predictable scores
    const score = scores[fetchCallCount - 1] || 0;

    const mockResponse = {
      id: `mock-${fetchCallCount}`,
      choices: [{
        message: {
          content: JSON.stringify({
            score: score,
            reason: `Mock evaluation reason for sample ${fetchCallCount}`,
          }),
        },
      }],
    };

    return Promise.resolve(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }

  // Fall back to original fetch for other URLs
  return originalFetch(input, init);
}

Deno.test.ignore("aibff eval integration - happy path", async () => {
  // Setup: Create temporary test files
  const tempDir = await Deno.makeTempDir();
  const outputFile = `${tempDir}/results.toml`;

  // Copy test fixtures to temp directory
  const fixturesDir = new URL("../fixtures", import.meta.url).pathname;
  const testGraderContent = await Deno.readTextFile(
    `${fixturesDir}/test-grader.deck.md`,
  );
  const testSamplesContent = await Deno.readTextFile(
    `${fixturesDir}/test-grader-samples.toml`,
  );

  const graderFile = `${tempDir}/test-grader.deck.md`;
  const samplesFile = `${tempDir}/test-grader-samples.toml`;

  await Deno.writeTextFile(graderFile, testGraderContent);
  await Deno.writeTextFile(samplesFile, testSamplesContent);

  try {
    // Replace global fetch with mock
    globalThis.fetch = mockFetch;
    fetchCallCount = 0;

    // Run the eval command
    const evalScript =
      new URL("../../commands/eval.ts", import.meta.url).pathname;
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-net",
        "--allow-write",
        evalScript,
        graderFile,
        "--output",
        outputFile,
        "--concurrency",
        "1", // Use concurrency=1 for predictable mock responses
      ],
      env: {
        ...Deno.env.toObject(),
        OPENROUTER_API_KEY: "test-key",
        ANTHROPIC_MODEL: "test-model",
      },
    });

    const { code, stderr } = await command.output();
    const errorOutput = new TextDecoder().decode(stderr);
    logger.debug("Command output:", errorOutput);

    // Verify command succeeded
    assertEquals(
      code,
      0,
      `Command should exit with code 0. Output: ${errorOutput}`,
    );

    // Verify output file was created
    const outputExists = await Deno.stat(outputFile).then(() => true).catch(
      () => false,
    );
    assertEquals(outputExists, true, "Output file should be created");

    // Parse and verify TOML structure
    const tomlContent = await Deno.readTextFile(outputFile);
    const results = parseToml(tomlContent) as {
      graderResults: Record<string, {
        grader: string;
        model: string;
        timestamp: string;
        samples: number;
        average_distance: number;
        results: Array<{
          id: string;
          grader_score: number;
          truth_score: number;
          notes: string;
        }>;
      }>;
    };

    // Verify structure
    assertEquals(
      typeof results.graderResults,
      "object",
      "Should have graderResults section",
    );

    const graderName = Object.keys(results.graderResults)[0];
    assertEquals(graderName, "test-grader", "Grader name should match");

    const graderResult = results.graderResults[graderName];
    assertEquals(
      graderResult.grader,
      graderFile,
      "Grader file path should match",
    );
    assertEquals(graderResult.model, "test-model", "Model should match");
    assertEquals(graderResult.samples, 3, "Should have 3 samples");

    // Verify individual results
    assertEquals(graderResult.results.length, 3, "Should have 3 results");

    // Check scores match our mock responses
    assertEquals(graderResult.results[0].grader_score, 2, "First sample score");
    assertEquals(graderResult.results[0].truth_score, 3, "First sample truth");
    assertEquals(
      graderResult.results[1].grader_score,
      1,
      "Second sample score",
    );
    assertEquals(graderResult.results[1].truth_score, 1, "Second sample truth");
    assertEquals(
      graderResult.results[2].grader_score,
      -1,
      "Third sample score",
    );
    assertEquals(graderResult.results[2].truth_score, -2, "Third sample truth");

    // Verify average distance calculation
    const expectedAvgDistance =
      (Math.abs(2 - 3) + Math.abs(1 - 1) + Math.abs(-1 - (-2))) / 3;
    assertEquals(
      graderResult.average_distance,
      Number(expectedAvgDistance.toFixed(2)),
      "Average distance should be calculated correctly",
    );

    // Verify API was called correct number of times
    assertEquals(fetchCallCount, 3, "Should call API once per sample");
  } finally {
    // Cleanup
    globalThis.fetch = originalFetch;
    await Deno.remove(tempDir, { recursive: true });
  }
});
