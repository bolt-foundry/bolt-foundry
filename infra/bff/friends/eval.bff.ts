#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { runEval } from "packages/bolt-foundry/evals/eval.ts";
import startSpinner from "lib/terminalSpinner.ts";

const logger = getLogger(import.meta);

function printLine(message: string) {
  // deno-lint-ignore no-console
  console.log(message);
}

function printTable(data: Array<unknown> | Record<string, unknown>) {
  // Format numbers to at most 3 decimal places
  const formatValue = (value: unknown): unknown => {
    if (typeof value === "number") {
      // If it's an integer or has no decimal places, return as is
      if (Number.isInteger(value)) {
        return value;
      }
      // Otherwise format to at most 3 decimal places
      const formatted = parseFloat(value.toFixed(3));
      return formatted;
    }
    return value;
  };

  // Process the data
  let processedData: Array<unknown> | Record<string, unknown>;

  if (Array.isArray(data)) {
    processedData = data.map((row) => {
      if (typeof row === "object" && row !== null) {
        const processedRow: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) {
          processedRow[key] = formatValue(value);
        }
        return processedRow;
      }
      return row;
    });
  } else if (typeof data === "object" && data !== null) {
    processedData = {};
    for (const [key, value] of Object.entries(data)) {
      processedData[key] = formatValue(value);
    }
  } else {
    processedData = data;
  }

  // deno-lint-ignore no-console
  console.table(processedData);
}

