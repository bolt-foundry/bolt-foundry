#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import {
  type GradingResult,
  runEval,
} from "packages/bolt-foundry/evals/eval.ts";
import { gray, green, red } from "@std/fmt/colors";
import type { Command } from "./types.ts";

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

function escapeTomlString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
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

    // Track results for summary calculation
    const collectedResults: Array<GradingResult> = [];

    try {
      // Print TOML header first
      const tomlHeader = {
        meta: {
          version: "0.1.0",
          deck: graderFile,
          timestamp: new Date().toISOString(),
          context_provided: { model },
        },
      };

      // Output the meta section
      printText("[meta]");
      printText(`version = "${tomlHeader.meta.version}"`);
      printText(`deck = "${tomlHeader.meta.deck}"`);
      printText(`timestamp = "${tomlHeader.meta.timestamp}"`);
      printText("");
      printText("[meta.context_provided]");
      printText(`model = "${model}"`);
      printText("");

      // Run evaluation with real-time TOML output
      const results = await runEval({
        graderFile,
        inputFile: inputFile,
        model,
        onSampleComplete: (result, index, total) => {
          collectedResults.push(result);

          // Output this result as TOML
          printText("[[results]]");
          const sampleId = result.sample.id || `sample-${index + 1}`;
          printText(`id = "${sampleId}"`);
          printText(`score = ${result.score}`);
          if (result.output.reason) {
            printText(`reason = "${escapeTomlString(result.output.reason)}"`);
          }
          if (result.sample.score !== undefined) {
            printText(`truth_score = ${result.sample.score}`);
          }
          printText("");

          printText("[results.sample]");
          printText(
            `userMessage = "${escapeTomlString(result.sample.userMessage)}"`,
          );
          printText(
            `assistantResponse = "${
              escapeTomlString(result.sample.assistantResponse)
            }"`,
          );

          // Include any extra sample fields
          const extraFields = Object.entries(result.sample).filter(([key]) =>
            !["userMessage", "assistantResponse", "id", "expected"].includes(
              key,
            )
          );
          for (const [key, value] of extraFields) {
            if (typeof value === "string") {
              printText(`${key} = "${escapeTomlString(value)}"`);
            } else if (typeof value === "number") {
              printText(`${key} = ${value}`);
            }
          }
          printText("");

          printText("[results.evaluation]");
          printText(`raw = "${escapeTomlString(result.rawOutput)}"`);
          printText("");

          // Print progress to stderr
          const graderScore = result.score;
          const truthScore = result.sample.score;
          const progress = `[${index + 1}/${total}]`;

          if (truthScore !== undefined) {
            const agree = graderScore === truthScore;
            const symbol = agree ? "✓" : "✗";
            const message =
              `${progress} ${symbol} ${sampleId}: grader=${graderScore}, truth=${truthScore}`;
            const coloredMessage = agree ? green(message) : red(message);
            printText(coloredMessage, true);
          } else {
            const message =
              `${progress} - ${sampleId}: grader=${graderScore}, truth=N/A`;
            printText(gray(message), true);
          }
        },
      });

      // Calculate summary statistics
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
          const agree = graderScore === truthScore;

          if (agree) {
            passed++;
          } else {
            failed++;
          }
        }
      }

      // Output summary section at the end
      printText("[summary]");
      printText(`total_samples = ${totalSamples}`);
      printText(`average_score = ${avgScore.toFixed(2)}`);
      printText(`passed = ${passed}`);
      printText(`failed = ${failed}`);

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

export const evalCommand: Command = {
  name: "eval",
  description: "Evaluate a grader deck against sample prompts",
  run: async (args: Array<string>) => {
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
  },
};

// Support direct execution for backward compatibility
if (import.meta.main) {
  await evalCommand.run(Deno.args);
}
