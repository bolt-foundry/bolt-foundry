#!/usr/bin/env -S deno run -A

import { makeDeckBuilder } from "../builders/builders.ts";
import type { DeckBuilder } from "../builders/builders.ts";

// Hardcoded API key for testing
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Define types for our eval runner
interface EvalResult {
  model: string;
  iteration: number;
  success: boolean;
  output?: any;
  error?: string;
  latency: number;
  // Post-processing results
  parsed?: any;
  validations?: {
    [key: string]: {
      passed: boolean;
      message?: string;
    };
  };
  postProcessError?: string;
}

interface EvalConfig {
  deck: DeckBuilder;
  models: string[];
  iterations?: number;
  context: Record<string, any>;
  postProcess?: (result: EvalResult) => Promise<EvalResult> | EvalResult;
}

// OpenRouter model type
interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

// Simple logger that collects errors
class ErrorLogger {
  private errors: Array<{ model: string; iteration: number; error: string }> =
    [];

  log(model: string, iteration: number, error: string) {
    this.errors.push({ model, iteration, error });
    console.error(`[${model}:${iteration}] ${error}`);
  }

  getErrors() {
    return this.errors;
  }
}

// Call OpenRouter API using OpenAI format
async function callOpenRouter(
  params: any, // ChatCompletionCreateParams from deck.render()
  logger: ErrorLogger,
  iteration: number,
): Promise<{ response?: string; error?: string; latency: number }> {
  const startTime = Date.now();
  const model = params.model;

  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bolt-foundry.com",
        "X-Title": "Bolt Foundry Evals",
      },
      body: JSON.stringify(params), // Pass the entire params object from render()
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.text();
      let errorDetails = error;

      // Try to parse error for more details
      try {
        const errorObj = JSON.parse(error);
        if (errorObj.error?.metadata?.raw) {
          const innerError = JSON.parse(errorObj.error.metadata.raw);
          errorDetails = `${errorObj.error.message} - ${
            innerError.error?.message || "Unknown error"
          }`;
        }
      } catch {}

      logger.log(
        model,
        iteration,
        `API error: ${response.status} - ${errorDetails}`,
      );
      return { error: errorDetails, latency };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      const error = "No content in response";
      logger.log(model, iteration, error);
      return { error, latency };
    }

    return { response: content, latency };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.log(model, iteration, `Network error: ${errorMsg}`);
    return { error: errorMsg, latency: Date.now() - startTime };
  }
}

// Fetch available models from OpenRouter
async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching OpenRouter models:", error);
    return [];
  }
}

// Model filter options
interface ModelFilterOptions {
  maxPrice?: number;
  excludeInstruct?: boolean;
  excludeFree?: boolean;
  excludePatterns?: string[];
  includePatterns?: string[];
  minContextLength?: number;
}

// Get random models from OpenRouter with filtering
async function getRandomModels(
  count: number = 3,
  options: ModelFilterOptions = {},
): Promise<string[]> {
  const {
    maxPrice = 0.01,
    excludeInstruct = true,
    excludeFree = true,
    excludePatterns = [],
    includePatterns = [],
    minContextLength = 0,
  } = options;

  const models = await fetchOpenRouterModels();

  if (models.length === 0) {
    console.warn("No models fetched, using defaults");
    return ["gpt-4", "claude-3-opus-20240229", "mistral-large"];
  }

  // Apply filters
  let filteredModels = models.filter((m) => {
    const promptPrice = parseFloat(m.pricing.prompt);
    const modelId = m.id.toLowerCase();

    // Price filter
    if (promptPrice > maxPrice) return false;

    // Exclude free models if requested
    if (excludeFree && promptPrice === 0) return false;

    // Context length filter
    if (m.context_length < minContextLength) return false;

    // Exclude instruct models (unless explicitly requested)
    if (
      excludeInstruct && (
        modelId.includes("instruct") ||
        modelId.includes("-it") ||
        modelId.includes("inst")
      )
    ) return false;

    // Exclude known problematic models
    const problematicModels = [
      "maestro-reasoning", // Has special input requirements
      "deepseek-r1", // May require special formatting
      "eva-unit-01", // Requires prompt training/data policy acceptance
      "eva-llama", // Requires prompt training/data policy acceptance
      "perplexity", // May require prompt training
      "sonar", // May require prompt training
      "devstral", // Requires prompt training/data policy acceptance
      "agentica", // Requires prompt training/data policy acceptance
      "deepcoder", // Requires prompt training/data policy acceptance
    ];
    for (const problematic of problematicModels) {
      if (modelId.includes(problematic)) return false;
    }

    // Exclude patterns
    for (const pattern of excludePatterns) {
      if (modelId.includes(pattern.toLowerCase())) return false;
    }

    // Include patterns (if specified, only include models matching these)
    if (includePatterns.length > 0) {
      let matches = false;
      for (const pattern of includePatterns) {
        if (modelId.includes(pattern.toLowerCase())) {
          matches = true;
          break;
        }
      }
      if (!matches) return false;
    }

    return true;
  });

  // Fallback if no models match filters
  if (filteredModels.length === 0) {
    console.warn("No models match filters, relaxing price constraint");
    filteredModels = models.filter((m) =>
      !m.id.toLowerCase().includes("instruct")
    );
  }

  // Shuffle and pick random models
  const shuffled = [...filteredModels].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, filteredModels.length));

  console.log("\n=== Selected Models ===");
  console.log(
    `(Filtered ${models.length} models down to ${filteredModels.length})`,
  );
  selected.forEach((m) => {
    console.log(`- ${m.id} (${m.name})`);
    console.log(`  Context: ${m.context_length} tokens`);
    console.log(
      `  Price: $${m.pricing.prompt}/1K prompt, $${m.pricing.completion}/1K completion`,
    );
  });

  return selected.map((m) => m.id);
}

