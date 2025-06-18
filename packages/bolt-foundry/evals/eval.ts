import type {
  Card,
  DeckBuilder,
  JSONValue,
} from "packages/bolt-foundry/builders/builders.ts";
import {
  parseMarkdownToDeck,
  type TomlSample,
} from "packages/bolt-foundry/builders/markdown/markdownToDeck.ts";
import { getLogger, startSpinner } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface EvalOptions {
  inputFile?: string; // Now optional
  graderFile: string;
  model: string;
  context?: Record<string, JSONValue>; // Additional context variables
  verbose?: boolean; // Show full grader prompt for debugging
  onSampleComplete?: (
    result: GradingResult,
    index: number,
    total: number,
  ) => void; // Callback for real-time updates
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
    reason?: string;
  };
  sample: EvalSample;
  sampleMetadata?: Record<string, unknown>;
  graderMetadata?: Record<string, unknown>;
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
  const {
    inputFile,
    graderFile,
    model,
    context: providedContext,
    verbose,
    onSampleComplete,
  } = options;

  logger.debug(`Starting evaluation with options:`, {
    inputFile,
    graderFile,
    model,
    providedContext,
  });

  // Initialize spinner function that will be set by the processing loop

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
  let graderMeta: Record<string, unknown> = {};

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

    // Load the grader-base.deck.md file
    const graderBasePath = new URL(
      "../../../decks/grader-base.deck.md",
      import.meta.url,
    ).pathname;
    logger.debug(`Loading grader base from: ${graderBasePath}`);

    const graderBaseContent = await Deno.readTextFile(graderBasePath);
    const graderBaseDir = graderBasePath.substring(
      0,
      graderBasePath.lastIndexOf("/"),
    );
    const graderBaseDeck = await parseMarkdownToDeck(
      graderBaseContent,
      graderBaseDir,
    );

    // Create a new deck that combines user deck + grader base
    const { makeDeckBuilder } = await import(
      "packages/bolt-foundry/builders/builders.ts"
    );

    let combinedDeck = makeDeckBuilder(parsedDeck.deck.name);

    // First, add all cards from the user's grader deck
    const userCards = parsedDeck.deck.getCards();
    logger.debug(`Adding ${userCards.length} user cards`);

    for (const card of userCards) {
      if (typeof card.value === "string") {
        combinedDeck = combinedDeck.spec(card.value);
      } else if (card.name) {
        combinedDeck = combinedDeck.card(card.name, (c) => {
          let builder = c;
          const nestedCards = card.value as Array<Card>;
          for (const subCard of nestedCards) {
            if (typeof subCard.value === "string") {
              builder = builder.spec(subCard.value);
            }
          }
          return builder;
        });
      }
    }

    // Then, add the grader base cards
    const baseCards = graderBaseDeck.deck.getCards();
    logger.debug(`Adding ${baseCards.length} grader base cards`);

    combinedDeck = combinedDeck.card("grader evaluation", (c) => {
      let builder = c;
      for (const card of baseCards) {
        if (typeof card.value === "string") {
          builder = builder.spec(card.value);
        } else if (card.name) {
          builder = builder.card(card.name, (sc) => {
            let subBuilder = sc;
            const nestedCards = card.value as Array<Card>;
            for (const subCard of nestedCards) {
              if (typeof subCard.value === "string") {
                subBuilder = subBuilder.spec(subCard.value);
              }
            }
            return subBuilder;
          });
        }
      }
      return builder;
    });

    // Add contexts from both decks
    const userContexts = parsedDeck.deck.getContext();
    const baseContexts = graderBaseDeck.deck.getContext();

    combinedDeck = combinedDeck.context((c) => {
      let builder = c;

      // Add user contexts first
      for (const ctx of userContexts) {
        if (ctx.type === "string") {
          builder = builder.string(ctx.name, ctx.question);
        } else if (ctx.type === "number") {
          builder = builder.number(ctx.name, ctx.question);
        } else if (ctx.type === "boolean") {
          builder = builder.boolean(ctx.name, ctx.question);
        } else if (ctx.type === "object") {
          builder = builder.object(ctx.name, ctx.question);
        }
      }

      // Add base contexts (these will override if there are duplicates)
      for (const ctx of baseContexts) {
        if (ctx.type === "string") {
          builder = builder.string(ctx.name, ctx.question);
        } else if (ctx.type === "number") {
          builder = builder.number(ctx.name, ctx.question);
        } else if (ctx.type === "boolean") {
          builder = builder.boolean(ctx.name, ctx.question);
        } else if (ctx.type === "object") {
          builder = builder.object(ctx.name, ctx.question);
        }
      }

      return builder;
    });

    grader = combinedDeck;
    embeddedSamples = parsedDeck.samples;
    graderMeta = parsedDeck.meta || {};

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
    // Use all embedded samples from TOML
    const samplesToUse = Object.entries(embeddedSamples);

    logger.debug(
      `Loading ${samplesToUse.length} samples from grader deck`,
    );

    let sampleIndex = 0;
    for (const [id, tomlSample] of samplesToUse) {
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
  const totalSamples = samples.length;

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex++) {
    const sample = samples[sampleIndex];
    const startTime = performance.now();
    const sampleNumber = sampleIndex + 1;

    // Start a spinner for this specific sample
    const sampleSpinner = startSpinner(
      `Evaluating sample ${sampleNumber}/${totalSamples}...`,
    );

    logger.debug(
      `\n========== Processing sample: ${
        sample.id || "unnamed"
      } (${sampleNumber}/${totalSamples}) ==========`,
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
      outputFormat: JSON.stringify(
        {
          score: "<number from -3 to 3>",
          reason: "<brief explanation of your scoring>",
        },
        null,
        2,
      ),
    };

    // Merge any provided context variables
    if (providedContext) {
      Object.assign(context, providedContext);
    }

    logger.debug(`Context prepared for grader:`, context);

    // Render the grader with the evaluation context
    // Use defaultModel from meta if available, otherwise use provided model
    const effectiveModel = (graderMeta.defaultModel as string) || model;
    const renderedSamples = graderMeta.renderedSamples as
      | Array<string>
      | undefined;
    const renderedGrader = grader.render({
      model: effectiveModel,
      context,
      temperature: 0,
      renderedSamples,
    });

    logger.debug(`Rendered grader prompt:`, {
      messages: renderedGrader.messages,
      model: renderedGrader.model,
      temperature: renderedGrader.temperature,
    });

    // Prepare grader metadata for verbose mode
    let graderMetadata: Record<string, unknown> | undefined;
    if (verbose) {
      graderMetadata = {
        verbosePrompt: JSON.stringify(renderedGrader, null, 2),
      };

      console.error(`\n=== VERBOSE: Full grader prompt for sample ${sampleNumber}/${totalSamples} ===`);
      console.error(`Model: ${renderedGrader.model}`);
      console.error(`Temperature: ${renderedGrader.temperature}`);
      console.error(`Messages:`);
      for (let i = 0; i < renderedGrader.messages.length; i++) {
        const message = renderedGrader.messages[i];
        console.error(`  [${i + 1}] Role: ${message.role}`);
        console.error(`      Content: ${message.content}`);
      }
      console.error(`=== END VERBOSE OUTPUT ===\n`);
    }

    // Update spinner message for API call
    sampleSpinner();
    const apiSpinner = startSpinner(
      `Calling LLM API for sample ${sampleNumber}/${totalSamples}...`,
    );

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

    // Stop API spinner
    apiSpinner();

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(
        `API request failed with status ${response.status}: ${errorBody}`,
      );
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    logger.debug(`API Response:`, apiResponse);

    const rawOutput = apiResponse.choices[0].message.content;
    logger.debug(`Raw LLM output: "${rawOutput}"`);

    // Parse the evaluation result
    let output: { score: number; reason?: string };
    try {
      const parsedOutput = JSON.parse(rawOutput);

      // Validate and normalize the output structure
      output = {
        score: parsedOutput.score,
        reason: parsedOutput.reason,
      };

      logger.debug(`Successfully parsed output:`, output);
    } catch (parseError) {
      logger.error(`Failed to parse JSON output: ${parseError}`);
      // If the grader fails to return valid JSON, that's a score of 0
      output = {
        score: 0,
        reason: `Grader failed to return valid JSON. Raw output: ${rawOutput}`,
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
      graderMetadata,
    };

    results.push(result);

    // Stop the sample spinner
    sampleSpinner();

    // Call the callback if provided
    if (onSampleComplete) {
      onSampleComplete(result, sampleIndex, totalSamples);
    }
  }

  return results;
}
