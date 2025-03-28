#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env --allow-net=api.openai.com

// deno-lint-ignore-file

import { connectToOpenAi } from "@bolt-foundry/bolt-foundry";
import OpenAi from "@openai/openai";
import { getLogger } from "packages/logger.ts";
import { isValidJSON } from "lib/jsonUtils.ts";
import systemPromptVariations from "./promptCases.json" with { type: "json" };
import holdoutCases from "./holdoutCases.json" with { type: "json" };
import jailbreakCases from "./jailbreaks.json" with { type: "json" };
import jsonTrainingData from "./trainingCases.json" with { type: "json" };
import { messages } from "https://esm.sh/@replit/extensions@1.10.0/dist/index.d.ts";

const logger = getLogger(import.meta);

export const openai = new OpenAi({
  fetch: connectToOpenAi(Deno.env.get("OPENAI_API_KEY")),
});

// Test function to verify valid JSON output
export async function testJsonCompletion() {
  try {
    const completion = await openai.chat.completions.create({
      model: "jupyter-nb",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that always responds with valid JSON.",
        },
        {
          role: "user",
          content: "Give me information about fine-tuning in JSON format.",
        },
      ],
    });

    const response = completion.choices[0]?.message.content || "";
    const isValid = isValidJSON(response);

    logger.info("Response:", response);
    logger.info(`Is valid JSON: ${isValid}`);

    return { response, isValid };
  } catch (error) {
    logger.error("Error in completion:", error);
    throw error;
  }
}

function createTrainingExamplesWithVariedPrompts(
  userQuery: string,
  jsonResponse: string,
) {
  return systemPromptVariations.map((systemPrompt) => ({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userQuery,
      },
      {
        role: "assistant",
        content: jsonResponse,
      },
    ],
  }));
}

/**
 * Generate training data from trainingCases.json and systemPromptVariations
 * @returns Array of JSONL-formatted training examples
 */
function generateJsonTrainingData() {
  // Combine each query with each system prompt for more variety
  const outputTrainingData = [];

  for (const example of jsonTrainingData) {
    const examplesForThisQuery = createTrainingExamplesWithVariedPrompts(
      example.query,
      example.response,
    );
    outputTrainingData.push(...examplesForThisQuery);
  }

  logger.info(
    `Generated ${jsonTrainingData.length} training examples from basic templates`,
  );
  return outputTrainingData;
}

/**
 * Create a temporary JSONL file from the JSON training data
 * @returns The path to the created file
 */
async function createTemporaryTrainingFile(): Promise<string> {
  const jsonlContent = generateJsonTrainingData()
    .map((example) => JSON.stringify(example))
    .join("\n");

  // Create a temporary file with the JSONL content in tmp directory
  const tempFilePath = `./tmp/json_training_data_${Date.now()}.jsonl`;
  await Deno.writeTextFile(tempFilePath, jsonlContent);

  logger.info(`Created temporary JSON training file at ${tempFilePath}`);
  return tempFilePath;
}

/**
 * Upload a training file to OpenAI using the SDK
 * @param filePath Path to the JSONL file
 * @returns The file ID from OpenAI
 */
export async function uploadTrainingFile(filePath: string): Promise<string> {
  try {
    logger.info(`Uploading training file: ${filePath}`);

    // Read the file content
    const fileContent = await Deno.readTextFile(filePath);

    // Create a File object from the content
    // Note: In Deno, we need to create a File object differently than in browser
    const bytes = new TextEncoder().encode(fileContent);
    const file = new File([bytes], `${filePath.split("/").pop()}`, {
      type: "application/jsonl",
    });

    // Use the OpenAI SDK to upload the file
    const response = await openai.files.create({
      file,
      purpose: "fine-tune",
    });

    logger.info(`Successfully uploaded file with ID: ${response.id}`);
    return response.id;
  } catch (error) {
    logger.error("Error uploading training file:", error);
    throw error;
  }
}

