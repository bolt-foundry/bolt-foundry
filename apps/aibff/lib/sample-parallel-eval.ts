import {
  type GradingResult,
  runEval,
} from "packages/bolt-foundry/evals/eval.ts";
import { createLimiter } from "./parallel-executor.ts";
import { parseMarkdownToDeck } from "packages/bolt-foundry/builders/markdown/markdownToDeck.ts";
import { parse as parseToml } from "@std/toml";

// Queue item representing a single sample to be processed
export interface SampleQueueItem {
  graderFile: string;
  model: string;
  sampleIndex: number;
  totalSamplesForGrader: number;
  sample: {
    id?: string;
    userMessage: string;
    assistantResponse: string;
    expected?: string;
    score?: number;
    [key: string]: unknown;
  };
  retryCount: number;
}

interface SampleLevelParallelOptions {
  graderFiles: Array<string>;
  models: Array<string>;
  inputFile?: string;
  concurrency: number;
  verbose?: boolean;
  onSampleComplete?: (
    queueItem: SampleQueueItem,
    result: GradingResult,
    completedCount: number,
    totalCount: number,
  ) => void;
  onError?: (
    queueItem: SampleQueueItem,
    error: Error,
    retryCount: number,
  ) => void;
}

interface SampleLevelParallelResult {
  totalSamples: number;
  completedSamples: number;
  failedSamples: number;
}

