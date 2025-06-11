import type {
  Card,
  DeckBuilder,
  JSONValue,
} from "packages/bolt-foundry/builders/builders.ts";
import {
  parseMarkdownToDeck,
  type TomlSample,
} from "packages/bolt-foundry/builders/markdown/markdownToDeck.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface EvalOptions {
  inputFile?: string; // Now optional
  graderFile: string;
  model: string;
  context?: Record<string, JSONValue>; // Additional context variables
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
): Promise<Array<GradingResult>> {
  const { inputFile, graderFile, model, context: providedContext } = options;

  logger.debug(`Starting evaluation with options:`, {
    inputFile,
    graderFile,
    model,
    providedContext,
  });

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

  const graderFilePath = resolveFilePath(graderFile);

  // Read and validate grader file
  try {
    await Deno.stat(graderFilePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`No such file: ${graderFilePath}`);
    }
    throw error;
  }

  // Load grader - handle both TypeScript modules and Markdown files
  let grader: DeckBuilder;
  let embeddedSamples: Record<string, TomlSample> = {};

  if (graderFile.endsWith(".md")) {
    // Read and parse markdown file
    const markdownContent = await Deno.readTextFile(graderFilePath);
    logger.debug(
      `Loaded markdown content from ${graderFile}, length: ${markdownContent.length}`,
    );

    // Pass the directory of the grader file as the base path
    const basePath = graderFilePath.pathname.substring(
      0,
      graderFilePath.pathname.lastIndexOf("/"),
    );
    logger.debug(`Parsing markdown with basePath: ${basePath}`);

    const parsedDeck = await parseMarkdownToDeck(markdownContent, basePath);

    // Import makeGraderDeckBuilder to wrap the parsed deck
    const { makeGraderDeckBuilder } = await import(
      "packages/bolt-foundry/evals/makeGraderDeckBuilder.ts"
    );

    // Create a grader deck that will append the evaluation context
    const graderDeck = makeGraderDeckBuilder(parsedDeck.deck.name);

    // Copy all cards from parsed deck to grader deck
    const cards = parsedDeck.deck.getCards();
    logger.debug(`Copying ${cards.length} cards to grader deck`);

    // We need to rebuild the deck structure
    for (const card of cards) {
      if (typeof card.value === "string") {
        // This is a spec
        graderDeck.spec(card.value);
      } else if (card.name) {
        // This is a card with nested content
        graderDeck.card(card.name, (c) => {
          let builder = c;
          const nestedCards = card.value as Array<Card>;
          for (const subCard of nestedCards) {
            if (typeof subCard.value === "string") {
              builder = builder.spec(subCard.value);
            } else if (subCard.name) {
              // Handle nested cards
              builder = builder.card(subCard.name, (sc) => {
                let subBuilder = sc;
                const subNestedCards = subCard.value as Array<Card>;
                for (const subSubCard of subNestedCards) {
                  if (typeof subSubCard.value === "string") {
                    subBuilder = subBuilder.spec(subSubCard.value);
                  }
                }
                return subBuilder;
              });
            }
          }
          return builder;
        });
      }
    }

    grader = graderDeck;
    embeddedSamples = parsedDeck.samples;

    logger.debug(
      `Created grader deck with ${
        Object.keys(embeddedSamples).length
      } embedded samples`,
    );
  } else {
    // Load as TypeScript module
    logger.debug(`Loading TypeScript module from ${graderFilePath.href}`);
    const graderModule = await import(graderFilePath.href);
    grader = graderModule.default;
  }

  // Get samples from input file or from embedded TOML
  const samples: Array<EvalSample> = [];

  if (inputFile) {
    // Read from input file if provided
    const inputFilePath = resolveFilePath(inputFile);
    let inputContent: string;
    try {
      inputContent = await Deno.readTextFile(inputFilePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`No such file: ${inputFile}`);
      }
      throw error;
    }

    // Parse JSONL input
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
  } else if (Object.keys(embeddedSamples).length > 0) {
    // Use embedded samples from TOML
    logger.debug(
      `Loading ${
        Object.keys(embeddedSamples).length
      } embedded samples from grader deck`,
    );
    let sampleIndex = 0;
    for (const [id, tomlSample] of Object.entries(embeddedSamples)) {
      logger.debug(`Loading sample ${id}:`, tomlSample);
      samples.push({
        ...tomlSample, // Include any extra fields
        id: id,
        userMessage: tomlSample.userMessage,
        assistantResponse: tomlSample.assistantResponse,
        expected: tomlSample.expected as string | undefined,
        score: tomlSample.score as number | undefined,
      });
      sampleIndex++;
    }
  } else {
    throw new Error(
      "No input samples provided. Either specify --input or embed samples in the grader deck using TOML.",
    );
  }

  // Process each sample
  const results: Array<GradingResult> = [];

  for (const sample of samples) {
    const startTime = performance.now();

    logger.debug(
      `\n========== Processing sample: ${sample.id || "unnamed"} ==========`,
    );
    logger.debug(`Sample data:`, {
      id: sample.id,
      userMessage: sample.userMessage.substring(0, 200) + "...",
      assistantResponse: sample.assistantResponse,
      expected: sample.expected,
      score: sample.score,
    });

    // Prepare context for the deck
    const context: Record<string, JSONValue> = {
      userMessage: sample.userMessage,
      assistantResponse: sample.assistantResponse,
    };

    if (sample.expected) {
      context.expected = sample.expected;
    }

    // Merge any provided context variables
    if (providedContext) {
      Object.assign(context, providedContext);
    }

    logger.debug(`Context prepared for grader:`, context);

    // Render the grader with the evaluation context
    const renderedGrader = grader.render({
      model,
      context,
      temperature: 0,
    });

    logger.debug(`Rendered grader prompt:`, {
      messages: renderedGrader.messages,
      model: renderedGrader.model,
      temperature: renderedGrader.temperature,
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
    logger.debug(`API Response:`, apiResponse);

    const rawOutput = apiResponse.choices[0].message.content;
    logger.debug(`Raw LLM output: "${rawOutput}"`);

    // Parse the evaluation result
    let output: { score: number; notes?: string };
    try {
      output = JSON.parse(rawOutput);
      logger.debug(`Successfully parsed output:`, output);
    } catch (parseError) {
      logger.error(`Failed to parse JSON output: ${parseError}`);
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
