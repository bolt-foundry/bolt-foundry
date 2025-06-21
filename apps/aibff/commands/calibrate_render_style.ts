#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net

import { stringify as stringifyToml } from "@std/toml";
import { parseArgs } from "@std/cli/parse-args";
import type { Command } from "./types.ts";
import {
  type EvaluationDataNested,
  generateEvaluationHtml,
  type GraderResults,
} from "../utils/toml-to-html.ts";
import {
  extractContextFromMarkdown,
  extractSamplesFromMarkdown,
  renderDeck,
} from "./render.ts";
import type { Sample } from "./render.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// UI helper (to be extracted later)
const ui = {
  // deno-lint-ignore no-console
  printLn: (msg: string) => console.log(msg),
  // deno-lint-ignore no-console
  printWarn: (msg: string) => console.warn(msg),
  // deno-lint-ignore no-console
  printErr: (msg: string) => console.error(msg),
};

// Import ExtractedContext type
interface ExtractedContext {
  [variableName: string]: {
    assistantQuestion: string;
    default?: unknown;
    description?: string;
    type?: string;
    sourceFile?: string;
    [key: string]: unknown;
  };
}
import {
  getModelPricing,
  sendToOpenRouterWithDetails,
} from "../lib/openrouter-client.ts";
import type { OpenRouterMessage } from "../lib/openrouter-client.ts";

// Minimal types for output structure

interface GraderResult {
  id: string;
  grader_score: number;
  truth_score: number;
  notes: string;
  userMessage: string;
  assistantResponse: string;
  graderInput?: string;
  graderResponse?: string;
  graderMetadata?: Record<string, unknown>;
  rawOutput?: string;
  latencyMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  totalCost?: number;
}

interface OutputFile {
  results: Array<GraderResult>;
  model: string;
  timestamp: string;
}

// Send request to OpenRouter API
async function sendToAI(
  messages: Array<OpenRouterMessage>,
  model: string,
): Promise<{
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  totalCost?: number;
}> {
  try {
    const response = await sendToOpenRouterWithDetails({
      model,
      messages,
      temperature: 0.0,
      max_tokens: 1000,
    });
    return response;
  } catch (error) {
    // Log error but return a minimal error response
    logger.debug("OpenRouter API error:", error);
    return { content: "(call failed)" };
  }
}

// Parse grader response to extract score and reason
function parseGraderResponse(
  response: string,
): { score: number; reason: string } {
  try {
    // First try to parse as JSON
    const parsed = JSON.parse(response.trim());

    // Validate the response has a score
    if (typeof parsed.score === "number") {
      return {
        score: parsed.score,
        reason: parsed.reason || "",
      };
    }

    // If no valid score in JSON, fall back to legacy behavior
    throw new Error("No valid score in JSON response");
  } catch (_error) {
    // Fall back to parsing as a simple number (legacy behavior)
    const score = parseFloat(response.trim());

    if (!isNaN(score)) {
      return {
        score: score,
        reason: "Legacy numeric response",
      };
    }

    // If all parsing fails, return 0 with error message
    return {
      score: 0,
      reason: `Failed to parse grader response: ${
        response.substring(0, 100)
      }...`,
    };
  }
}

