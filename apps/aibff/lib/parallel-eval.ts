import {
  type GradingResult,
  runEval,
} from "packages/bolt-foundry/evals/eval.ts";
import { createLimiter, withRetry } from "./parallel-executor.ts";
import { gray, green, red } from "@std/fmt/colors";

export interface ParallelEvalOptions {
  graderFiles: Array<string>;
  inputFile?: string;
  model: string;
  concurrency: number;
  onGraderComplete?: (
    graderFile: string,
    results: Array<GradingResult>,
  ) => void;
  onSampleComplete?: (
    graderFile: string,
    result: GradingResult,
    index: number,
    total: number,
  ) => void;
}

export interface ParallelEvalResult {
  graderFile: string;
  results: Array<GradingResult>;
  error?: Error;
}

/**
 * Run a single grader
 */
async function runGrader(
  graderFile: string,
  inputFile: string | undefined,
  model: string,
  onSampleComplete?: (
    result: GradingResult,
    index: number,
    total: number,
  ) => void,
): Promise<Array<GradingResult>> {
  const results = await runEval({
    graderFile,
    inputFile,
    model,
    onSampleComplete,
  });

  return results;
}

/**
 * Run multiple graders in parallel with parallel sample processing
 */
export async function runParallelEval(
  options: ParallelEvalOptions,
): Promise<Array<ParallelEvalResult>> {
  const {
    graderFiles,
    inputFile,
    model,
    concurrency,
    onGraderComplete,
    onSampleComplete,
  } = options;

  // Process graders in parallel with concurrency control
  const graderLimit = createLimiter(concurrency);

  const results = await Promise.allSettled(
    graderFiles.map((graderFile) =>
      graderLimit(async () => {
        try {
          const results = await withRetry(
            () =>
              runGrader(
                graderFile,
                inputFile,
                model,
                (result, index, total) => {
                  onSampleComplete?.(graderFile, result, index, total);
                },
              ),
            {
              attempts: 3,
              delayMs: 2000,
              onRetry: (error, attempt) => {
                // deno-lint-ignore no-console
                console.error(
                  `Retrying grader ${graderFile} (attempt ${attempt}): ${error.message}`,
                );
              },
            },
          );

          onGraderComplete?.(graderFile, results);

          return {
            graderFile,
            results,
          };
        } catch (error) {
          return {
            graderFile,
            results: [],
            error: error instanceof Error ? error : new Error(String(error)),
          };
        }
      })
    ),
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        graderFile: graderFiles[results.indexOf(result)],
        results: [],
        error: result.reason instanceof Error
          ? result.reason
          : new Error(String(result.reason)),
      };
    }
  });
}

/**
 * Print progress for parallel execution
 */
export function printParallelProgress(
  graderFile: string,
  result: GradingResult,
  index: number,
  total: number,
): void {
  const graderScore = result.score;
  const truthScore = result.sample.score;
  const sampleId = result.sample.id || `sample-${index + 1}`;
  const progress = `[${index + 1}/${total}]`;
  const graderName = graderFile.split("/").pop()?.replace(/\.deck\.md$/, "") ||
    graderFile;

  if (truthScore !== undefined) {
    const agree = graderScore === truthScore;
    const symbol = agree ? "✓" : "✗";
    const message =
      `${graderName} ${progress} ${symbol} ${sampleId}: grader=${graderScore}, truth=${truthScore}`;
    const coloredMessage = agree ? green(message) : red(message);
    // deno-lint-ignore no-console
    console.error(coloredMessage);
  } else {
    const message =
      `${graderName} ${progress} - ${sampleId}: grader=${graderScore}, truth=N/A`;
    // deno-lint-ignore no-console
    console.error(gray(message));
  }
}
