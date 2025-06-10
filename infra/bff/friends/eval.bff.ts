#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { runEval } from "packages/bolt-foundry/evals/eval.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { parse as parseToml } from "@std/toml";

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
  const args: Record<string, string | Record<string, unknown>> = {};
  const contextVars: Record<string, unknown> = {};
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
    } else if (arg === "--context" || arg === "-c") {
      // Support multiple formats:
      // --context key=value
      // --context '{"key": "value"}'
      // --context @file.json
      i++;
      if (i < options.length) {
        const contextArg = options[i];
        if (contextArg.startsWith("@")) {
          // Load from file
          try {
            const filePath = contextArg.slice(1);
            const fileContent = await Deno.readTextFile(filePath);

            let fileContext: Record<string, unknown>;

            // Determine file type and parse accordingly
            if (filePath.endsWith(".toml")) {
              // Parse TOML file
              const tomlData = parseToml(fileContent) as Record<
                string,
                unknown
              >;

              // If the TOML has a 'context' or 'contexts' section, use that
              // Otherwise use the whole file as context
              if (tomlData.context && typeof tomlData.context === "object") {
                fileContext = tomlData.context as Record<string, unknown>;
              } else if (
                tomlData.contexts && typeof tomlData.contexts === "object"
              ) {
                // Extract just the values from contexts (not the full context definitions)
                fileContext = {};
                for (
                  const [key, value] of Object.entries(
                    tomlData.contexts as Record<string, unknown>,
                  )
                ) {
                  if (
                    value && typeof value === "object" && "default" in value
                  ) {
                    fileContext[key] = value.default;
                  } else if (
                    value && typeof value === "object" && "value" in value
                  ) {
                    fileContext[key] = value.value;
                  }
                }
              } else {
                fileContext = tomlData;
              }
            } else {
              // Default to JSON parsing
              fileContext = JSON.parse(fileContent);
            }

            Object.assign(contextVars, fileContext);
          } catch (error) {
            logger.error(`Failed to load context from file: ${error}`);
            return 1;
          }
        } else if (contextArg.startsWith("{")) {
          // JSON format
          try {
            const jsonContext = JSON.parse(contextArg);
            Object.assign(contextVars, jsonContext);
          } catch (error) {
            logger.error(`Invalid JSON context: ${error}`);
            return 1;
          }
        } else if (contextArg.includes("=")) {
          // key=value format
          const [key, ...valueParts] = contextArg.split("=");
          let value: unknown = valueParts.join("="); // Handle values with = in them

          // Try to parse as number or boolean
          if (value === "true") {
            value = true;
          } else if (value === "false") {
            value = false;
          } else if (!isNaN(Number(value)) && value !== "") {
            value = Number(value);
          }

          contextVars[key] = value;
        } else {
          logger.error(`Invalid context format: ${contextArg}`);
          logger.error(
            'Use: --context key=value, --context \'{"key":"value"}\', --context @file.json, or --context @file.toml',
          );
          return 1;
        }
      }
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

  // Add context to args if any were provided
  if (Object.keys(contextVars).length > 0) {
    args.context = contextVars;
  }

  // Validate required arguments
  if (!args.graderFile) {
    logger.error("Missing required argument: --grader");
    printHelp();
    return 1;
  }

  // Set default model if not provided
  if (!args.model) {
    args.model = "openai/gpt-4o";
  }

  logger.debug(`Running evaluation...`);
  if (args.inputFile) {
    logger.debug(`Input: ${args.inputFile}`);
  }
  logger.debug(`Grader: ${args.graderFile as string}`);
  logger.debug(`Model: ${args.model as string}`);
  if (args.context) {
    logger.debug(`Context: ${JSON.stringify(args.context)}`);
  }

  // Show evaluation configuration
  printLine("\nEvaluation Configuration:");
  const config: Record<string, string> = {
    "Grader File": args.graderFile as string,
    "Model": args.model as string,
    "Output": (args.outputFile as string) || "Console",
  };
  if (args.inputFile) {
    config["Input File"] = args.inputFile as string;
  } else {
    config["Input Source"] = "Embedded in grader deck";
  }
  if (args.context) {
    config["Context Variables"] = JSON.stringify(args.context);
  }
  printTable(config);

  const stopSpinner = startSpinner();

  try {
    // Run the evaluation
    const results = await runEval({
      inputFile: args.inputFile as string | undefined,
      graderFile: args.graderFile as string,
      model: args.model as string,
      context: args.context as Record<string, unknown> | undefined,
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
  -i, --input <file>    Input JSONL file with evaluation samples (optional)
                        If not provided, samples must be embedded in the grader deck
  -g, --grader <file>   Grader file with evaluation criteria (required)
                        Supports both .ts and .md files with optional TOML embeds
  -m, --model <model>   Model to use for evaluation (default: openai/gpt-4o)
  -o, --output <file>   Output file for results (optional, defaults to console)
  -c, --context <var>   Provide context variables (can be used multiple times)
                        Formats: key=value, '{"key":"value"}', @file.json, or @file.toml
  -h, --help            Show this help message

Examples:
  # With separate input file
  bff eval --input ./data/samples.jsonl --grader ./graders/json-validator.ts
  
  # With self-contained grader deck (samples embedded via TOML)
  bff eval --grader ./graders/writing-quality.md -m gpt-4o-mini
  
  # With context variables
  bff eval --grader grader.md --context maxLength=500 --context style=formal
  bff eval --grader grader.md --context '{"maxLength":500,"style":"formal"}'
  bff eval --grader grader.md --context @context.json
  bff eval --grader grader.md --context @context.toml
  
  # With output file
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
