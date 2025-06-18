#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net

import { stringify as stringifyToml } from "@std/toml";
import { parseArgs } from "@std/cli/parse-args";
import type { Command } from "./types.ts";
import { generateEvaluationHtml } from "../utils/toml-to-html.ts";
import { extractContextFromMarkdown, extractSamplesFromMarkdown, renderDeck } from "./render.ts";
import type { Sample } from "./render.ts";
import { sendToOpenRouter } from "../lib/openrouter-client.ts";
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
}

interface OutputFile {
  results: GraderResult[];
  model: string;
  timestamp: string;
}



// Send request to OpenRouter API
async function sendToAI(messages: OpenRouterMessage[], model: string): Promise<string> {
  try {
    const response = await sendToOpenRouter({
      model,
      messages,
      temperature: 0.0,
      max_tokens: 1000
    });
    return response;
  } catch (error) {
    // Log error but return a minimal error response
    console.error("OpenRouter API error:", error);
    return "(call failed)";
  }
}

// Parse grader response as a score
function parseGraderScore(response: string): number {
  // Try to parse the response as a number
  const score = parseFloat(response.trim());
  
  // If it's not a valid number, return 0
  if (isNaN(score)) {
    return 0;
  }
  
  return score;
}


// New evaluation function with Set-based concurrency control
async function runEvaluationWithConcurrency(
  messages: Array<{ role: string; content: string }>,
  samples: Sample[],
  models: string[],
  concurrency: number,
  openAiCompletionOptions: Record<string, unknown> = {}
): Promise<OutputFile[]> {
  const allResults: OutputFile[] = [];
  
  for (const model of models) {
    console.log(`Evaluating with model: ${model}`);
    const activeRequests = new Set<Promise<GraderResult>>();
    const results: GraderResult[] = [];
    
    for (let index = 0; index < samples.length; index++) {
      const sample = samples[index];
      console.log(`Processing sample ${index + 1} of ${samples.length}...`);
      
      // Wait if we're at concurrency limit
      if (activeRequests.size >= concurrency) {
        await Promise.race(activeRequests);
      }
      
      // Create and track the request
      const promise = (async (): Promise<GraderResult> => {
        try {
          // Build the grader input - this would be the full conversation sent to the grader
          // In a real implementation, this would include the deck prompt + sample
          const graderMessages = [
            ...messages,
            { role: "user", content: `Please evaluate this response:\nUser: ${sample.input}\nAssistant: ${sample.expected}\n\nProvide a score from 0 to 1.` }
          ];
          
          // Create the OpenRouter/OpenAI API request format
          // Include all OpenAI options from the rendered deck
          const graderRequest = {
            model: model,
            messages: graderMessages,
            temperature: 0.0,
            max_tokens: 1000,
            // Include any additional options from the deck
            ...openAiCompletionOptions
          };
          
          const graderInput = JSON.stringify(graderRequest, null, 2);
          
          const response = await sendToAI(graderMessages as OpenRouterMessage[], model);
          
          return {
            id: sample.id,
            grader_score: parseGraderScore(response),
            truth_score: sample.score !== undefined ? sample.score : 1, // Use sample score if available
            notes: "",
            userMessage: sample.input,
            assistantResponse: sample.expected, // In real implementation, this would be the actual assistant response
            graderInput: graderInput,
            graderResponse: response,
            // Also include in the format expected by the HTML generator
            graderMetadata: {
              verbosePrompt: graderInput
            },
            rawOutput: response
          };
        } catch (error) {
          console.error(`Error processing sample ${sample.id}:`, error);
          return {
            id: sample.id,
            grader_score: 0,
            truth_score: sample.score !== undefined ? sample.score : 0,
            notes: `Error: ${error instanceof Error ? error.message : String(error)}`,
            userMessage: sample.input,
            assistantResponse: "",
            graderInput: "",
            graderResponse: "",
          };
        }
      })();
      
      activeRequests.add(promise);
      promise.then(result => {
        results.push(result);
        activeRequests.delete(promise);
      });
    }
    
    // Wait for all remaining requests
    await Promise.all(activeRequests);
    
    // Calculate average score for logging
    const averageScore = results.reduce((sum, r) => sum + r.grader_score, 0) / results.length;
    console.log(`Completed evaluation. Average score: ${averageScore.toFixed(2)}`);
    
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

async function runCalibrate(deckPath: string, options: CalibrateOptions): Promise<OutputFile[]> {
  // 1. Read deck
  const deckText = await Deno.readTextFile(deckPath);
  
  // 2. Extract samples from embedded TOML files
  const samples = extractSamplesFromMarkdown(deckText, deckPath);
  
  // Check if we found any samples
  if (samples.length === 0) {
    console.error("Error: No samples found in deck or embedded TOML files");
    console.error("The deck must include samples for calibration using ![description](samples.toml) syntax");
    Deno.exit(1);
  }
  
  // 3. Parse models from comma-separated list
  const models = options.model.split(',').map(m => m.trim());
  
  // 4. Extract context from markdown (including TOML files)
  const extractedContext = extractContextFromMarkdown(deckText, deckPath);
  
  // 5. Build context values using defaults from extracted context
  const contextValues: Record<string, unknown> = {};
  for (const [key, definition] of Object.entries(extractedContext)) {
    if (definition.default !== undefined) {
      contextValues[key] = definition.default;
    }
  }
  
  // 6. Render messages for AI with proper context
  const openAiCompletionOptions = {
    temperature: 0.0,
    max_tokens: 1000
  };
  const openAiRequest = renderDeck(deckText, contextValues, extractedContext, openAiCompletionOptions);
  const messages = openAiRequest.messages; // Extract messages array from the request object
  
  // 7. Run evaluation with new function
  const allResults = await runEvaluationWithConcurrency(
    messages,
    samples,
    models,
    options.concurrency,
    openAiCompletionOptions
  );
  
  return allResults;
}

export const calibrateCommand: Command = {
  name: "calibrate",
  description: "Calibrate AI models against test samples",
  run: async (args: Array<string>) => {
    // Parse arguments using Deno's standard library
    const flags = parseArgs(args, {
      string: ["model", "format", "output"],
      number: ["concurrency"],
      boolean: ["help"],
      alias: {
        h: "help",
        m: "model",
        f: "format",
        o: "output",
        c: "concurrency"
      },
      default: {
        model: "gpt-4",
        format: "toml",
        concurrency: 5
      }
    });

    // Show help if requested or no arguments
    if (flags.help || flags._.length === 0) {
      console.log(`Usage: aibff calibrate <deck.md> [<deck2.md> ...] [options]

Options:
  -m, --model <models>      Comma-separated list of models (default: gpt-4)
  -c, --concurrency <n>     Number of concurrent requests (default: 5)
  -f, --format <format>     Output format: toml or html (default: toml)
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
    const deckPaths = flags._.map(p => String(p));
    
    // Validate format
    if (flags.format !== "toml" && flags.format !== "html") {
      console.error("Error: Format must be 'toml' or 'html'");
      Deno.exit(1);
    }

    // Validate concurrency
    if (flags.concurrency < 1) {
      console.error("Error: Concurrency must be a positive number");
      Deno.exit(1);
    }

    const options: CalibrateOptions = {
      concurrency: flags.concurrency,
      model: flags.model,
      format: flags.format as "toml" | "html",
      output: flags.output
    };

    try {
      // Process multiple graders
      const allGraderResults: Record<string, any> = {};
      const graderOrder: string[] = [];
      
      for (const deckPath of deckPaths) {
        const graderName = deckPath.split('/').pop()?.replace('.deck.md', '') || 'grader';
        graderOrder.push(graderName);
        console.log(`\nProcessing grader: ${graderName}`);
        
        const graderResults = await runCalibrate(deckPath, options);
        
        // Structure results for HTML generator compatibility
        allGraderResults[graderName] = {
          grader: deckPath,
          models: {}
        };
        
        // Add each model's results
        for (const modelResult of graderResults) {
          const modelShortName = modelResult.model.split('/').pop() || modelResult.model;
          allGraderResults[graderName].models[modelShortName] = modelResult;
        }
      }
      
      // Write combined results
      const outputDir = options.output || '.';
      if (outputDir !== '.') {
        await Deno.mkdir(outputDir, { recursive: true });
      }
      
      if (options.format === "toml") {
        // For TOML, keep separate files per grader-model combination
        for (const [graderName, graderData] of Object.entries(allGraderResults)) {
          for (const [modelName, modelData] of Object.entries(graderData.models as Record<string, any>)) {
            const filename = deckPaths.length > 1 || flags.model.includes(',') 
              ? `${graderName}-${modelName.replace(/\//g, '-')}-results.toml`
              : 'results.toml';
            const outputPath = `${outputDir}/${filename}`;
            const tomlContent = stringifyToml(modelData as Record<string, unknown>);
            await Deno.writeTextFile(outputPath, tomlContent);
            console.log(`Results written to: ${outputPath}`);
          }
        }
      } else {
        // For HTML, create a single file with all results
        const evaluationData = {
          graderResults: allGraderResults,
          graderOrder
        };
        const htmlContent = generateEvaluationHtml(evaluationData as any);
        const outputPath = `${outputDir}/results.html`;
        await Deno.writeTextFile(outputPath, htmlContent);
        console.log(`Results written to: ${outputPath}`);
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      Deno.exit(1);
    }
  },
};

// Support direct execution
if (import.meta.main) {
  await calibrateCommand.run(Deno.args);
}