// Main eval runner
async function runEvals(config: EvalConfig): Promise<EvalResult[]> {
  const { deck, models, iterations = 1, context } = config;
  const logger = new ErrorLogger();

  console.log(
    `\nStarting parallel evaluation of ${models.length} models × ${iterations} iterations = ${
      models.length * iterations
    } total runs...\n`,
  );

  // Create all evaluation promises
  const evalPromises: Promise<EvalResult>[] = [];

  for (const model of models) {
    for (let i = 0; i < iterations; i++) {
      const iteration = i + 1;

      // Create promise for this evaluation
      const evalPromise = (async () => {
        console.log(
          `[${
            new Date().toISOString().split("T")[1].slice(0, 8)
          }] Starting ${model} iteration ${iteration}...`,
        );

        // Render the deck with context and model
        const completionParams = deck.render({
          context,
          model, // Pass the specific model to render
          temperature: 0.7,
          max_tokens: 1000,
        });

        const { response, error, latency } = await callOpenRouter(
          completionParams,
          logger,
          iteration,
        );

        let result: EvalResult = {
          model,
          iteration,
          success: !error,
          output: response,
          error,
          latency,
        };

        // Apply post-processing if provided
        if (config.postProcess && !error) {
          try {
            result = await config.postProcess(result);
          } catch (postError) {
            result.postProcessError = postError instanceof Error
              ? postError.message
              : String(postError);
            console.log(
              `[${
                new Date().toISOString().split("T")[1].slice(0, 8)
              }] Post-process error for ${model}: ${result.postProcessError}`,
            );
          }
        }

        const validationStatus = result.validations
          ? Object.values(result.validations).every((v) => v.passed)
            ? "✅"
            : "⚠️"
          : "";

        console.log(
          `[${
            new Date().toISOString().split("T")[1].slice(0, 8)
          }] Completed ${model} iteration ${iteration} in ${latency}ms ${
            error ? "❌" : "✅"
          } ${validationStatus}`,
        );

        return result;
      })();

      evalPromises.push(evalPromise);
    }
  }

  // Wait for all evaluations to complete
  const results = await Promise.all(evalPromises);

  // Log summary
  console.log("\n=== Evaluation Summary ===");
  console.log(`Total runs: ${results.length}`);
  console.log(`Successful: ${results.filter((r) => r.success).length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);

  const errors = logger.getErrors();
  if (errors.length > 0) {
    console.log("\n=== Errors ===");
    errors.forEach((e) =>
      console.log(`- ${e.model}:${e.iteration} - ${e.error}`)
    );
  }

  return results;
}

// Example usage
async function example() {
  // Create a simple judge deck
  const judgeDeck = makeDeckBuilder("json-validator")
    .spec(
      "You are an expert at evaluating JSON outputs for correctness and completeness.",
    )
    .card(
      "evaluation criteria",
      (c) =>
        c.spec("Check if the output is valid JSON syntax")
          .spec("Verify all required fields are present")
          .spec("Ensure data types match expected schema"),
    )
    .context((c) =>
      c.string("prompt", "What was the original prompt?")
        .string("response", "What was the LLM response to evaluate?")
        .object("expectedSchema", "What is the expected JSON schema?")
    )
    .context((c) =>
      c.string(
        "outputFormat",
        "What format would you like the output of the eval?",
      )
    );

  // Get random models with filtering
  const models = await getRandomModels(3, {
    maxPrice: 0.01,
    excludeInstruct: true, // Exclude instruct models by default
    excludePatterns: ["free"], // Optionally exclude free/demo models
    // includePatterns: ["gpt", "claude", "mistral"], // Optionally only include specific models
    minContextLength: 4000, // Minimum context window
  });

  // Define post-processing function with validations
  const postProcess = (result: EvalResult): EvalResult => {
    // Initialize validations object
    result.validations = {};

    try {
      // First strip any thinking outputs
      const cleanedOutput = stripThinkingOutputs(result.output || "");

      // Try to parse the output as JSON
      result.parsed = JSON.parse(cleanedOutput || "{}");

      // Validation 1: Check if output is valid JSON
      result.validations.validJson = {
        passed: true,
        message: "Output is valid JSON",
      };

      // Validation 2: Check required fields
      const required = ["valid", "issues", "score"];
      const missing = required.filter((field) => !(field in result.parsed));
      result.validations.requiredFields = {
        passed: missing.length === 0,
        message: missing.length > 0
          ? `Missing required fields: ${missing.join(", ")}`
          : "All required fields present",
      };

      // Validation 3: Check score range
      const score = result.parsed.score;
      result.validations.scoreRange = {
        passed: typeof score === "number" && score >= 0 && score <= 100,
        message: typeof score === "number"
          ? (score >= 0 && score <= 100
            ? "Score in valid range"
            : `Score ${score} out of range`)
          : "Score is not a number",
      };

      // Validation 4: Check issues is array
      result.validations.issuesFormat = {
        passed: Array.isArray(result.parsed.issues),
        message: Array.isArray(result.parsed.issues)
          ? "Issues is valid array"
          : "Issues is not an array",
      };
    } catch (e) {
      // If JSON parsing fails
      result.validations.validJson = {
        passed: false,
        message: `JSON parse error: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }

    return result;
  };

  // Run evaluation
  const results = await runEvals({
    deck: judgeDeck,
    models,
    iterations: 3,
    postProcess, // Add the post-processing function
    context: {
      prompt:
        "Extract user information from: 'John Doe, 30 years old, lives in NYC'",
      response: JSON.stringify({ name: "John Doe", age: 30, city: "NYC" }),
      expectedSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          city: { type: "string" },
        },
        required: ["name", "age", "city"],
      },
      outputFormat: JSON.stringify(
        {
          valid:
            "boolean - whether the output is valid JSON and matches schema",
          issues: "array of strings - any problems found",
          score: "number 0-100 - overall quality score",
          explanation: "string - brief explanation of the evaluation",
        },
        null,
        2,
      ),
    },
  });

  // Display results sorted by model and iteration
  console.log("\n=== Detailed Results ===");

  // Sort results by model name and then by iteration
  const sortedResults = [...results].sort((a, b) => {
    if (a.model !== b.model) {
      return a.model.localeCompare(b.model);
    }
    return a.iteration - b.iteration;
  });

  sortedResults.forEach((r) => {
    console.log(`\n${r.model} - Iteration ${r.iteration}:`);
    console.log(`  Success: ${r.success}`);
    console.log(`  Latency: ${r.latency}ms`);

    if (r.output) {
      console.log(`  Output: ${r.output.substring(0, 100)}...`);
    }

    if (r.parsed) {
      console.log(
        `  Parsed: ${JSON.stringify(r.parsed, null, 2).substring(0, 150)}...`,
      );
    }

    if (r.validations) {
      console.log(`  Validations:`);
      Object.entries(r.validations).forEach(([key, val]) => {
        console.log(`    ${key}: ${val.passed ? "✅" : "❌"} ${val.message}`);
      });
    }

    if (r.error) {
      console.log(`  Error: ${r.error}`);
    }

    if (r.postProcessError) {
      console.log(`  Post-process error: ${r.postProcessError}`);
    }
  });

  // Show average latencies per model
  console.log("\n=== Average Latencies ===");
  const modelLatencies = new Map<string, number[]>();
  results.forEach((r) => {
    if (!modelLatencies.has(r.model)) {
      modelLatencies.set(r.model, []);
    }
    modelLatencies.get(r.model)!.push(r.latency);
  });

  modelLatencies.forEach((latencies, model) => {
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    console.log(`${model}: ${Math.round(avg)}ms average`);
  });

  // Show validation summary
  console.log("\n=== Validation Summary ===");
  const modelValidations = new Map<
    string,
    { passed: number; failed: number }
  >();

  results.forEach((r) => {
    if (r.validations) {
      const stats = modelValidations.get(r.model) || { passed: 0, failed: 0 };

      Object.values(r.validations).forEach((val) => {
        if (val.passed) stats.passed++;
        else stats.failed++;
      });

      modelValidations.set(r.model, stats);
    }
  });

  modelValidations.forEach((stats, model) => {
    const total = stats.passed + stats.failed;
    const passRate = total > 0 ? Math.round((stats.passed / total) * 100) : 0;
    console.log(
      `${model}: ${passRate}% pass rate (${stats.passed}/${total} validations passed)`,
    );
  });
}