// New evaluation function with Set-based concurrency control
async function runEvaluationWithConcurrency(
  deckPath: string,
  samples: Array<Sample>,
  models: Array<string>,
  concurrency: number,
  openAiCompletionOptions: Record<string, unknown> = {},
  _extractedContext: ExtractedContext,
  contextValues: Record<string, unknown>,
): Promise<Array<OutputFile>> {
  // Create a shared concurrency pool for all models
  const activeRequests = new Set<Promise<void>>();

  // Store results for each model
  const modelResults = new Map<string, Array<GraderResult>>();
  for (const model of models) {
    modelResults.set(model, []);
  }

  ui.printLn(
    `Evaluating ${samples.length} samples across ${models.length} model(s) with concurrency ${concurrency}...`,
  );

  // Create all evaluation tasks for all models and samples
  const evaluationTasks: Array<{
    model: string;
    sampleIndex: number;
    task: () => Promise<void>;
  }> = [];

  // Create tasks for all model-sample combinations (interleaved)
  for (let index = 0; index < samples.length; index++) {
    for (const model of models) {
      const sample = samples[index];
      const taskIndex = index;

      evaluationTasks.push({
        model,
        sampleIndex: index,
        task: async () => {
          try {
            // Build context for this specific sample
            const sampleContext = {
              ...contextValues,
              userMessage: sample.input,
              assistantResponse: sample.expected,
            };

            // Render the deck with the sample context
            const sampleRequest = renderDeck(
              deckPath,
              sampleContext,
              openAiCompletionOptions,
            );
            const graderMessages = sampleRequest.messages;

            // Create the OpenRouter/OpenAI API request format
            // Include all OpenAI options from the rendered deck
            const graderRequest = {
              model: model,
              messages: graderMessages,
              temperature: 0.0,
              max_tokens: 1000,
              // Include any additional options from the deck
              ...openAiCompletionOptions,
            };

            const graderInput = JSON.stringify(graderRequest, null, 2);

            ui.printLn(
              `[${model}] Processing sample ${
                taskIndex + 1
              }/${samples.length}: ${sample.id}`,
            );
            const startTime = Date.now();
            const response = await sendToAI(
              graderMessages as Array<OpenRouterMessage>,
              model,
            );
            const latencyMs = Date.now() - startTime;

            const parsedResponse = parseGraderResponse(response.content);
            const result = {
              id: sample.id,
              grader_score: parsedResponse.score,
              truth_score: sample.score !== undefined ? sample.score : 1, // Use sample score if available
              notes: parsedResponse.reason,
              userMessage: sample.input,
              assistantResponse: sample.expected, // In real implementation, this would be the actual assistant response
              graderInput: graderInput,
              graderResponse: response.content,
              // Also include in the format expected by the HTML generator
              graderMetadata: {
                verbosePrompt: graderInput,
              },
              rawOutput: response.content,
              latencyMs: latencyMs,
              promptTokens: response.usage?.prompt_tokens,
              completionTokens: response.usage?.completion_tokens,
              totalTokens: response.usage?.total_tokens,
              totalCost: response.totalCost,
            };

            modelResults.get(model)!.push(result);
          } catch (error) {
            logger.debug(
              `[${model}] Error processing sample ${sample.id}:`,
              error,
            );
            const errorResult = {
              id: sample.id,
              grader_score: 0,
              truth_score: sample.score !== undefined ? sample.score : 0,
              notes: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
              userMessage: sample.input,
              assistantResponse: "",
              graderInput: "",
              graderResponse: "",
              latencyMs: 0,
            };
            modelResults.get(model)!.push(errorResult);
          }
        },
      });
    }
  }

  // Process all tasks with concurrency control
  for (const { task } of evaluationTasks) {
    // Wait if we're at concurrency limit
    if (activeRequests.size >= concurrency) {
      await Promise.race(activeRequests);
    }

    // Create and track the request
    const promise = task().then(() => {
      activeRequests.delete(promise);
    });

    activeRequests.add(promise);
  }

  // Wait for all remaining requests
  await Promise.all(activeRequests);

  // Build final results
  const allResults: Array<OutputFile> = [];
  for (const model of models) {
    const results = modelResults.get(model)!;

    // Sort results by sample ID to maintain consistent ordering
    results.sort((a, b) => {
      const aIndex = samples.findIndex((s) => s.id === a.id);
      const bIndex = samples.findIndex((s) => s.id === b.id);
      return aIndex - bIndex;
    });

    // Calculate average score for logging
    const averageScore = results.reduce((sum, r) => sum + r.grader_score, 0) /
      results.length;
    ui.printLn(
      `[${model}] Completed evaluation. Average score: ${
        averageScore.toFixed(2)
      }`,
    );

    allResults.push({
      results,
      model,
      timestamp: new Date().toISOString(),
    });
  }

  return allResults;
}

interface CalibrateOptions {
  concurrency: number;
  model: string;
  format: "toml" | "html";
  output?: string;
}

