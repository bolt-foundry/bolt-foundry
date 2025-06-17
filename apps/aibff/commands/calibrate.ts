#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import { runEval } from "packages/bolt-foundry/evals/eval.ts";
import { gray, green, red } from "@std/fmt/colors";
import { stringify as stringifyToml } from "@std/toml";
import type { Command } from "./types.ts";
import {
  printParallelProgress,
  runParallelEval,
} from "../lib/parallel-eval.ts";
import { generateEvaluationHtml } from "../utils/toml-to-html.ts";
import type { EvaluationData } from "../__tests__/fixtures/test-evaluation-results.ts";

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

interface GraderResultsSection {
  grader: string;
  model: string;
  timestamp: string;
  samples: number;
  average_distance: number;
  results: Array<{
    id: string;
    grader_score: number;
    truth_score?: number;
    notes: string;
    userMessage?: string;
    assistantResponse?: string;
    graderMetadata?: Record<string, unknown>;
  }>;
}

interface OutputFile {
  graderResults: Record<string, GraderResultsSection>;
  graderOrder: Array<string>;
}

function extractGraderName(graderPath: string): string {
  // Extract grader name from path like "graders/tone-grader.deck.md" => "tone-grader"
  const fileName = graderPath.split("/").pop() || graderPath;
  return fileName.replace(/\.deck\.md$/, "");
}

function generateTimestampedFileName(baseFile: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const lastDot = baseFile.lastIndexOf(".");
  if (lastDot === -1) {
    return `${baseFile}_${timestamp}`;
  }
  const name = baseFile.substring(0, lastDot);
  const ext = baseFile.substring(lastDot);
  return `${name}_${timestamp}${ext}`;
}