// Helper function to strip thinking outputs from model responses
function stripThinkingOutputs(text: string): string {
  // Remove various thinking tags that models might use
  const patterns = [
    // XML-style thinking tags
    /<thinking>[\s\S]*?<\/thinking>/gi,
    /<think>[\s\S]*?<\/think>/gi,
    /<thought>[\s\S]*?<\/thought>/gi,
    /<reasoning>[\s\S]*?<\/reasoning>/gi,
    /<inner_thoughts>[\s\S]*?<\/inner_thoughts>/gi,
    /<reflection>[\s\S]*?<\/reflection>/gi,
    /<scratchpad>[\s\S]*?<\/scratchpad>/gi,

    // Markdown-style thinking sections
    /```thinking[\s\S]*?```/gi,
    /```thought[\s\S]*?```/gi,
    /```reasoning[\s\S]*?```/gi,

    // Comment-style thinking
    /\/\*\s*thinking:[\s\S]*?\*\//gi,
    /<!--\s*thinking:[\s\S]*?-->/gi,
  ];

  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Extract JSON from markdown code blocks if present
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1];
  }

  // Also remove any leading/trailing whitespace
  return cleaned.trim();
}

// Helper function to create JSON validation post-processor
export function createJsonValidator(
  expectedFields: string[],
  additionalValidations?: (
    parsed: any,
  ) => Record<string, { passed: boolean; message: string }>,
) {
  return (result: EvalResult): EvalResult => {
    result.validations = {};

    try {
      // First strip any thinking outputs
      const cleanedOutput = stripThinkingOutputs(result.output || "");

      // Try to parse the output as JSON
      result.parsed = JSON.parse(cleanedOutput || "{}");

      // Valid JSON check
      result.validations.validJson = {
        passed: true,
        message: "Output is valid JSON",
      };

      // Check required fields
      const missing = expectedFields.filter((field) =>
        !(field in result.parsed)
      );
      result.validations.requiredFields = {
        passed: missing.length === 0,
        message: missing.length > 0
          ? `Missing required fields: ${missing.join(", ")}`
          : "All required fields present",
      };

      // Run additional validations if provided
      if (additionalValidations) {
        const additional = additionalValidations(result.parsed);
        Object.assign(result.validations, additional);
      }
    } catch (e) {
      result.validations.validJson = {
        passed: false,
        message: `JSON parse error: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }

    return result;
  };
}

// Export for use
export {
  type EvalConfig,
  type EvalResult,
  getRandomModels,
  makeDeckBuilder,
  runEvals,
  stripThinkingOutputs,
};

// Run example if this file is executed directly
if (import.meta.main) {
  if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY environment variable not set!");
    console.error(
      "Please set it with: export OPENROUTER_API_KEY=your-key-here",
    );
    Deno.exit(1);
  }

  console.log("Running eval scratchpad example...");

  // Check for --list-models flag
  if (Deno.args.includes("--list-models")) {
    const models = await fetchOpenRouterModels();
    console.log(`\nFound ${models.length} available models:\n`);

    // Group by instruct vs non-instruct
    const instructModels = models.filter((m) =>
      m.id.toLowerCase().includes("instruct") ||
      m.id.toLowerCase().includes("-it") ||
      m.id.toLowerCase().includes("inst")
    );
    const nonInstructModels = models.filter((m) => !instructModels.includes(m));

    console.log(`Chat/Base Models (${nonInstructModels.length}):`);
    nonInstructModels.forEach((m) => {
      console.log(`  ${m.id}`);
      console.log(
        `    Context: ${m.context_length} tokens | Price: $${m.pricing.prompt}/1K`,
      );
    });

    console.log(`\nInstruct Models (${instructModels.length}):`);
    instructModels.forEach((m) => {
      console.log(`  ${m.id}`);
      console.log(
        `    Context: ${m.context_length} tokens | Price: $${m.pricing.prompt}/1K`,
      );
    });

    Deno.exit(0);
  }

  // Check for --help flag
  if (Deno.args.includes("--help")) {
    console.log(`
Bolt Foundry Eval Scratchpad

Usage:
  ./scratchpad.ts              Run evaluation with random models
  ./scratchpad.ts --list-models    List all available models
  ./scratchpad.ts --instruct       Include instruct models
  ./scratchpad.ts --help           Show this help message

Environment:
  OPENROUTER_API_KEY    Required API key for OpenRouter

The script will:
  - Select 3 random models (excluding instruct models by default)
  - Run evaluations in parallel
  - Validate outputs and show results
`);
    Deno.exit(0);
  }

  await example();
}