export async function evalCommand(options: Array<string>): Promise<number> {
  // Parse command line arguments
  const args: Record<string, string> = {};
  let i = 0;

  while (i < options.length) {
    const arg = options[i];

    if (arg === "--input" || arg === "-i") {
      args.inputFile = options[++i];
    } else if (arg === "--grader" || arg === "-g") {
      args.graderFile = options[++i];
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
  if (!args.inputFile || !args.graderFile) {
    logger.error("Missing required arguments: --input and --grader");
    printHelp();
    return 1;
  }

  // Set default model if not provided
  if (!args.model) {
    args.model = "openai/gpt-4o";
  }

  logger.debug(`Running evaluation...`);
  logger.debug(`Input: ${args.inputFile}`);
  logger.debug(`Grader: ${args.graderFile}`);
  logger.debug(`Model: ${args.model}`);

  // Show evaluation configuration
  printLine("\nEvaluation Configuration:");
  printTable({
    "Input File": args.inputFile,
    "Grader File": args.graderFile,
    "Model": args.model,
    "Output": args.outputFile || "Console",
  });

  const stopSpinner = startSpinner();

  try {
    // Run the evaluation
    const results = await runEval({
      inputFile: args.inputFile,
      graderFile: args.graderFile,
      model: args.model,
    });

    stopSpinner();
    // Clear the spinner line
    if (Deno.stdout.isTerminal()) {
      await Deno.stdout.write(new TextEncoder().encode("\r\x1b[K"));
    }

    // Output results
    if (args.outputFile) {
      // Write to file
      const output = results.map((r) => JSON.stringify(r)).join("\n");
      await Deno.writeTextFile(args.outputFile, output);
      logger.debug(`Results written to ${args.outputFile}`);
    } else {
      // Output to console
      printLine("\nEvaluation Results:");
      printTable(
        results.map((r) => ({
          "Sample ID": r.id,
          "Score": r.score,
          "Latency (ms)": r.latencyInMs,
        })),
      );

      // Summary statistics
      const scores = results.map((r) => r.score as number);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const avgLatency = results.reduce((a, b) => a + b.latencyInMs, 0) /
        results.length;

      printLine("\nSummary Statistics:");
      printTable({
        "Average Score": avgScore,
        "Average Latency (ms)": avgLatency,
        "Total Samples": results.length,
      });

      // Calibration metrics if ground truth scores are present
      const resultsWithGroundTruth = results.filter((r) =>
        r.sampleMetadata && "score" in r.sampleMetadata
      );

      if (resultsWithGroundTruth.length > 0) {
        printLine("\nGrader Calibration Metrics:");

        // Calculate accuracy metrics
        let exactMatches = 0;
        let withinOne = 0;
        let totalError = 0;

        for (const result of resultsWithGroundTruth) {
          const groundTruth = result.sampleMetadata?.score as number;
          const diff = Math.abs(result.score - groundTruth);

          if (diff === 0) exactMatches++;
          if (diff <= 1) withinOne++;
          totalError += diff;
        }

        const exactAccuracy = exactMatches / resultsWithGroundTruth.length *
          100;
        const withinOneAccuracy = withinOne / resultsWithGroundTruth.length *
          100;
        const avgError = totalError / resultsWithGroundTruth.length;

        printTable({
          "Exact Match Rate": `${
            exactAccuracy.toFixed(1)
          }% (${exactMatches}/${resultsWithGroundTruth.length})`,
          "Within ±1 Accuracy": `${
            withinOneAccuracy.toFixed(1)
          }% (${withinOne}/${resultsWithGroundTruth.length})`,
          "Average Absolute Error": avgError,
          "Total Samples with Ground Truth": resultsWithGroundTruth.length,
        });

        // Show disagreements
        const disagreements = resultsWithGroundTruth.filter((r) =>
          r.score !== (r.sampleMetadata?.score as number)
        );

        if (disagreements.length > 0) {
          printLine("\nDisagreements:");
          printTable(
            disagreements.map((result) => {
              const groundTruth = result.sampleMetadata
                ?.score as number;
              return {
                "Sample ID": result.id,
                "Grader Score": result.score,
                "Ground Truth": groundTruth,
                "Difference": result.score - groundTruth,
                "Assistant Response": result.sample?.assistantResponse ||
                  "No response available",
              };
            }),
          );

          // Detailed breakdown of each disagreement
          printLine("\nDetailed Disagreement Analysis:");
          disagreements.forEach((result, index) => {
            const groundTruth = result.sampleMetadata
              ?.score as number;
            printLine(`\n${"=".repeat(80)}`);
            printLine(
              `Disagreement ${index + 1} - Sample ID: ${result.id || "N/A"}`,
            );
            printLine(`${"=".repeat(80)}`);

            // Show sample data and scores in a single table
            printLine("\nSample Details:");
            const sampleData: Record<string, unknown> = {};

            // Display the original sample data
            if (result.sample) {
              sampleData["User Message"] = result.sample.userMessage;
              sampleData["Assistant Response"] =
                result.sample.assistantResponse;

              // Add expected value if present
              if (result.sample.expected) {
                sampleData["Expected"] = result.sample.expected;
              }

              // Add description from metadata if available
              if (result.sampleMetadata?.description) {
                sampleData["Description"] = result.sampleMetadata.description;
              }

              // Add any other sample fields (excluding the ones we already displayed)
              const excludedFields = [
                "id",
                "userMessage",
                "assistantResponse",
                "expected",
                "score",
              ];
              Object.entries(result.sample).forEach(([key, value]) => {
                if (!excludedFields.includes(key)) {
                  const displayKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();
                  sampleData[displayKey] = value;
                }
              });
            }

            // Add score comparison to the same table
            sampleData["Grader Score"] = result.score;
            sampleData["Ground Truth"] = groundTruth;
            sampleData["Difference"] = result.score - groundTruth;

            printTable(sampleData);

            // Print grader notes below the table
            printLine("\nGrader Notes:");
            printLine(result.output.notes || "No notes provided");
          });
        }
      }
    }

    return 0;
  } catch (error) {
    stopSpinner();
    // Clear the spinner line
    if (Deno.stdout.isTerminal()) {
      await Deno.stdout.write(new TextEncoder().encode("\r\x1b[K"));
    }
    logger.error(`Evaluation failed: ${error}`);
    return 1;
  }
}

function printHelp() {
  logger.debug(`
Usage: bff eval [options]

Run LLM evaluation on a dataset using a grader.

Options:
  -i, --input <file>    Input JSONL file with evaluation samples (required)
  -g, --grader <file>   Grader file with evaluation criteria (required)
  -m, --model <model>   Model to use for evaluation (default: openai/gpt-4o)
  -o, --output <file>   Output file for results (optional, defaults to console)
  -h, --help            Show this help message

Example:
  bff eval --input ./data/samples.jsonl --grader ./graders/json-validator.ts
  bff eval -i samples.jsonl -g validator.ts -m anthropic/claude-3-opus -o results.jsonl
`);
}

register(
  "eval",
  "Run LLM evaluation on a dataset",
  evalCommand,
  [],
  false, // Not AI-safe since it calls external APIs
);