async function runCalibrate(
  deckPath: string,
  options: CalibrateOptions,
): Promise<Array<OutputFile>> {
  // 1. Read deck
  const deckText = await Deno.readTextFile(deckPath);

  // 2. Extract samples from embedded TOML files
  const samples = extractSamplesFromMarkdown(deckText, deckPath);

  // Check if we found any samples
  if (samples.length === 0) {
    ui.printErr("Error: No samples found in deck or embedded TOML files");
    ui.printErr(
      "The deck must include samples for calibration using ![description](samples.toml) syntax",
    );
    Deno.exit(1);
  }

  // 3. Parse models from comma-separated list
  const models = options.model.split(",").map((m) => m.trim());

  // Start prefetching model pricing for all models
  ui.printLn("Fetching model pricing information...");
  const pricingPromises = models.map((model) => getModelPricing(model));

  // 4. Extract context from markdown (including TOML files)
  const extractedContext = extractContextFromMarkdown(deckText, deckPath);

  // 5. Build context values using defaults from extracted context
  const contextValues: Record<string, unknown> = {};
  for (const [key, definition] of Object.entries(extractedContext)) {
    if (definition.default !== undefined) {
      contextValues[key] = definition.default;
    }
  }

  // 6. Set OpenAI completion options
  const openAiCompletionOptions = {
    temperature: 0.0,
    max_tokens: 1000,
  };

  // 7. Run evaluation with new function
  const allResults = await runEvaluationWithConcurrency(
    deckPath,
    samples,
    models,
    options.concurrency,
    openAiCompletionOptions,
    extractedContext,
    contextValues,
  );

  // Ensure pricing is cached before calculating costs
  await Promise.all(pricingPromises);

  return allResults;
}

