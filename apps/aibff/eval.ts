#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import { runEval } from "packages/bolt-foundry/evals/eval.ts";
import { stringify as stringifyToml } from "@std/toml";
import { startSpinner } from "packages/logger/logger.ts";
import { gray, green, red } from "@std/fmt/colors";

function printText(message: string, isError = false) {
  if (isError) {
    // deno-lint-ignore no-console
    console.error(message);
  } else {
    // deno-lint-ignore no-console
    console.log(message);
  }
}

function getConfigVar(key: string): string | undefined {
  // deno-lint-ignore bolt-foundry/no-env-direct-access
  return Deno.env.get(key);
}

async function main() {
  const args = Deno.args;

  // Simple argument parsing
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printText(`Usage: aibff eval <grader.deck.md> [samples.jsonl|samples.toml]

Examples:
  # Calibration mode (uses deck's internal samples)
  aibff eval grader.deck.md
  
  # File input mode
  aibff eval grader.deck.md samples.toml
  aibff eval grader.deck.md samples.jsonl

Environment:
  OPENROUTER_API_KEY    Required for LLM access
  ANTHROPIC_MODEL      Model to use (default: anthropic/claude-3.5-sonnet)
`);
    Deno.exit(0);
  }

  const graderFile = args[0];
  const inputFile = args[1]; // Optional

  // Normal file mode or calibration mode
  await runEvaluation(graderFile, inputFile);
}

async function runEvaluation(graderFile: string, inputFile?: string) {
  try {
    // Get model from environment or use default
    const model = getConfigVar("ANTHROPIC_MODEL") ||
      "anthropic/claude-3.5-sonnet";

    // Check for API key
    if (!getConfigVar("OPENROUTER_API_KEY")) {
      printText(
        "Error: OPENROUTER_API_KEY environment variable is required",
        true,
      );
      Deno.exit(1);
    }

    printText(`Running evaluation with grader: ${graderFile}`, true);
    if (inputFile) {
      printText(`Using input file: ${inputFile}`, true);
    } else {
      printText("Using embedded samples from grader deck", true);
    }
    printText(`Model: ${model}`, true);
    printText("", true);

    // Start spinner for the evaluation process
    const stopSpinner = startSpinner([
      "Loading grader deck...",
      "Processing samples...",
      "Evaluating responses...",
      "Analyzing results...",
    ]);

    try {
      const results = await runEval({
        graderFile,
        inputFile: inputFile,
        model,
      });

      // Stop spinner before outputting results
      stopSpinner();

      // Calculate summary statistics
      // NOTE: "passed" = grader score EXACTLY matches ground truth, "failed" = any difference
      const totalSamples = results.length;
      const scores = results.map((r) => r.score as number);
      const avgScore = totalSamples > 0
        ? scores.reduce((a, b) => a + b, 0) / totalSamples
        : 0;

      // Calculate agreement between grader and ground truth
      let passed = 0;
      let failed = 0;

      for (const result of results) {
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
        } else {
          // No ground truth available - cannot determine agreement
          // For now, don't count in pass/fail statistics
        }
      }

      // Build TOML output structure
      const tomlOutput = {
        meta: {
          version: "0.1.0",
          deck: graderFile,
          timestamp: new Date().toISOString(),
          total_samples: totalSamples,
          context_provided: { model },
        },
        summary: {
          average_score: Number(avgScore.toFixed(2)),
          passed,
          failed,
        },
        results: results.map((result, idx) => {
          const resultData: Record<string, unknown> = {
            id: result.sample.id || `sample-${idx + 1}`,
            score: result.score,
            reason: result.output.reason || "",
            sample: {
              userMessage: result.sample.userMessage,
              assistantResponse: result.sample.assistantResponse,
              // Include any other original sample fields
              ...Object.fromEntries(
                Object.entries(result.sample).filter(([key]) =>
                  !["userMessage", "assistantResponse", "id"].includes(key)
                ),
              ),
            },
            evaluation: {
              raw: result.rawOutput,
            },
          };

          // Add truth_score if the original sample had a score
          if (result.sample.score !== undefined) {
            resultData.truth_score = result.sample.score;
          }

          return resultData;
        }),
      };

      // Output TOML format
      printText(stringifyToml(tomlOutput));

      // Print detailed per-sample results to stderr
      printText("", true);
      printText("Sample Results:", true);
      for (const result of results) {
        const graderScore = result.score;
        const truthScore = result.sample.score;
        const sampleId = result.sample.id || "unnamed";

        if (truthScore !== undefined) {
          // Check agreement - scores must match exactly
          const agree = graderScore === truthScore;

          const symbol = agree ? "✓" : "✗";
          const message =
            `${symbol} ${sampleId}: grader=${graderScore}, truth=${truthScore}`;

          // Color code: green for agreement, red for disagreement
          const coloredMessage = agree ? green(message) : red(message);
          printText(coloredMessage, true);
        } else {
          // No ground truth - show in gray
          const message = `- ${sampleId}: grader=${graderScore}, truth=N/A`;
          printText(gray(message), true);
        }
      }

      // Print summary to stderr
      printText("", true);
      printText("Summary:", true);
      printText(`Total samples: ${totalSamples}`, true);
      printText(`Average score: ${avgScore.toFixed(2)}`, true);
      printText(`Agreements: ${passed} (grader matches ground truth)`, true);
      printText(
        `Disagreements: ${failed} (grader differs from ground truth)`,
        true,
      );
    } catch (error) {
      // Stop spinner on error
      stopSpinner();
      throw error;
    }
  } catch (error) {
    printText(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
      true,
    );
    Deno.exit(1);
  }
}

// Run main
if (import.meta.main) {
  await main();
}