/**
 * Wait for a file to be processed by OpenAI
 * @param fileId The ID of the uploaded file
 * @returns The processed file object
 */
export async function waitForFileProcessing(fileId: string): Promise<any> {
  try {
    logger.info(`Waiting for file ${fileId} to be processed...`);

    let file = await openai.files.retrieve(fileId);
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of attempts

    while (file.status !== "processed" && attempts < maxAttempts) {
      logger.info(`File status: ${file.status}. Waiting 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      file = await openai.files.retrieve(fileId);
      attempts++;
    }

    if (file.status !== "processed") {
      throw new Error(`File processing timed out after ${attempts} attempts`);
    }

    logger.info(`File ${fileId} successfully processed`);
    return file;
  } catch (error) {
    logger.error(`Error waiting for file processing: ${error}`);
    throw error;
  }
}

/**
 * Create a fine-tuning job with the given training file using the SDK
 * @param fileId The ID of the uploaded training file
 * @returns The ID of the created fine-tuning job
 */
export async function createFineTuningJob(fileId: string): Promise<string> {
  try {
    logger.info(`Creating fine-tuning job with file: ${fileId}`);

    // Use the OpenAI SDK to create a fine-tuning job
    const fineTuningJob = await openai.fineTuning.jobs.create({
      training_file: fileId,
      model: "gpt-3.5-turbo",
      suffix: "json-output-only",
      hyperparameters: {
        batch_size: 8,
        learning_rate_multiplier: 1.5,
        n_epochs: 1,
      },
    });

    logger.info(
      `Successfully created fine-tuning job with ID: ${fineTuningJob.id}`,
    );
    return fineTuningJob.id;
  } catch (error) {
    logger.error("Error creating fine-tuning job:", error);
    throw error;
  }
}

/**
 * Check the status of a fine-tuning job using the SDK
 * @param jobId The ID of the fine-tuning job
 * @returns The current status of the job
 */
export async function checkFineTuningStatus(jobId: string): Promise<any> {
  try {
    logger.debug(`Checking status of fine-tuning job: ${jobId}`);

    // Use the OpenAI SDK to retrieve the job status
    const fineTuningJob = await openai.fineTuning.jobs.retrieve(jobId);

    logger.debug(`Fine-tuning job status: ${fineTuningJob.status}`);
    return fineTuningJob;
  } catch (error) {
    logger.error("Error checking fine-tuning status:", error);
    throw error;
  }
}

/**
 * Wait for a fine-tuning job to complete
 * @param jobId The ID of the fine-tuning job
 * @param checkIntervalMs How often to check the status (in milliseconds)
 * @param timeoutMs Maximum time to wait (in milliseconds)
 * @returns The completed fine-tuning job
 */
export async function waitForFineTuningCompletion(
  jobId: string,
  checkIntervalMs = 30000,
  timeoutMs = 7200000,
): Promise<any> {
  try {
    logger.info(`Waiting for fine-tuning job ${jobId} to complete...`);

    const startTime = Date.now();
    let job = await checkFineTuningStatus(jobId);

    while (
      !["succeeded", "failed", "cancelled"].includes(job.status) &&
      (Date.now() - startTime) < timeoutMs
    ) {
      logger.info(
        `Job status: ${job.status}. Waiting ${
          checkIntervalMs / 1000
        } seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
      job = await checkFineTuningStatus(jobId);
    }

    if (!["succeeded", "failed", "cancelled"].includes(job.status)) {
      throw new Error(
        `Fine-tuning job timed out after ${timeoutMs / 1000} seconds`,
      );
    }

    if (job.status === "failed") {
      throw new Error(
        `Fine-tuning job failed: ${JSON.stringify(job.error || {})}`,
      );
    }

    if (job.status === "cancelled") {
      throw new Error("Fine-tuning job was cancelled");
    }

    logger.info(
      `Fine-tuning job completed successfully with status: ${job.status}`,
    );
    logger.info(`Fine-tuned model ID: ${job.fine_tuned_model}`);

    return job;
  } catch (error) {
    logger.error("Error waiting for fine-tuning completion:", error);
    throw error;
  }
}

/**
 * List all fine-tuning jobs using the SDK
 * @returns Array of fine-tuning jobs
 */
export async function listFineTuningJobs(): Promise<any[]> {
  try {
    logger.info("Listing all fine-tuning jobs");

    // Use the OpenAI SDK to list fine-tuning jobs
    const result = await openai.fineTuning.jobs.list();

    logger.info(`Found ${result.data.length} fine-tuning jobs`);
    return result.data;
  } catch (error) {
    logger.error("Error listing fine-tuning jobs:", error);
    throw error;
  }
}

/**
 * Run a complete fine-tuning process for JSON output
 * This function orchestrates the entire fine-tuning workflow
 * and waits for the process to complete
 */
export async function runJsonFineTune(): Promise<{
  fileId: string;
  jobId: string;
  fineTunedModel: string;
  testResponse: string;
  isValidJson: boolean;
}> {
  try {
    logger.info("Starting JSON fine-tuning process...");

    // Step 1: Create the training file
    const filePath = await createTemporaryTrainingFile();

    // Step 2: Upload the file to OpenAI
    const fileId = await uploadTrainingFile(filePath);

    // Step 3: Wait for the file to be processed
    await waitForFileProcessing(fileId);

    // Step 4: Create a fine-tuning job
    const jobId = await createFineTuningJob(fileId);

    // Step 5: Wait for the fine-tuning to complete
    const completedJob = await waitForFineTuningCompletion(jobId);

    // Step 6: Test the fine-tuned model with a JSON validation
    const modelId = completedJob.fine_tuned_model;
    const { response, isValid } = await testJsonFineTunedModel(
      modelId,
      "Tell me about the planets in our solar system",
    );

    // Step 7: Clean up the temporary file
    try {
      await Deno.remove(filePath);
      logger.info(`Removed temporary file: ${filePath}`);
    } catch (cleanupError) {
      logger.warn(
        `Failed to remove temporary file: ${(cleanupError as Error).message}`,
      );
    }

    return {
      fileId,
      jobId,
      fineTunedModel: modelId,
      testResponse: response,
      isValidJson: isValid,
    };
  } catch (error) {
    logger.error("Error in JSON fine-tuning process:", error);
    throw error;
  }
}

/**
 * Use a fine-tuned model to generate a JSON completion and validate it
 * @param modelId The ID of the fine-tuned model
 * @param prompt The user prompt to generate a completion for
 */
export async function testJsonFineTunedModel(
  modelId: string,
  prompt: string,
): Promise<{ response: string; isValid: boolean }> {
  try {
    logger.info(`Testing JSON fine-tuned model: ${modelId}`);

    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "system",
          content:
            "You are a somewhat sarcastic assistant who only responds in valid JSON. You will be reviewing the prompt below, and providing information back with a specific Schema. it should say {whatYouAreThinking: '$THOUGHT', whatIAMThinking: '$THOUGHTS', whatNobodyIsThinking: '$THOUGHT'}",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message.content || "{}";
    const isValid = isValidJSON(response);

    logger.info("Fine-tuned model response:", response);
    logger.info(`Is valid JSON: ${isValid}`);

    return { response, isValid };
  } catch (error) {
    logger.error("Error using fine-tuned model:", error);
    throw error;
  }
}

/**
 * Evaluate a fine-tuned model by running multiple test cases and calculating JSON validity rate
 * @param modelId The ID of the fine-tuned model
 * @param testCases Array of test prompts
 */
export async function evaluateJsonModel(
  modelId: string,
  testCases: string[] = [
    "Tell me about fine-tuning",
    "Compare cats and dogs",
    "List the planets",
    "What are the primary colors?",
    "Give me a recipe for chocolate chip cookies",
    "What's your favorite movie?",
    "Tell me about the weather",
    "How do computers work?",
    "What are some popular books?",
    "Explain quantum physics",
    "What is JSON?",
  ],
): Promise<{ validCount: number; totalCount: number; validRate: number }> {
  logger.info(`Evaluating JSON fine-tuned model: ${modelId}`);

  let validCount = 0;
  const totalCount = testCases.length;

  for (const prompt of testCases) {
    try {
      const { isValid } = await testJsonFineTunedModel(modelId, prompt);
      if (isValid) validCount++;
    } catch (error) {
      logger.error(`Error testing prompt "${prompt}":`, error);
    }
  }

  const validRate = (validCount / totalCount) * 100;

  logger.info(
    `JSON Validation Results: ${validCount}/${totalCount} (${
      validRate.toFixed(2)
    }%) responses were valid JSON`,
  );

  return {
    validCount,
    totalCount,
    validRate,
  };
}

/**
 * Cancel a fine-tuning job
 * @param jobId The ID of the fine-tuning job to cancel
 */
export async function cancelFineTuningJob(jobId: string): Promise<any> {
  try {
    logger.info(`Cancelling fine-tuning job: ${jobId}`);

    const result = await openai.fineTuning.jobs.cancel(jobId);

    logger.info(`Job ${jobId} cancelled successfully`);
    return result;
  } catch (error) {
    logger.error(`Error cancelling job ${jobId}:`, error);
    throw error;
  }
}

/**
 * Displays a summary of all available commands
 */
/**
 * Updates to the displayHelp function to include the compare command
 */
export function displayHelp(): void {
  logger.info(`
  Bolt Foundry JSON Fine-Tuning Script
  ====================================

  Available Commands:
  ------------------
  - run: Run the complete JSON fine-tuning workflow (upload, train, test)
  - list: List all existing fine-tuning jobs
  - status <jobId>: Check the status of a specific job
  - cancel <jobId>: Cancel a running fine-tuning job
  - test <modelId> <prompt>: Test a fine-tuned model with a prompt
  - evaluate <modelId>: Run evaluation tests on a fine-tuned model
  - compare <model1Id> <model2Id> [sampleSize]: Compare two models side by side
  - help: Show this help message

  Example usage: 
  deno run -A firstFineTune.ts run
  deno run -A firstFineTune.ts compare ft:gpt-3.5-turbo-0125:model1 ft:gpt-3.5-turbo-0125:model2 50
  `);
}

/**
 * Parse command-line arguments and run the appropriate function
 */
async function handleCommandLineArgs(): Promise<void> {
  const args = Deno.args;
  const command = args[0]?.toLowerCase();

  if (!command || command === "help") {
    displayHelp();
    return;
  }

  try {
    switch (command) {
      case "run": {
        logger.info("Running JSON fine-tuning workflow...");
        const result = await runJsonFineTune();
        logger.info("JSON fine-tuning completed successfully:", result);
        break;
      }

      case "list": {
        const jobs = await listFineTuningJobs();
        logger.info("Fine-tuning jobs:", jobs);
        break;
      }

      case "status": {
        const jobId = args[1];
        if (!jobId) {
          logger.error("Missing job ID. Usage: status <jobId>");
          break;
        }
        const status = await checkFineTuningStatus(jobId);
        logger.info(`Status for job ${jobId}:`, status);
        break;
      }
      case "jailbreak": {
        await handleJailbreakCommand(args.slice(1));
        break;
      }

      case "cancel": {
        const cancelJobId = args[1];
        if (!cancelJobId) {
          logger.error("Missing job ID. Usage: cancel <jobId>");
          break;
        }
        await cancelFineTuningJob(cancelJobId);
        break;
      }

      case "test": {
        const modelId = args[1];
        const prompt = args.slice(2).join(" ");
        if (!modelId || !prompt) {
          logger.error(
            "Missing model ID or prompt. Usage: test <modelId> <prompt>",
          );
          break;
        }
        const { response, isValid } = await testJsonFineTunedModel(
          modelId,
          prompt,
        );
        logger.info(`Response: ${response}`);
        logger.info(`Valid JSON: ${isValid}`);
        break;
      }

      case "evaluate": {
        const modelId = args[1];
        if (!modelId) {
          logger.error("Missing model ID. Usage: evaluate <modelId>");
          break;
        }
        await evaluateJsonModel(modelId);
        break;
      }

      case "compare": {
        await handleCompareCommand(args);
        break;
      }

      default: {
        logger.error(`Unknown command: ${command}`);
        displayHelp();
      }
    }
  } catch (error) {
    logger.error(`Error executing command ${command}:`, error);
  }
}

// Example usage for Jupyter notebook
export function nb() {
  return testJsonCompletion();
}

// Execute if run directly from command line
if (import.meta.main) {
  await handleCommandLineArgs();
}

/**
 * Compare two fine-tuned models by running the same test cases on both in parallel
 * @param model1Id The ID of the first fine-tuned model
 * @param model2Id The ID of the second fine-tuned model
 * @param sampleSize Number of test cases to sample (default: 50)
 * @param testCases Array of test prompts to sample from (defaults to combined test cases)
 * @returns Comparison results for both models
 */
export async function compareJsonModels(
  model1Id: string,
  model2Id: string,
  sampleSize: number = 50,
  testCases: string[] = holdoutCases.slice(0, 500), // Limit to first 500 to keep reasonable
): Promise<{
  model1: {
    id: string;
    validCount: number;
    totalCount: number;
    validRate: number;
    results: Array<{ prompt: string; isValid: boolean; response: string }>;
  };
  model2: {
    id: string;
    validCount: number;
    totalCount: number;
    validRate: number;
    results: Array<{ prompt: string; isValid: boolean; response: string }>;
  };
  improvement: number; // Percentage points improvement (can be negative)
}> {
  logger.info(`Comparing JSON fine-tuned models: ${model1Id} vs ${model2Id}`);
  logger.info(`Using sample size: ${sampleSize}`);

  // Randomly sample test cases
  const sampledTestCases = sampleTestCases(testCases, sampleSize);
  logger.info(`Selected ${sampledTestCases.length} test cases`);

  // Run evaluations in parallel
  const [model1Results, model2Results] = await Promise.all([
    evaluateModelWithDetails(model1Id, sampledTestCases),
    evaluateModelWithDetails(model2Id, sampledTestCases),
  ]);

  const improvement = model2Results.validRate - model1Results.validRate;

  logger.info(
    `Model ${model1Id}: ${
      model1Results.validRate.toFixed(2)
    }% valid JSON responses`,
  );
  logger.info(
    `Model ${model2Id}: ${
      model2Results.validRate.toFixed(2)
    }% valid JSON responses`,
  );
  logger.info(`Improvement: ${improvement.toFixed(2)} percentage points`);

  // Return comprehensive results
  return {
    model1: {
      id: model1Id,
      validCount: model1Results.validCount,
      totalCount: model1Results.totalCount,
      validRate: model1Results.validRate,
      results: model1Results.details,
    },
    model2: {
      id: model2Id,
      validCount: model2Results.validCount,
      totalCount: model2Results.totalCount,
      validRate: model2Results.validRate,
      results: model2Results.details,
    },
    improvement,
  };
}

/**
 * Randomly sample test cases from a larger set
 * @param testCases Array of all test cases
 * @param sampleSize Number of test cases to sample
 * @returns Array of sampled test cases
 */
function sampleTestCases(testCases: string[], sampleSize: number): string[] {
  // If sample size is larger than available test cases, return all test cases
  if (sampleSize >= testCases.length) {
    return [...testCases];
  }

  // Create a copy of the array to avoid modifying the original
  const allTestCases = [...testCases];
  const sampledCases: string[] = [];

  // Randomly select test cases
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * allTestCases.length);
    sampledCases.push(allTestCases[randomIndex]);
    // Remove the selected item to avoid duplicates
    allTestCases.splice(randomIndex, 1);
  }

  return sampledCases;
}