export const calibrateCommand: Command = {
  name: "calibrate",
  description: "Calibrate AI models against test samples",
  run: async (args: Array<string>) => {
    // Parse arguments using Deno's standard library
    const flags = parseArgs(args, {
      string: ["model", "format", "output", "concurrency"],
      boolean: ["help"],
      alias: {
        h: "help",
        m: "model",
        f: "format",
        o: "output",
        c: "concurrency",
      },
      default: {
        model: "gpt-4",
        format: "html",
        concurrency: "5",
      },
    });

    // Show help if requested or no arguments
    if (flags.help || flags._.length === 0) {
      ui.printErr(`Usage: aibff calibrate <deck.md> [<deck2.md> ...] [options]

Options:
  -m, --model <models>      Comma-separated list of models (default: gpt-4)
  -c, --concurrency <n>     Number of concurrent requests (default: 5)
  -f, --format <format>     Output format: toml or html (default: html)
  -o, --output <dir>        Output directory (default: current directory)
  -h, --help                Show this help message

Examples:
  aibff calibrate deck.md
  aibff calibrate deck.md deck2.md --model gpt-4,gpt-3.5-turbo
  aibff calibrate deck.md -c 10 -f html
  aibff calibrate deck.md --output results/calibration`);
      return;
    }

    // Support multiple deck files
    const deckPaths = flags._.map((p) => String(p));

    // Validate format
    if (flags.format !== "toml" && flags.format !== "html") {
      ui.printErr("Error: Format must be 'toml' or 'html'");
      Deno.exit(1);
    }

    // Parse and validate concurrency
    const concurrency = parseInt(flags.concurrency, 10);
    if (isNaN(concurrency) || concurrency < 1) {
      ui.printErr("Error: Concurrency must be a positive number");
      Deno.exit(1);
    }

    const options: CalibrateOptions = {
      concurrency,
      model: flags.model,
      format: flags.format as "toml" | "html",
      output: flags.output,
    };

    try {
      // Process all graders simultaneously
      const allGraderResults: Record<string, GraderResults> = {};
      const graderOrder: Array<string> = [];

      // Extract grader names first to maintain order
      for (const deckPath of deckPaths) {
        const graderName = deckPath.split("/").pop()?.replace(".deck.md", "") ||
          "grader";
        graderOrder.push(graderName);
      }

      ui.printLn(
        `Processing ${deckPaths.length} grader(s) simultaneously...`,
      );

      // Run all graders in parallel
      const graderPromises = deckPaths.map(async (deckPath) => {
        const graderName = deckPath.split("/").pop()?.replace(".deck.md", "") ||
          "grader";
        logger.debug(`Starting grader: ${graderName}`);

        const graderResults = await runCalibrate(deckPath, options);

        return {
          graderName,
          deckPath,
          results: graderResults,
        };
      });

      // Wait for all graders to complete
      const allGraderPromiseResults = await Promise.all(graderPromises);

      // Structure results for HTML generator compatibility
      for (const { graderName, deckPath, results } of allGraderPromiseResults) {
        allGraderResults[graderName] = {
          grader: deckPath,
          models: {},
        };

        // Add each model's results
        for (const modelResult of results) {
          const modelShortName = modelResult.model.split("/").pop() ||
            modelResult.model;

          // Calculate average distance, latency, and token usage for this model's results
          const avgDistance = modelResult.results.reduce((sum, r) => {
            return sum + Math.abs(r.grader_score - (r.truth_score ?? 0));
          }, 0) / modelResult.results.length;

          const avgLatency = modelResult.results.reduce((sum, r) => {
            return sum + (r.latencyMs ?? 0);
          }, 0) / modelResult.results.length;

          const avgPromptTokens = modelResult.results.reduce((sum, r) => {
            return sum + (r.promptTokens ?? 0);
          }, 0) / modelResult.results.length;

          const avgCompletionTokens = modelResult.results.reduce((sum, r) => {
            return sum + (r.completionTokens ?? 0);
          }, 0) / modelResult.results.length;

          const avgTotalTokens = modelResult.results.reduce((sum, r) => {
            return sum + (r.totalTokens ?? 0);
          }, 0) / modelResult.results.length;

          // Calculate total cost across all samples
          const totalCost = modelResult.results.reduce((sum, r) => {
            return sum + (r.totalCost ?? 0);
          }, 0);

          allGraderResults[graderName].models[modelShortName] = {
            model: modelResult.model,
            timestamp: modelResult.timestamp,
            samples: modelResult.results.length,
            average_distance: avgDistance,
            average_latency: avgLatency,
            average_prompt_tokens: avgPromptTokens,
            average_completion_tokens: avgCompletionTokens,
            average_total_tokens: avgTotalTokens,
            total_cost: totalCost,
            results: modelResult.results,
          };
        }
      }

      // Write combined results
      const outputDir = options.output || ".";
      if (outputDir !== ".") {
        await Deno.mkdir(outputDir, { recursive: true });
      }

      if (options.format === "toml") {
        // For TOML, keep separate files per grader-model combination
        for (
          const [graderName, graderData] of Object.entries(allGraderResults)
        ) {
          for (
            const [modelName, modelData] of Object.entries(
              graderData.models,
            )
          ) {
            const filename = deckPaths.length > 1 || flags.model.includes(",")
              ? `${graderName}-${modelName.replace(/\//g, "-")}-results.toml`
              : "results.toml";
            const outputPath = `${outputDir}/${filename}`;
            const tomlContent = stringifyToml(
              modelData as unknown as Record<string, unknown>,
            );
            await Deno.writeTextFile(outputPath, tomlContent);
            ui.printLn(`Results written to: ${outputPath}`);
          }
        }
      } else {
        // For HTML, create a single file with all results
        const evaluationData = {
          graderResults: allGraderResults,
          graderOrder,
        };
        const htmlContent = generateEvaluationHtml(
          evaluationData as EvaluationDataNested,
        );
        const outputPath = `${outputDir}/results.html`;
        await Deno.writeTextFile(outputPath, htmlContent);
        ui.printLn(`Results written to: ${outputPath}`);
      }
    } catch (error) {
      ui.printErr(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      Deno.exit(1);
    }
  },
};

// Support direct execution
if (import.meta.main) {
  await calibrateCommand.run(Deno.args);
}
