import type { DeckBuilder } from "packages/bolt-foundry/builders/builders.ts";

export interface EvalOptions {
  inputFile: string;
  graderFile: string;
  model: string;
}

export interface GradingResult {
  model: string;
  id?: string;
  iteration: number;
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  latencyInMs: number;
  rawOutput: string;
  output: {
    score: number;
    notes?: string;
  };
  sample: EvalSample;
  sampleMetadata?: Record<string, unknown>;
}

interface EvalSample {
  id?: string;
  userMessage: string;
  assistantResponse: string;
  expected?: string;
  score?: number; // Expected score for meta-evaluation
  [key: string]: unknown;
}

export async function runEval(
  options: EvalOptions,
): Promise<GradingResult[]> {
  const { inputFile, graderFile, model } = options;

  // Resolve paths relative to current working directory if they're relative
  const resolveFilePath = (filePath: string): URL => {
    if (filePath.startsWith("/")) {
      // Absolute path
      return new URL(`file://${filePath}`);
    } else {
      // Relative path - resolve from current working directory
      return new URL(filePath, `file://${Deno.cwd()}/`);
    }
  };

  const inputFilePath = resolveFilePath(inputFile);
  const graderFilePath = resolveFilePath(graderFile);
  // Read and validate input file
  let inputContent: string;
  try {
    inputContent = await Deno.readTextFile(inputFilePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`No such file: ${inputFile}`);
    }
    throw error;
  }

  // Read and validate grader file
  try {
    await Deno.stat(graderFilePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`No such file: ${graderFilePath}`);
    }
    throw error;
  }

  // Load grader module
  const graderModule = await import(graderFilePath.href);
  const grader: DeckBuilder = graderModule.default;

  // Parse JSONL input
  const samples: EvalSample[] = [];
  const lines = inputContent.trim().split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const sample = JSON.parse(line) as EvalSample;
      // Generate ID if missing
      if (!sample.id) {
        sample.id = `eval-${i + 1}`;
      }
      samples.push(sample);
    } catch (error) {
      throw new Error(
        `Invalid JSON on line ${i + 1}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  // Process each sample
  const results: GradingResult[] = [];

  for (const sample of samples) {
    const startTime = performance.now();

    // Prepare context for the deck
    const context: Record<string, string> = {
      userMessage: sample.userMessage,
      assistantResponse: sample.assistantResponse,
    };

    if (sample.expected) {
      context.expected = sample.expected;
    }

    // Render the grader with the evaluation context
    const renderedGrader = grader.render({
      model,
      context,
      temperature: 0,
    });

    // Call LLM API via OpenRouter
    const response = await fetch(
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // deno-lint-ignore bolt-foundry/no-env-direct-access
          "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY") || ""}`,
          "HTTP-Referer": "https://boltfoundry.com",
          "X-Title": "Bolt Foundry Eval",
        },
        body: JSON.stringify(renderedGrader),
      },
    );

    const endTime = performance.now();
    const latencyInMs = endTime - startTime;

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    const rawOutput = apiResponse.choices[0].message.content;

    // Parse the evaluation result
    let output: { score: number; notes?: string };
    try {
      output = JSON.parse(rawOutput);
    } catch (_parseError) {
      // If the grader fails to return valid JSON, that's a score of 0
      output = {
        score: 0,
        notes: `Grader failed to return valid JSON. Raw output: ${rawOutput}`,
      };
    }

    // Validate score is in range
    const score = Math.round(output.score) as GradingResult["score"];
    if (score < -3 || score > 3) {
      throw new Error(`Score ${score} is out of valid range [-3, 3]`);
    }

    // Create result
    const result: GradingResult = {
      model,
      id: sample.id,
      iteration: 1,
      score,
      latencyInMs,
      rawOutput,
      output,
      sample,
      sampleMetadata: Object.fromEntries(
        Object.entries(sample).filter(([key]) =>
          !["id", "userMessage", "assistantResponse", "expected"].includes(key)
        ),
      ),
    };

    results.push(result);
  }

  return results;
}