/**
 * Enhanced version of evaluateJsonModel that returns detailed results for each test case
 * @param modelId The ID of the fine-tuned model
 * @param testCases Array of test prompts
 */
async function evaluateModelWithDetails(
  modelId: string,
  testCases: string[],
): Promise<{
  validCount: number;
  totalCount: number;
  validRate: number;
  details: Array<{ prompt: string; isValid: boolean; response: string }>;
}> {
  logger.info(`Evaluating JSON model with details: ${modelId}`);

  let validCount = 0;
  const totalCount = testCases.length;
  const details: Array<{ prompt: string; isValid: boolean; response: string }> =
    [];

  // Process test cases with concurrency limit to avoid rate limiting
  const concurrencyLimit = 5;
  const batches = Math.ceil(testCases.length / concurrencyLimit);

  for (let i = 0; i < batches; i++) {
    const batchStart = i * concurrencyLimit;
    const batchEnd = Math.min(batchStart + concurrencyLimit, testCases.length);
    const batchPrompts = testCases.slice(batchStart, batchEnd);

    logger.debug(
      `Processing batch ${i + 1}/${batches} (${batchPrompts.length} prompts)`,
    );

    // Process batch in parallel
    const batchResults = await Promise.all(
      batchPrompts.map(async (prompt) => {
        try {
          const result = await testJsonFineTunedModel(modelId, prompt);
          if (result.isValid) validCount++;
          return {
            prompt,
            isValid: result.isValid,
            response: result.response,
          };
        } catch (error) {
          logger.error(`Error testing prompt "${prompt}":`, error);
          return {
            prompt,
            isValid: false,
            response: `Error: ${(error as Error).message}`,
          };
        }
      }),
    );

    details.push(...batchResults);

    // Brief pause between batches to avoid potential rate limits
    if (i < batches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const validRate = (validCount / totalCount) * 100;

  logger.info(
    `Model ${modelId} results: ${validCount}/${totalCount} (${
      validRate.toFixed(2)
    }%) responses were valid JSON`,
  );

  return {
    validCount,
    totalCount,
    validRate,
    details,
  };
}

/**
 * Generate a detailed comparison report between two models
 * @param comparisonResults Results from compareJsonModels function
 */
export function generateComparisonReport(
  comparisonResults: {
    model1: {
      id: string;
      validCount: number;
      totalCount: number;
      validRate: number;
      results: Array<{ prompt: string; isValid: boolean; response: string }>;
    };
    model2: {
      id: string;
      validCount: number;
      totalCount: number;
      validRate: number;
      results: Array<{ prompt: string; isValid: boolean; response: string }>;
    };
    improvement: number;
  },
): string {
  const { model1, model2, improvement } = comparisonResults;

  // Count cases where one model succeeded and the other failed
  const model1OnlyValid =
    model1.results.filter((r, i) => r.isValid && !model2.results[i].isValid)
      .length;
  const model2OnlyValid =
    model2.results.filter((r, i) => r.isValid && !model1.results[i].isValid)
      .length;
  const bothValid =
    model1.results.filter((r, i) => r.isValid && model2.results[i].isValid)
      .length;
  const neitherValid =
    model1.results.filter((r, i) => !r.isValid && !model2.results[i].isValid)
      .length;

  // Generate the report
  let report = `# JSON Model Comparison Report\n\n`;

  report += `## Summary\n\n`;
  report += `- **Model 1 (${model1.id})**: ${
    model1.validRate.toFixed(2)
  }% valid JSON (${model1.validCount}/${model1.totalCount})\n`;
  report += `- **Model 2 (${model2.id})**: ${
    model2.validRate.toFixed(2)
  }% valid JSON (${model2.validCount}/${model2.totalCount})\n`;
  report += `- **Improvement**: ${
    improvement.toFixed(2)
  } percentage points\n\n`;

  report += `## Detailed Comparison\n\n`;
  report += `- **Both models produced valid JSON**: ${bothValid} cases (${
    (bothValid / model1.totalCount * 100).toFixed(2)
  }%)\n`;
  report +=
    `- **Only Model 1 produced valid JSON**: ${model1OnlyValid} cases (${
      (model1OnlyValid / model1.totalCount * 100).toFixed(2)
    }%)\n`;
  report +=
    `- **Only Model 2 produced valid JSON**: ${model2OnlyValid} cases (${
      (model2OnlyValid / model1.totalCount * 100).toFixed(2)
    }%)\n`;
  report += `- **Neither model produced valid JSON**: ${neitherValid} cases (${
    (neitherValid / model1.totalCount * 100).toFixed(2)
  }%)\n\n`;

  report += `## Test Case Analysis\n\n`;

  // Find interesting cases where models differed
  if (model1OnlyValid > 0) {
    report += `### Cases where only Model 1 succeeded\n\n`;
    const examples = model1.results
      .filter((r, i) => r.isValid && !model2.results[i].isValid)
      .slice(0, 3); // Show up to 3 examples

    examples.forEach((example, i) => {
      report += `#### Example ${i + 1}\n\n`;
      report += `**Prompt**: "${example.prompt.substring(0, 100)}${
        example.prompt.length > 100 ? "..." : ""
      }"\n\n`;
      report += `**Model 1 response**: Valid JSON\n\`\`\`json\n${
        example.response.substring(0, 300)
      }${example.response.length > 300 ? "..." : ""}\n\`\`\`\n\n`;

      const model2Response = model2.results.find((r) =>
        r.prompt === example.prompt
      )?.response || "";
      report += `**Model 2 response**: Invalid JSON\n\`\`\`\n${
        model2Response.substring(0, 300)
      }${model2Response.length > 300 ? "..." : ""}\n\`\`\`\n\n`;
    });
  }

  if (model2OnlyValid > 0) {
    report += `### Cases where only Model 2 succeeded\n\n`;
    const examples = model2.results
      .filter((r, i) => r.isValid && !model1.results[i].isValid)
      .slice(0, 3); // Show up to 3 examples

    examples.forEach((example, i) => {
      report += `#### Example ${i + 1}\n\n`;
      report += `**Prompt**: "${example.prompt.substring(0, 100)}${
        example.prompt.length > 100 ? "..." : ""
      }"\n\n`;

      const model1Response = model1.results.find((r) =>
        r.prompt === example.prompt
      )?.response || "";
      report += `**Model 1 response**: Invalid JSON\n\`\`\`\n${
        model1Response.substring(0, 300)
      }${model1Response.length > 300 ? "..." : ""}\n\`\`\`\n\n`;

      report += `**Model 2 response**: Valid JSON\n\`\`\`json\n${
        example.response.substring(0, 300)
      }${example.response.length > 300 ? "..." : ""}\n\`\`\`\n\n`;
    });
  }

  report += `## Conclusion\n\n`;
  if (improvement > 0) {
    report += `Model 2 (${model2.id}) shows an improvement of ${
      improvement.toFixed(2)
    } percentage points over Model 1 (${model1.id}) in producing valid JSON responses. `;
    report += `This represents a ${
      (improvement / model1.validRate * 100).toFixed(2)
    }% relative improvement in JSON validity rate.`;
  } else if (improvement < 0) {
    report +=
      `Model 1 (${model1.id}) performed better than Model 2 (${model2.id}) by ${
        Math.abs(improvement).toFixed(2)
      } percentage points in producing valid JSON responses. `;
    report += `This represents a ${
      (Math.abs(improvement) / model2.validRate * 100).toFixed(2)
    }% relative degradation in JSON validity rate for Model 2.`;
  } else {
    report +=
      `Both models performed equally in terms of JSON validity, with identical validity rates of ${
        model1.validRate.toFixed(2)
      }%.`;
  }

  return report;
}

/**
 * Add this function to the CLI command handler
 */
export async function handleCompareCommand(args: string[]): Promise<number> {
  const model1Id = args[1];
  const model2Id = args[2];
  const sampleSizeArg = args[3];

  if (!model1Id || !model2Id) {
    logger.error(
      "Missing model IDs. Usage: compare <model1Id> <model2Id> [sampleSize]",
    );
    return 1;
  }

  const sampleSize = sampleSizeArg ? parseInt(sampleSizeArg, 10) : 50;

  if (isNaN(sampleSize) || sampleSize <= 0) {
    logger.error("Invalid sample size. Please provide a positive number.");
    return 1;
  }

  try {
    logger.info(
      `Comparing models: ${model1Id} vs ${model2Id} with ${sampleSize} samples...`,
    );
    const results = await compareJsonModels(model1Id, model2Id, sampleSize);

    // Generate and print a detailed report
    const report = generateComparisonReport(results);
    logger.info("\nComparison report:");
    logger.info(report);

    // Save the report to a file
    const reportFileName = `model_comparison_${Date.now()}.md`;
    await Deno.writeTextFile(reportFileName, report);
    logger.info(`Detailed report saved to ${reportFileName}`);
    return 0;
  } catch (error) {
    logger.error(`Error comparing models:`, error);
    return 1;
  }
}

// 8. Add the testJailbreakResistance function
/**
 * Test a model's resistance to JSON jailbreaks
 * @param modelId The ID of the fine-tuned model
 * @param jailbreakPrompts Array of jailbreak prompts (defaults to jailbreakCases)
 */
export async function testJailbreakResistance(
  modelId: string,
  jailbreakPrompts: string[] = jailbreakCases.slice(0, 10), // Use first 10 jailbreak cases by default
): Promise<
  { resistantCount: number; totalCount: number; resistanceRate: number }
> {
  logger.info(`Testing jailbreak resistance for model: ${modelId}`);

  let resistantCount = 0;
  const totalCount = jailbreakPrompts.length;

  for (const prompt of jailbreakPrompts) {
    try {
      const { isValid } = await testJsonFineTunedModel(modelId, prompt);
      // If output is valid JSON, the model resisted the jailbreak
      if (isValid) resistantCount++;
    } catch (error) {
      logger.error(`Error testing jailbreak prompt:`, error);
    }
  }

  const resistanceRate = (resistantCount / totalCount) * 100;

  logger.info(
    `Jailbreak Resistance Results: ${resistantCount}/${totalCount} (${
      resistanceRate.toFixed(2)
    }%) attempts were resisted`,
  );

  return {
    resistantCount,
    totalCount,
    resistanceRate,
  };
}
// 7. Add the handleJailbreakCommand function
/**
 * Handle the jailbreak command
 */
export async function handleJailbreakCommand(args: string[]): Promise<number> {
  const modelId = args[0];
  if (!modelId) {
    logger.error("Missing model ID. Usage: jailbreak <modelId>");
    return 1;
  }

  const sampleSize = args[1] ? parseInt(args[1], 10) : 10;
  if (isNaN(sampleSize) || sampleSize <= 0) {
    logger.error("Invalid sample size. Please provide a positive number.");
    return 1;
  }

  try {
    await testJailbreakResistance(modelId, jailbreakCases.slice(0, sampleSize));
    return 0;
  } catch (error) {
    logger.error("Error testing jailbreak resistance:", error);
    return 1;
  }
}
