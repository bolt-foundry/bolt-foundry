#!/usr/bin/env -S deno run -A

import { parse } from "@std/flags";
import { makeDeckBuilder } from "../builders/builders.ts";
import { getRandomModels, runEvals } from "./scratchpad.ts";
import type { EvalConfig, EvalResult } from "./scratchpad.ts";

// CLI help text
const HELP_TEXT = `
Bolt Foundry Evaluation CLI

USAGE:
  bf-eval --deck <deck-file> --context <jsonl-file> [OPTIONS]

REQUIRED:
  --deck <file>        Path to TypeScript file exporting a judge deck
  --context <file>     Path to JSONL file with evaluation contexts

OPTIONS:
  --models <list>      Comma-separated list of models (default: random models)
  --count <n>          Number of random models to select (default: 3)
  --iterations <n>     Number of iterations per model (default: 1)
  --output <file>      Output file path (default: stdout)
  --format <type>      Output format: human, json, jsonl (default: human)
  --post-process <file> Optional TypeScript file exporting postProcess function
  
FLAGS:
  -h, --help          Show this help message
  -v, --verbose       Show detailed progress
  --list-models       List available models and exit
  --include-instruct  Include instruct models in random selection
  --include-free      Include free tier models in random selection (excluded by default)

EXAMPLES:
  # Run with specific models
  bf-eval --deck ./judges/json-judge.ts --context ./test-cases.jsonl \\
    --models gpt-4,claude-3-opus --iterations 3

  # Run with random models and save results
  bf-eval --deck ./judges/accuracy.ts --context ./data.jsonl \\
    --output results.json --format json

  # List available models
  bf-eval --list-models

CONTEXT FILE FORMAT (JSONL):
  Each line should be a JSON object that will be passed as context to the deck:
  {"prompt": "...", "response": "...", "expected": "..."}
  {"prompt": "...", "response": "...", "expected": "..."}

DECK FILE FORMAT:
  Must export a default function that returns a DeckBuilder:
  export default function createJudge() {
    return makeDeckBuilder("judge-name")
      .spec("You are a judge...")
      .context((c) => c.string("prompt", "..."));
  }
`;

// Parse command line arguments
const args = parse(Deno.args, {
  string: ["deck", "context", "models", "output", "format", "post-process"],
  boolean: [
    "help",
    "verbose",
    "list-models",
    "include-instruct",
    "include-free",
  ],
  default: {
    format: "human",
    iterations: 1,
    count: 3,
    verbose: false,
  },
  alias: {
    h: "help",
    v: "verbose",
  },
});

// Helper to load TypeScript modules
async function loadTsModule<T>(path: string): Promise<T> {
  const fileUrl = new URL(path, `file://${Deno.cwd()}/`).href;
  const module = await import(fileUrl);
  return module.default || module;
}

// Load JSONL file
async function loadJsonl(path: string): Promise<any[]> {
  const text = await Deno.readTextFile(path);
  const lines = text.trim().split("\n").filter((line) => line.trim());
  return lines.map((line, i) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      throw new Error(`Invalid JSON on line ${i + 1}: ${e.message}`);
    }
  });
}

// Format results based on output type
function formatResults(results: EvalResult[], format: string): string {
  switch (format) {
    case "json":
      return JSON.stringify(results, null, 2);

    case "jsonl":
      return results.map((r) => JSON.stringify(r)).join("\n");

    case "human":
    default:
      return formatHumanResults(results);
  }
}

