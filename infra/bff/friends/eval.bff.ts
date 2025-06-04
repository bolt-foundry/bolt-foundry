#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { runEval } from "packages/bolt-foundry/evals/eval.ts";

const logger = getLogger(import.meta);

export async function evalCommand(options: string[]): Promise<number> {
  // Parse command line arguments
  const args: Record<string, string> = {};
  let i = 0;

  while (i < options.length) {
    const arg = options[i];

    if (arg === "--input" || arg === "-i") {
      args.inputFile = options[++i];
    } else if (arg === "--deck" || arg === "-d") {
      args.deckFile = options[++i];
    } else if (arg === "--model" || arg === "-m") {
      args.model = options[++i] || "gpt-4o";
    } else if (arg === "--output" || arg === "-o") {
      args.outputFile = options[++i];
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      return 0;
    } else {
      logger.error(`Unknown argument: ${arg}`);
      printHelp();
      return 1;
    }
    i++;
  }

  // Validate required arguments
  if (!args.inputFile || !args.deckFile) {
    logger.error("Missing required arguments: --input and --deck");
    printHelp();
    return 1;
  }

  // Set default model if not provided
  if (!args.model) {
    args.model = "openai/gpt-4o";
  }

  logger.info(`Running evaluation...`);
  logger.info(`Input: ${args.inputFile}`);
  logger.info(`Deck: ${args.deckFile}`);
  logger.info(`Model: ${args.model}`);

  try {
    // Run the evaluation
    const results = await runEval({
      inputFile: args.inputFile,
      deckFile: args.deckFile,
      model: args.model,
    });

    // Output results
    if (args.outputFile) {
      // Write to file
      const output = results.map((r) => JSON.stringify(r)).join("\n");
      await Deno.writeTextFile(args.outputFile, output);
      logger.info(`Results written to ${args.outputFile}`);
    } else {
      // Output to console
      logger.info(`\nEvaluation Results (${results.length} samples):`);

      // deno-lint-ignore no-console
      console.table(
        results.map((r) => ({
          "Sample ID": r.id,
          "Score": r.score,
          "Latency (ms)": r.latencyInMs,
          "Notes": r.output.notes || "",
        })),
      );

      // Summary statistics
      const scores = results.map((r) => r.score as number);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const avgLatency = results.reduce((a, b) => a + b.latencyInMs, 0) /
        results.length;

      logger.info("\nSummary Statistics:");
      // deno-lint-ignore no-console
      console.table({
        "Average Score": avgScore.toFixed(2),
        "Average Latency (ms)": avgLatency.toFixed(0),
        "Total Samples": results.length,
      });

      // Calibration metrics if ground truth scores are present
      const resultsWithGroundTruth = results.filter((r) =>
        r.sampleMetadata && "groundTruthScore" in r.sampleMetadata
      );

      if (resultsWithGroundTruth.length > 0) {
        logger.info("\nJudge Calibration Metrics:");

        // Calculate accuracy metrics
        let exactMatches = 0;
        let withinOne = 0;
        let totalError = 0;

        for (const result of resultsWithGroundTruth) {
          const groundTruth = result.sampleMetadata?.groundTruthScore as number;
          const diff = Math.abs(result.score - groundTruth);

          if (diff === 0) exactMatches++;
          if (diff <= 1) withinOne++;
          totalError += diff;
        }

        const exactAccuracy =
          (exactMatches / resultsWithGroundTruth.length * 100).toFixed(1);
        const withinOneAccuracy =
          (withinOne / resultsWithGroundTruth.length * 100).toFixed(1);
        const avgError = (totalError / resultsWithGroundTruth.length).toFixed(
          2,
        );

        // deno-lint-ignore no-console
        console.table({
          "Exact Match Rate":
            `${exactAccuracy}% (${exactMatches}/${resultsWithGroundTruth.length})`,
          "Within ±1 Accuracy":
            `${withinOneAccuracy}% (${withinOne}/${resultsWithGroundTruth.length})`,
          "Average Absolute Error": avgError,
          "Total Samples with Ground Truth": resultsWithGroundTruth.length,
        });

        // Show disagreements
        const disagreements = resultsWithGroundTruth.filter((r) =>
          r.score !== (r.sampleMetadata?.groundTruthScore as number)
        );

        if (disagreements.length > 0) {
          logger.info("\nDisagreements:");
          // deno-lint-ignore no-console
          console.table(
            disagreements.map((result) => {
              const groundTruth = result.sampleMetadata
                ?.groundTruthScore as number;
              return {
                "Sample ID": result.id,
                "Judge Score": result.score,
                "Ground Truth": groundTruth,
                "Difference": result.score - groundTruth,
              };
            }),
          );
        }
      }
    }

    return 0;
  } catch (error) {
    logger.error(`Evaluation failed: ${error}`);
    return 1;
  }
}

function printHelp() {
  logger.info(`
Usage: bff eval [options]

Run LLM evaluation on a dataset using a judge deck.

Options:
  -i, --input <file>    Input JSONL file with evaluation samples (required)
  -d, --deck <file>     Deck file with evaluation criteria (required)
  -m, --model <model>   Model to use for evaluation (default: openai/gpt-4o)
  -o, --output <file>   Output file for results (optional, defaults to console)
  -h, --help            Show this help message

Example:
  bff eval --input ./data/samples.jsonl --deck ./decks/json-validator.ts
  bff eval -i samples.jsonl -d validator.ts -m anthropic/claude-3-opus -o results.jsonl
`);
}

register(
  "eval",
  "Run LLM evaluation on a dataset",
  evalCommand,
  [],
  false, // Not AI-safe since it calls external APIs
);
