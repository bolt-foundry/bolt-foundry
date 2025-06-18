#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import { runEval } from "packages/bolt-foundry/evals/eval.ts";
import { gray, green, red } from "@std/fmt/colors";
import { stringify as stringifyToml } from "@std/toml";
import type { Command } from "./types.ts";
import {
  runSampleLevelParallelEval,
} from "../lib/sample-parallel-eval.ts";
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

// Result for a single model evaluation
interface ModelResultsSection {
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
    rawOutput?: string;
  }>;
}

// Grader results always have nested structure
interface GraderResultsSection {
  grader: string;
  models: Record<string, ModelResultsSection>;
}

// Output file structure
interface OutputFile {
  graderResults: Record<string, GraderResultsSection>;
  graderOrder: Array<string>;
}

function extractGraderName(graderPath: string): string {
  // Extract grader name from path like "graders/tone-grader.deck.md" => "tone-grader"
  const fileName = graderPath.split("/").pop() || graderPath;
  return fileName.replace(/\.deck\.md$/, "");
}

function shortenModelName(model: string): string {
  // Convert model names to shorter versions for display
  // "anthropic/claude-3.5-sonnet" => "claude-3.5"
  // "openai/gpt-4" => "gpt-4"
  const parts = model.split("/");
  const modelName = parts[parts.length - 1];
  
  // Remove common suffixes
  return modelName
    .replace(/-sonnet$/, "")
    .replace(/-turbo$/, "")
    .replace(/-preview$/, "");
}

