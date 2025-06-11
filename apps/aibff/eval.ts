#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import { runEval } from "packages/bolt-foundry/evals/eval.ts";

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
    printText(`Usage: eval.ts <grader.deck.md> [samples.jsonl|samples.toml]

Examples:
  # Calibration mode (uses deck's internal samples)
  deno run --allow-env --allow-read --allow-net --allow-write eval.ts grader.deck.md
  
  # File input mode
  deno run --allow-env --allow-read --allow-net --allow-write eval.ts grader.deck.md samples.toml
  deno run --allow-env --allow-read --allow-net --allow-write eval.ts grader.deck.md samples.jsonl
  
  # Stdin mode
  echo '{"userMessage": "test", "assistantResponse": "response"}' | deno run --allow-env --allow-read --allow-net --allow-write eval.ts grader.deck.md

Environment:
  OPENROUTER_API_KEY    Required for LLM access
  ANTHROPIC_MODEL      Model to use (default: claude-3-5-sonnet-20241022)
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
      "claude-3-5-sonnet-20241022";

    // Check for API key
    if (!getConfigVar("OPENROUTER_API_KEY")) {
      printText(
        "Error: OPENROUTER_API_KEY environment variable is required",
        true,
      );
      Deno.exit(1);
    }

    // Check if we have stdin input and no input file
    let actualInputFile = inputFile;
    let tempFile: string | undefined;

    if (!inputFile) {
      // Check if stdin is piped
      let hasStdinInput = false;
      try {
        hasStdinInput = !Deno.stdin.isTerminal();
      } catch {
        // Ignore errors, assume no stdin
      }

      if (hasStdinInput) {
        // Create a temporary file for stdin input
        tempFile = await Deno.makeTempFile({ suffix: ".jsonl" });
        const decoder = new TextDecoder();
        const lines: Array<string> = [];

        for await (const chunk of Deno.stdin.readable) {
          const text = decoder.decode(chunk);
          lines.push(text.trim());
        }

        await Deno.writeTextFile(tempFile, lines.join("\n"));
        actualInputFile = tempFile;
      }
    }

    printText(`Running evaluation with grader: ${graderFile}`, true);
    if (actualInputFile) {
      printText(`Using input file: ${actualInputFile}`, true);
    } else {
      printText("Using embedded samples from grader deck", true);
    }
    printText(`Model: ${model}`, true);
    printText("", true);

    try {
      const results = await runEval({
        graderFile,
        inputFile: actualInputFile,
        model,
      });

      // Output results as JSON for now
      printText(JSON.stringify(results, null, 2));

      // Calculate and display summary stats to stderr
      const totalSamples = results.length;
      const scores = results.map((r) => r.score as number);
      const avgScore = scores.reduce((a, b) => a + b, 0) / totalSamples;
      const passed = scores.filter((s) => s > 0).length;
      const failed = scores.filter((s) => s <= 0).length;

      printText("", true);
      printText("Summary:", true);
      printText(`Total samples: ${totalSamples}`, true);
      printText(`Average score: ${avgScore.toFixed(2)}`, true);
      printText(`Passed: ${passed}`, true);
      printText(`Failed: ${failed}`, true);
    } finally {
      // Clean up temp file if we created one
      if (tempFile) {
        await Deno.remove(tempFile).catch(() => {});
      }
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