// Human-readable output formatting
function formatHumanResults(results: EvalResult[]): string {
  const output: string[] = [];

  // Group results by context index
  const contextGroups = new Map<number, EvalResult[]>();
  results.forEach((r) => {
    const contextIndex = Math.floor(
      results.indexOf(r) /
        (results.length / results.filter((r2) => r2.model === r.model).length),
    );
    if (!contextGroups.has(contextIndex)) {
      contextGroups.set(contextIndex, []);
    }
    contextGroups.get(contextIndex)!.push(r);
  });

  output.push("\n=== EVALUATION RESULTS ===\n");

  contextGroups.forEach((groupResults, contextIndex) => {
    output.push(`\nContext #${contextIndex + 1}:`);
    output.push("─".repeat(50));

    groupResults.forEach((r) => {
      output.push(`\nModel: ${r.model} (Iteration ${r.iteration})`);
      output.push(`Status: ${r.success ? "✅ Success" : "❌ Failed"}`);
      output.push(`Latency: ${r.latency}ms`);

      if (r.parsed) {
        output.push(`Output: ${JSON.stringify(r.parsed, null, 2)}`);
      } else if (r.output) {
        output.push(`Raw Output: ${r.output.substring(0, 200)}...`);
      }

      if (r.validations) {
        output.push(`Validations:`);
        Object.entries(r.validations).forEach(([key, val]) => {
          output.push(`  ${key}: ${val.passed ? "✅" : "❌"} ${val.message}`);
        });
      }

      if (r.error) {
        output.push(`Error: ${r.error}`);
      }
    });
  });

  // Summary statistics
  output.push("\n\n=== SUMMARY ===");
  output.push("─".repeat(50));

  const modelStats = new Map<
    string,
    { success: number; total: number; avgLatency: number }
  >();
  results.forEach((r) => {
    const stats = modelStats.get(r.model) ||
      { success: 0, total: 0, avgLatency: 0 };
    stats.total++;
    if (r.success) stats.success++;
    stats.avgLatency = (stats.avgLatency * (stats.total - 1) + r.latency) /
      stats.total;
    modelStats.set(r.model, stats);
  });

  modelStats.forEach((stats, model) => {
    const successRate = Math.round((stats.success / stats.total) * 100);
    output.push(`\n${model}:`);
    output.push(
      `  Success Rate: ${successRate}% (${stats.success}/${stats.total})`,
    );
    output.push(`  Avg Latency: ${Math.round(stats.avgLatency)}ms`);
  });

  return output.join("\n");
}

// Main CLI function
async function main() {
  // Handle help flag
  if (args.help) {
    console.log(HELP_TEXT);
    Deno.exit(0);
  }

  // Handle list-models flag
  if (args["list-models"]) {
    const models = await getRandomModels(100, {
      excludeInstruct: !args["include-instruct"],
      excludeFree: !args["include-free"],
      maxPrice: 1000, // Show all models
    });
    console.log("\nAvailable models:");
    models.forEach((m) => console.log(`  ${m}`));
    Deno.exit(0);
  }

  // Validate required arguments
  if (!args.deck || !args.context) {
    console.error("Error: --deck and --context are required\n");
    console.log(HELP_TEXT);
    Deno.exit(1);
  }

  // Check API key
  if (!Deno.env.get("OPENROUTER_API_KEY")) {
    console.error("Error: OPENROUTER_API_KEY environment variable not set");
    Deno.exit(1);
  }

  try {
    // Load deck
    if (args.verbose) console.log("Loading deck from:", args.deck);
    const deckFactory = await loadTsModule<() => any>(args.deck);
    const deck = typeof deckFactory === "function"
      ? deckFactory()
      : deckFactory;

    // Load contexts
    if (args.verbose) console.log("Loading contexts from:", args.context);
    const contexts = await loadJsonl(args.context);
    if (args.verbose) console.log(`Loaded ${contexts.length} contexts`);

    // Determine models
    let models: string[];
    if (args.models) {
      models = args.models.split(",").map((m) => m.trim());
    } else {
      if (args.verbose) console.log("Selecting random models...");
      const count = parseInt(args.count) || 3;
      models = await getRandomModels(count, {
        excludeInstruct: !args["include-instruct"],
        excludeFree: !args["include-free"],
      });
    }

    // Load post-processor if provided
    let postProcess;
    if (args["post-process"]) {
      if (args.verbose) {
        console.log("Loading post-processor from:", args["post-process"]);
      }
      postProcess = await loadTsModule<(result: EvalResult) => EvalResult>(
        args["post-process"],
      );
    }

    // Run evaluations for each context
    const allResults: EvalResult[] = [];
    const iterations = parseInt(args.iterations);

    console.log(`\nRunning evaluations:`);
    console.log(`- Models: ${models.join(", ")}`);
    console.log(`- Contexts: ${contexts.length}`);
    console.log(`- Iterations: ${iterations}`);
    console.log(
      `- Total runs: ${models.length * contexts.length * iterations}\n`,
    );

    for (let i = 0; i < contexts.length; i++) {
      const context = contexts[i];
      if (args.verbose) {
        console.log(`\nEvaluating context ${i + 1}/${contexts.length}...`);
      }

      const config: EvalConfig = {
        deck,
        models,
        iterations,
        context,
        postProcess,
      };

      const results = await runEvals(config);
      allResults.push(...results);
    }

    // Format and output results
    const formatted = formatResults(allResults, args.format);

    if (args.output) {
      await Deno.writeTextFile(args.output, formatted);
      console.log(`\nResults written to: ${args.output}`);
    } else {
      console.log(formatted);
    }
  } catch (error) {
    console.error("\nError:", error.message);
    if (args.verbose && error.stack) {
      console.error("\nStack trace:", error.stack);
    }
    Deno.exit(1);
  }
}

// Run the CLI
if (import.meta.main) {
  main();
}