// Helper function to load samples from a grader file or external input
async function loadSamples(
  graderFile: string,
  inputFile?: string,
): Promise<Array<SampleQueueItem["sample"]>> {
  const samples: Array<SampleQueueItem["sample"]> = [];

  if (inputFile) {
    // Load from external file
    const content = await Deno.readTextFile(inputFile);
    
    if (inputFile.endsWith(".jsonl")) {
      // Parse JSONL - each line is a JSON object
      const lines = content.trim().split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const sample = JSON.parse(line) as Record<string, unknown>;
          samples.push({
            id: sample.id as string | undefined,
            userMessage: sample.userMessage as string || sample.user as string,
            assistantResponse: sample.assistantResponse as string || sample.assistant as string,
            expected: sample.expected as string | undefined,
            score: sample.score as number | undefined,
            ...sample,
          });
        } catch (error) {
          throw new Error(
            `Invalid JSON on line ${i + 1}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }
    } else if (inputFile.endsWith(".toml")) {
      // Parse TOML
      const data = parseToml(content) as Record<string, unknown>;
      const tomlSamples = data.samples as Array<Record<string, unknown>> || [];
      
      for (const sample of tomlSamples) {
        const messages = sample.messages as Record<string, string> || {};
        samples.push({
          id: sample.id as string | undefined,
          userMessage: messages.user || "",
          assistantResponse: messages.assistant || "",
          expected: sample.expected as string | undefined,
          score: sample.score as number | undefined,
          ...sample,
        });
      }
    }
  } else {
    // Load embedded samples from grader markdown
    const content = await Deno.readTextFile(graderFile);
    const basePath = graderFile.substring(0, graderFile.lastIndexOf("/"));
    const parsedDeck = await parseMarkdownToDeck(content, basePath);
    
    // Convert embedded samples to our format
    for (const [id, sample] of Object.entries(parsedDeck.samples)) {
      const messages = sample.messages as Record<string, string> | undefined;
      samples.push({
        id,
        userMessage: messages?.user || "",
        assistantResponse: messages?.assistant || "",
        expected: sample.expected as string | undefined,
        score: sample.score as number | undefined,
      });
    }
  }

  return samples;
}

// Create interleaved queue of samples from all grader-model combinations
function createSampleQueue(
  graderFiles: Array<string>,
  models: Array<string>,
  samplesMap: Map<string, Array<SampleQueueItem["sample"]>>,
): Array<SampleQueueItem> {
  const queue: Array<SampleQueueItem> = [];
  
  // Find the maximum number of samples across all graders
  let maxSamples = 0;
  for (const samples of samplesMap.values()) {
    maxSamples = Math.max(maxSamples, samples.length);
  }
  
  // Interleave samples in round-robin fashion
  for (let sampleIndex = 0; sampleIndex < maxSamples; sampleIndex++) {
    for (const graderFile of graderFiles) {
      const samples = samplesMap.get(graderFile)!;
      if (sampleIndex < samples.length) {
        for (const model of models) {
          queue.push({
            graderFile,
            model,
            sampleIndex,
            totalSamplesForGrader: samples.length,
            sample: samples[sampleIndex],
            retryCount: 0,
          });
        }
      }
    }
  }
  
  return queue;
}

// Process a single sample
async function processSample(
  queueItem: SampleQueueItem,
  verbose?: boolean,
): Promise<GradingResult> {
  // Create a temporary file with just this sample
  const tempSampleFile = await Deno.makeTempFile({ suffix: ".jsonl" });
  
  try {
    // Write sample to temp file
    const sampleData = {
      id: queueItem.sample.id,
      userMessage: queueItem.sample.userMessage,
      assistantResponse: queueItem.sample.assistantResponse,
      expected: queueItem.sample.expected,
      score: queueItem.sample.score,
    };
    
    await Deno.writeTextFile(tempSampleFile, JSON.stringify(sampleData) + "\n");
    
    // Run evaluation on this single sample
    const results = await runEval({
      graderFile: queueItem.graderFile,
      inputFile: tempSampleFile,
      model: queueItem.model,
      verbose,
    });
    
    if (results.length === 0) {
      throw new Error("No results returned from evaluation");
    }
    
    return results[0];
  } finally {
    // Clean up temp file
    try {
      await Deno.remove(tempSampleFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export async function runSampleLevelParallelEval(
  options: SampleLevelParallelOptions,
): Promise<SampleLevelParallelResult> {
  const {
    graderFiles,
    models,
    inputFile,
    concurrency,
    verbose,
    onSampleComplete,
    onError,
  } = options;
  
  // Load samples for each grader
  const samplesMap = new Map<string, Array<SampleQueueItem["sample"]>>();
  
  for (const graderFile of graderFiles) {
    const samples = await loadSamples(graderFile, inputFile);
    samplesMap.set(graderFile, samples);
  }
  
  // Create interleaved queue
  const queue = createSampleQueue(graderFiles, models, samplesMap);
  const totalSamples = queue.length;
  
  // Create concurrency limiter
  const limit = createLimiter(concurrency);
  
  // Track progress
  let completedSamples = 0;
  let failedSamples = 0;
  const failedItems: Array<SampleQueueItem> = [];
  
  // Process all samples with concurrency control
  const _results = await Promise.allSettled(
    queue.map((queueItem) =>
      limit(async () => {
        try {
          const result = await processSample(queueItem, verbose);
          completedSamples++;
          onSampleComplete?.(queueItem, result, completedSamples, totalSamples);
          return result;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          
          // Handle retries
          if (queueItem.retryCount < 3) {
            queueItem.retryCount++;
            onError?.(queueItem, err, queueItem.retryCount);
            
            // Add back to failed items for potential retry
            failedItems.push(queueItem);
            
            // Wait before retry (exponential backoff)
            const delayMs = 1000 * Math.pow(2, queueItem.retryCount - 1);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            
            // Retry
            try {
              const result = await processSample(queueItem, verbose);
              completedSamples++;
              onSampleComplete?.(queueItem, result, completedSamples, totalSamples);
              return result;
            } catch (retryError) {
              if (queueItem.retryCount < 3) {
                // Will be retried again
                throw retryError;
              } else {
                // Final failure
                failedSamples++;
                onError?.(queueItem, retryError instanceof Error ? retryError : new Error(String(retryError)), queueItem.retryCount);
                throw retryError;
              }
            }
          } else {
            // Max retries exceeded
            failedSamples++;
            onError?.(queueItem, err, queueItem.retryCount);
            throw err;
          }
        }
      })
    ),
  );
  
  return {
    totalSamples,
    completedSamples,
    failedSamples,
  };
}