function _generateTimestampedFileName(baseFile: string): string {
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
  models: Array<string>,
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
  
  // Initialize grader sections
  for (const graderFile of graderFiles) {
    const graderName = extractGraderName(graderFile);
    output.graderResults[graderName] = {
      grader: graderFile,
      models: {},
    };
  }

  // Create all grader-model combinations
  const combinations: Array<{ grader: string; model: string }> = [];
  for (const graderFile of graderFiles) {
    for (const model of models) {
      combinations.push({ grader: graderFile, model });
    }
  }

  if (options.concurrency === 1) {
    // Sequential implementation
    let combinationIndex = 0;
    for (const { grader: graderFile, model } of combinations) {
      combinationIndex++;
      const graderName = extractGraderName(graderFile);
      const modelShortName = shortenModelName(model);

      printText(
        `\n[${combinationIndex}/${combinations.length}] Calibrating ${graderName} with ${model}...`,
        true,
      );

      try {
        const startTime = Date.now();
        const results = await runEval({
          graderFile,
          inputFile,
          model,
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

        // Add to output structure - store under the model key
        output.graderResults[graderName].models[modelShortName] = {
          model,
          timestamp: new Date().toISOString(),
          samples: results.length,
          average_distance: Number(avgDistance.toFixed(2)),
          results: graderResultsArray,
        };

        // Print summary for this grader-model combination
        printText(`\nCompleted ${graderName} with ${model}:`, true);
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
          `Error calibrating ${graderName} with ${model}: ${
            error instanceof Error ? error.message : String(error)
          }`,
          true,
        );
        Deno.exit(1);
      }
    }
  } else {
    // Parallel implementation with sample-level parallelism
    printText(`Starting parallel execution with ${options.concurrency} workers`, true);
    
    // Prepare results storage
    const resultsMap = new Map<string, Array<{
      id: string;
      grader_score: number;
      truth_score?: number;
      notes: string;
      userMessage?: string;
      assistantResponse?: string;
      graderMetadata?: Record<string, unknown>;
      rawOutput?: string;
    }>>();
    
    // Initialize results map for each grader-model combination
    for (const { grader: graderFile, model } of combinations) {
      const graderName = extractGraderName(graderFile);
      const modelShortName = shortenModelName(model);
      const key = `${graderName}:${modelShortName}`;
      resultsMap.set(key, []);
    }
    
    // Track last update time for periodic file writes
    let lastUpdateTime = Date.now();
    const UPDATE_INTERVAL_MS = 5000; // 5 seconds
    const UPDATE_SAMPLE_COUNT = 10; // or every 10 samples
    let samplesSinceLastUpdate = 0;
    
    // Function to update files
    const updateFiles = () => {
      // Build output structure from current results
      for (const [key, results] of resultsMap.entries()) {
        const [graderName, modelShortName] = key.split(':');
        const _graderFile = graderFiles.find(f => extractGraderName(f) === graderName)!;
        const model = models.find(m => shortenModelName(m) === modelShortName)!;
        
        if (results.length > 0) {
          // Calculate average distance
          let totalDistance = 0;
          let samplesWithTruth = 0;
          
          for (const result of results) {
            if (result.truth_score !== undefined) {
              totalDistance += Math.abs(result.grader_score - result.truth_score);
              samplesWithTruth++;
            }
          }
          
          const avgDistance = samplesWithTruth > 0
            ? totalDistance / samplesWithTruth
            : 0;
          
          output.graderResults[graderName].models[modelShortName] = {
            model,
            timestamp: new Date().toISOString(),
            samples: results.length,
            average_distance: Number(avgDistance.toFixed(2)),
            results,
          };
        }
      }
      
      // Write files
      try {
        const tomlContent = stringifyToml(
          output as unknown as Record<string, unknown>,
        );
        Deno.writeTextFileSync(tomlFile, tomlContent);
        
        try {
          const htmlContent = generateEvaluationHtml(output as unknown as EvaluationData);
          Deno.writeTextFileSync(htmlFile, htmlContent);
        } catch (_htmlError) {
          // Ignore HTML errors during intermediate updates
        }
      } catch (error) {
        printText(
          `Warning: Failed to update output files: ${
            error instanceof Error ? error.message : String(error)
          }`,
          true,
        );
      }
      
      lastUpdateTime = Date.now();
      samplesSinceLastUpdate = 0;
    };
    
    // Run sample-level parallel evaluation
    const startTime = Date.now();
    const { totalSamples, completedSamples, failedSamples } = await runSampleLevelParallelEval({
      graderFiles,
      models,
      inputFile,
      concurrency: options.concurrency,
      verbose: options.verbose,
      onSampleComplete: (queueItem, result, completed, total) => {
        const graderName = extractGraderName(queueItem.graderFile);
        const modelShortName = shortenModelName(queueItem.model);
        const key = `${graderName}:${modelShortName}`;
        
        // Store result
        const graderResult = {
          id: result.sample.id || `sample-${queueItem.sampleIndex + 1}`,
          grader_score: result.score,
          truth_score: result.sample.score,
          notes: result.output.reason || "",
          userMessage: result.sample.userMessage,
          assistantResponse: result.sample.assistantResponse,
          graderMetadata: result.graderMetadata,
          rawOutput: result.rawOutput,
        };
        
        resultsMap.get(key)!.push(graderResult);
        
        // Print progress
        const progress = `[${completed}/${total}]`;
        const sampleId = result.sample.id || `sample-${queueItem.sampleIndex + 1}`;
        
        if (result.sample.score !== undefined) {
          const agree = result.score === result.sample.score;
          const symbol = agree ? "✓" : "✗";
          const message =
            `${progress} ${symbol} ${graderName}/${modelShortName}/${sampleId}: grader=${result.score}, truth=${result.sample.score}`;
          const coloredMessage = agree ? green(message) : red(message);
          printText(coloredMessage, true);
        } else {
          const message =
            `${progress} - ${graderName}/${modelShortName}/${sampleId}: grader=${result.score}, truth=N/A`;
          printText(gray(message), true);
        }
        
        // Check if we should update files
        samplesSinceLastUpdate++;
        const timeSinceLastUpdate = Date.now() - lastUpdateTime;
        
        if (samplesSinceLastUpdate >= UPDATE_SAMPLE_COUNT || timeSinceLastUpdate >= UPDATE_INTERVAL_MS) {
          updateFiles();
        }
      },
      onError: (queueItem, error, retryCount) => {
        const graderName = extractGraderName(queueItem.graderFile);
        const modelShortName = shortenModelName(queueItem.model);
        const sampleId = queueItem.sampleIndex + 1;
        
        if (retryCount < 3) {
          printText(
            red(`Retry ${retryCount}/3 for ${graderName}/${modelShortName}/sample-${sampleId}: ${error.message}`),
            true,
          );
        } else {
          printText(
            red(`Failed after 3 retries: ${graderName}/${modelShortName}/sample-${sampleId}: ${error.message}`),
            true,
          );
        }
      },
    });
    
    // Final file update
    updateFiles();
    
    // Print final summary
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    printText(`\nCompleted parallel calibration:`, true);
    printText(`  Total samples processed: ${completedSamples}/${totalSamples}`, true);
    if (failedSamples > 0) {
      printText(`  Failed samples: ${failedSamples}`, true);
    }
    printText(`  Total time: ${elapsedTime}s`, true);
    printText(`  Average time per sample: ${(parseFloat(elapsedTime) / completedSamples).toFixed(2)}s`, true);
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
  --model model1,model2 Comma-separated list of models (default: openai/gpt-4o)
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
    let models: Array<string> = ["openai/gpt-4o"]; // default
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