async function runMultipleEvaluations(
  graderFiles: Array<string>,
  inputFile: string | undefined,
  outputFolder: string,
  models: string[],
  options: {
    concurrency: number;
    verbose?: boolean;
  },
) {
  // Create output folder if it doesn't exist
  try {
    await Deno.mkdir(outputFolder, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      printText(
        `Error creating output folder: ${
          error instanceof Error ? error.message : String(error)
        }`,
        true,
      );
      Deno.exit(1);
    }
  }

  const tomlFile = `${outputFolder}/results.toml`;
  const htmlFile = `${outputFolder}/results.html`;

  // Models are now passed as parameter, no longer from environment

  // Check for API key
  if (!getConfigVar("OPENROUTER_API_KEY")) {
    printText(
      "Error: OPENROUTER_API_KEY environment variable is required",
      true,
    );
    Deno.exit(1);
  }

  printText(
    `Running calibration with ${graderFiles.length} grader${
      graderFiles.length > 1 ? "s" : ""
    }${models.length > 1 ? ` and ${models.length} models` : ""}`,
    true,
  );
  printText(`Output folder: ${outputFolder}`, true);
  if (inputFile) {
    printText(`Using input file: ${inputFile}`, true);
  }
  printText(`Model(s): ${models.join(", ")}`, true);
  printText(
    `Concurrency: ${options.concurrency}`,
    true,
  );
  
  // Calculate total combinations
  const totalCombinations = graderFiles.length * models.length;
  if (totalCombinations > 1) {
    printText(`Total grader-model combinations: ${totalCombinations}`, true);
  }
  printText("", true);

  // Initialize grader order based on command line order
  const graderOrder = graderFiles.map(extractGraderName);
  const output: OutputFile = { graderResults: {}, graderOrder };

  if (options.concurrency === 1) {
    // Sequential implementation
    for (let i = 0; i < graderFiles.length; i++) {
      const graderFile = graderFiles[i];
      const graderName = extractGraderName(graderFile);

      printText(
        `\n[${i + 1}/${graderFiles.length}] Calibrating ${graderFile}...`,
        true,
      );

      try {
        const startTime = Date.now();
        const results = await runEval({
          graderFile,
          inputFile,
          model: models[0], // TODO: Handle multiple models properly
          verbose: options.verbose,
          onSampleComplete: (result, index, total) => {
            // Print progress to stderr
            const graderScore = result.score;
            const truthScore = result.sample.score;
            const sampleId = result.sample.id || `sample-${index + 1}`;
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

        // Calculate average distance to ground truth
        let totalDistance = 0;
        let samplesWithTruth = 0;

        const graderResultsArray = results.map((result) => {
          const graderScore = result.score;
          const truthScore = result.sample.score;
          const sampleId = result.sample.id || "unknown";

          if (truthScore !== undefined) {
            totalDistance += Math.abs(graderScore - truthScore);
            samplesWithTruth++;
          }

          return {
            id: sampleId,
            grader_score: graderScore,
            truth_score: truthScore,
            notes: result.output.reason || "",
            userMessage: result.sample.userMessage,
            assistantResponse: result.sample.assistantResponse,
            graderMetadata: result.graderMetadata,
            rawOutput: result.rawOutput,
          };
        });

        const avgDistance = samplesWithTruth > 0
          ? totalDistance / samplesWithTruth
          : 0;

        // Add to output structure
        output.graderResults[graderName] = {
          grader: graderFile,
          model: models[0], // TODO: Handle multiple models properly
          timestamp: new Date().toISOString(),
          samples: results.length,
          average_distance: Number(avgDistance.toFixed(2)),
          results: graderResultsArray,
        };

        // Print summary for this grader
        printText(`\nCompleted ${graderFile}:`, true);
        printText(`  Total samples: ${results.length}`, true);
        printText(
          `  Average distance from truth: ${avgDistance.toFixed(2)}`,
          true,
        );
        printText(
          `  Calibration time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`,
          true,
        );
      } catch (error) {
        printText(
          `Error calibrating ${graderFile}: ${
            error instanceof Error ? error.message : String(error)
          }`,
          true,
        );
        Deno.exit(1);
      }
    }
  } else {
    // Parallel implementation
    const parallelResults = await runParallelEval({
      graderFiles,
      inputFile,
      model: models[0], // TODO: Handle multiple models properly
      concurrency: options.concurrency,
      verbose: options.verbose,
      onSampleComplete: (graderFile, result, index, total) => {
        printParallelProgress(graderFile, result, index, total);
      },
      onGraderComplete: (graderFile, results) => {
        const graderName = extractGraderName(graderFile);

        // Calculate average distance to ground truth
        let totalDistance = 0;
        let samplesWithTruth = 0;

        const graderResultsArray = results.map((result) => {
          const graderScore = result.score;
          const truthScore = result.sample.score;
          const sampleId = result.sample.id || "unknown";

          if (truthScore !== undefined) {
            totalDistance += Math.abs(graderScore - truthScore);
            samplesWithTruth++;
          }

          return {
            id: sampleId,
            grader_score: graderScore,
            truth_score: truthScore,
            notes: result.output.reason || "",
            userMessage: result.sample.userMessage,
            assistantResponse: result.sample.assistantResponse,
            graderMetadata: result.graderMetadata,
            rawOutput: result.rawOutput,
          };
        });

        const avgDistance = samplesWithTruth > 0
          ? totalDistance / samplesWithTruth
          : 0;

        // Add to output structure
        output.graderResults[graderName] = {
          grader: graderFile,
          model: models[0], // TODO: Handle multiple models properly
          timestamp: new Date().toISOString(),
          samples: results.length,
          average_distance: Number(avgDistance.toFixed(2)),
          results: graderResultsArray,
        };

        // Print summary for this grader
        printText(`\nCompleted ${graderFile}:`, true);
        printText(`  Total samples: ${results.length}`, true);
        printText(
          `  Average distance from truth: ${avgDistance.toFixed(2)}`,
          true,
        );
      },
    });

    // Check for errors
    for (const result of parallelResults) {
      if (result.error) {
        printText(
          `Error calibrating ${result.graderFile}: ${result.error.message}`,
          true,
        );
        Deno.exit(1);
      }
    }
  }

  // Write output files
  try {
    // Write TOML file
    const tomlContent = stringifyToml(
      output as unknown as Record<string, unknown>,
    );
    await Deno.writeTextFile(tomlFile, tomlContent);
    
    // Write HTML file
    try {
      const htmlContent = generateEvaluationHtml(output as unknown as EvaluationData);
      await Deno.writeTextFile(htmlFile, htmlContent);
    } catch (htmlError) {
      printText(
        `Warning: Failed to generate HTML visualization: ${
          htmlError instanceof Error ? htmlError.message : String(htmlError)
        }`,
        true,
      );
    }
    
    printText(`\nResults written to:`, true);
    printText(`  TOML: ${tomlFile}`, true);
    if (await Deno.stat(htmlFile).then(() => true).catch(() => false)) {
      printText(`  HTML: ${htmlFile}`, true);
    }
  } catch (error) {
    printText(
      `Error writing output files: ${
        error instanceof Error ? error.message : String(error)
      }`,
      true,
    );
    Deno.exit(1);
  }
}

export const calibrateCommand: Command = {
  name: "calibrate",
  description: "Calibrate grader decks against sample prompts",
  run: async (args: Array<string>) => {
    // Check for help flag first
    if (args.includes("--help") || args.includes("-h")) {
      printText(
        `Usage: aibff calibrate <grader1.deck.md> [grader2.deck.md ...] [samples.jsonl|samples.toml] [--output folder] [--model model1,model2] [--verbose]

Examples:
  # Single grader with embedded samples (creates results/ folder)
  aibff calibrate grader.deck.md
  
  # Multiple graders with external samples (creates results/ folder)
  aibff calibrate grader1.deck.md grader2.deck.md samples.toml
  
  # Custom output folder
  aibff calibrate grader.deck.md --output my-calibration
  
  # Multiple models
  aibff calibrate grader.deck.md --model claude-3.5-sonnet,gpt-4,gpt-3.5-turbo
  
  # Parallel execution with custom concurrency
  aibff calibrate grader.deck.md --output my-calib --concurrency 5
  
  # Sequential mode (concurrency = 1)
  aibff calibrate grader.deck.md --concurrency 1
  
  # Show full grader prompts for debugging
  aibff calibrate grader.deck.md --verbose

Environment:
  OPENROUTER_API_KEY    Required for LLM access

Options:
  --output folder       Output folder name (default: results)
  --model model1,model2 Comma-separated list of models (default: openai/gpt-3.5-turbo)
  --concurrency N       Number of grader-model combinations to run in parallel (default: 5)
  --verbose             Show full text sent to the grader for each sample

Output:
  Creates a folder containing:
    - results.toml: Calibration results in TOML format
    - results.html: Visual report with color-coded results
`,
      );
      Deno.exit(0);
    }

    // Parse arguments
    const outputIndex = args.indexOf("--output");
    let outputFolder = "results"; // Default folder
    
    if (outputIndex !== -1) {
      if (outputIndex === args.length - 1) {
        printText("Error: --output flag requires a folder name", true);
        Deno.exit(1);
      }
      outputFolder = args[outputIndex + 1];
    }

    // Parse concurrency option
    let concurrency = 5; // default

    const concurrencyIndex = args.indexOf("--concurrency");
    if (concurrencyIndex !== -1 && concurrencyIndex < args.length - 1) {
      concurrency = parseInt(args[concurrencyIndex + 1]);
      if (isNaN(concurrency) || concurrency < 1) {
        printText("Error: --concurrency must be a positive number", true);
        Deno.exit(1);
      }
    }

    // Parse verbose option
    const verbose = args.includes("--verbose");

    // Parse model option
    let models: string[] = ["openai/gpt-3.5-turbo"]; // default
    const modelIndex = args.indexOf("--model");
    if (modelIndex !== -1 && modelIndex < args.length - 1) {
      const modelArg = args[modelIndex + 1];
      models = modelArg.split(",").map(m => m.trim()).filter(m => m.length > 0);
      if (models.length === 0) {
        printText("Error: --model requires at least one model name", true);
        Deno.exit(1);
      }
    }

    // Remove all flags from args
    const filteredArgs = args.filter((arg, i) => {
      if (arg === "--output" || (i > 0 && args[i - 1] === "--output")) {
        return false;
      }
      if (
        arg === "--concurrency" || (i > 0 && args[i - 1] === "--concurrency")
      ) return false;
      if (arg === "--verbose") return false;
      if (arg === "--model" || (i > 0 && args[i - 1] === "--model")) return false;
      return true;
    });

    // Determine graders and input file
    let graderFiles: Array<string> = [];
    let inputFile: string | undefined;

    // Check if last argument is a samples file (ends with .jsonl or .toml but not .deck.md)
    const lastArg = filteredArgs[filteredArgs.length - 1];
    if (
      lastArg && (
        lastArg.endsWith(".jsonl") ||
        (lastArg.endsWith(".toml") && !lastArg.endsWith(".deck.md"))
      )
    ) {
      inputFile = lastArg;
      graderFiles = filteredArgs.slice(0, -1);
    } else {
      graderFiles = filteredArgs;
    }

    if (graderFiles.length === 0) {
      printText("Error: At least one grader file is required", true);
      Deno.exit(1);
    }

    // Run evaluations
    await runMultipleEvaluations(graderFiles, inputFile, outputFolder, models, {
      concurrency,
      verbose,
    });
  },
};

// Support direct execution for backward compatibility
if (import.meta.main) {
  await calibrateCommand.run(Deno.args);
}