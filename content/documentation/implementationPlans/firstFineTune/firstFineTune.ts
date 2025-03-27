#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env --allow-net=api.openai.com

import { connectToOpenAi } from "@bolt-foundry/bolt-foundry";
import OpenAi from "@openai/openai";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

export const openai = new OpenAi({
  fetch: connectToOpenAi(Deno.env.get("OPENAI_API_KEY")),
});

// Hello world completion function
export async function helloWorldCompletion() {
  try {
    const completion = await openai.chat.completions.create({
      model: "jupyter-nb",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that uses casual language.",
        },
        {
          role: "user",
          content: "What's the benefit of fine-tuning?",
        },
      ],
    });

    logger.info("Response:", completion.choices[0]?.message.content);
    return completion.choices[0]?.message.content;
  } catch (error) {
    logger.error("Error in completion:", error);
    throw error;
  }
}

// Hard-coded fine-tuning dataset
const hardcodedTrainingData = [
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "Tell me about fine-tuning." },
      {
        role: "assistant",
        content:
          "Fine-tuning is a way to customize AI models like me to better fit your specific needs! It involves training the model on your own examples so I can learn your preferred style, terminology, and types of responses. It's super helpful when you want consistent answers that match your organization's voice.",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "What's the benefit of fine-tuning?" },
      {
        role: "assistant",
        content:
          "The cool thing about fine-tuning is that it helps me understand exactly what you're looking for! It can make me better at specialized tasks, more consistent in how I respond, and more aligned with what you need. It's like giving me special training to be your perfect assistant!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "How long does fine-tuning take?" },
      {
        role: "assistant",
        content:
          "Fine-tuning usually takes anywhere from a few minutes to a few hours, depending on how much data you're using and how complex the task is. The good news is that once it's done, you've got a custom model that's ready to go whenever you need it!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "What kind of data do I need for fine-tuning?" },
      {
        role: "assistant",
        content:
          "For fine-tuning, you'll want to gather examples that show exactly how you'd like me to respond! The better and more diverse your examples are, the better I'll understand what you're looking for. Aim for at least 10 examples to start with, but more is definitely better if you want me to really nail your style!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "Is fine-tuning expensive?" },
      {
        role: "assistant",
        content:
          "Fine-tuning is actually pretty affordable these days! The exact cost depends on how much data you're using and which model you're starting with, but it's way more cost-effective than building a model from scratch. Plus, once you've got your fine-tuned model, it can save you money on each request compared to using more complex prompts!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "Can I update a fine-tuned model later?" },
      {
        role: "assistant",
        content:
          "Absolutely! As your needs evolve, you can totally update your fine-tuned model. Just gather more examples based on what you want to improve, and create a new fine-tuning job. It's like giving me a refresher course so I can keep getting better at helping you!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      {
        role: "user",
        content: "What's the difference between fine-tuning and prompting?",
      },
      {
        role: "assistant",
        content:
          "Great question! Prompting is like giving me instructions in the moment - it works for one-off tasks but can get lengthy and expensive. Fine-tuning, on the other hand, is like teaching me your preferences once so I remember them forever! It's more efficient for consistent tasks, saves on token usage, and helps me respond exactly how you want without lengthy instructions each time!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "Do fine-tuned models perform better?" },
      {
        role: "assistant",
        content:
          "They sure can! Fine-tuned models often perform way better on specific tasks because they've been specially trained for exactly what you need. It's like the difference between a general education and specialized training - both are valuable, but the specialized training helps you excel at specific things. Plus, fine-tuned models can follow your unique style and terminology much more naturally!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "How do I prepare data for fine-tuning?" },
      {
        role: "assistant",
        content:
          "Preparing data for fine-tuning is pretty straightforward! You'll want to create examples of conversations showing exactly how you want me to respond. Structure them with clear user questions and ideal assistant responses, and make sure they cover different scenarios you care about. The format is usually a simple JSONL file with each line containing a complete conversation. The key is quality over quantity - good examples help me learn exactly what you need!",
      },
    ],
  },
  {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that uses friendly, casual language.",
      },
      { role: "user", content: "What models can be fine-tuned?" },
      {
        role: "assistant",
        content:
          "Most of the popular AI models can be fine-tuned these days! With OpenAI, you can fine-tune models like GPT-3.5 Turbo, which is super versatile. Different providers offer fine-tuning for different model families. The best part is that you can usually start with a smaller model for experimentation before committing to fine-tuning the larger, more powerful ones. It's a really flexible approach!",
      },
    ],
  },
];

/**
 * Create a temporary JSONL file from the hardcoded training data
 * @returns The path to the created file
 */
async function createTemporaryTrainingFile(): Promise<string> {
  const jsonlContent = hardcodedTrainingData
    .map((example) => JSON.stringify(example))
    .join("\n");

  // Create a temporary file with the JSONL content in tmp directory
  const tempFilePath = `./tmp/training_data_${Date.now()}.jsonl`;
  await Deno.writeTextFile(tempFilePath, jsonlContent);

  logger.info(`Created temporary training file at ${tempFilePath}`);
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

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "fine-tune");

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
      suffix: "bolt-foundry-prototype",
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
 * Run a complete fine-tuning process with hardcoded data
 * This function orchestrates the entire fine-tuning workflow
 * and waits for the process to complete
 */
export async function runHardcodedFineTune(): Promise<{
  fileId: string;
  jobId: string;
  fineTunedModel: string;
  testResponse: string;
}> {
  try {
    logger.info("Starting complete fine-tuning process...");

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

    // Step 6: Test the fine-tuned model
    const modelId = completedJob.fine_tuned_model;
    const testResponse = await useFineTunedModel(
      modelId,
      "Tell me about using fine-tuned models",
    );

    // Step 7: Clean up the temporary file
    try {
      await Deno.remove(filePath);
      logger.info(`Removed temporary file: ${filePath}`);
    } catch (cleanupError) {
      logger.warn(`Failed to remove temporary file: ${cleanupError.message}`);
    }

    return {
      fileId,
      jobId,
      fineTunedModel: modelId,
      testResponse,
    };
  } catch (error) {
    logger.error("Error in complete fine-tuning process:", error);
    throw error;
  }
}

/**
 * Use a fine-tuned model to generate a completion
 * @param modelId The ID of the fine-tuned model
 * @param prompt The user prompt to generate a completion for
 */
export async function useFineTunedModel(
  modelId: string,
  prompt: string,
): Promise<string> {
  try {
    logger.info(`Using fine-tuned model: ${modelId}`);

    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that uses friendly, casual language.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0]?.message.content ||
      "No response generated";
    logger.info("Fine-tuned model response:", response);
    return response;
  } catch (error) {
    logger.error("Error using fine-tuned model:", error);
    throw error;
  }
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
export function displayHelp(): void {
  logger.info(`
Bolt Foundry Fine-Tuning Script
===============================

Available Commands:
------------------
- run: Run the complete fine-tuning workflow (upload, train, test)
- list: List all existing fine-tuning jobs
- status <jobId>: Check the status of a specific job
- cancel <jobId>: Cancel a running fine-tuning job
- test <modelId> <prompt>: Test a fine-tuned model with a prompt
- help: Show this help message

Example usage: 
deno run -A firstFineTune.ts run
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
        logger.info("Running complete fine-tuning workflow...");
        const result = await runHardcodedFineTune();
        logger.info("Fine-tuning completed successfully:", result);
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
        const response = await useFineTunedModel(modelId, prompt);
        logger.info(`Response: ${response}`);
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
  return helloWorldCompletion();
}

// Execute if run directly from command line
if (import.meta.main) {
  await handleCommandLineArgs();
}
