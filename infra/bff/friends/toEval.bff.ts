#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { walk } from "@std/fs";
import * as path from "@std/path";

const logger = getLogger(import.meta);

interface EvalSample {
  score: null;
  id: string;
  description: null;
  assistantResponse: string;
  userMessage: string;
}

export async function toEvalCommand(args: Array<string>): Promise<number> {
  // Parse arguments
  if (args.length < 3) {
    logger.error(
      "Usage: bff toEval <input-path> <output-jsonl> <input-question>",
    );
    logger.error(
      "Example: bff toEval ./docs ./output.jsonl 'Extract the main topic from this document:'",
    );
    return 1;
  }

  const inputPath = path.resolve(args[0]);
  const outputPath = path.resolve(args[1]);
  const inputQuestion = args[2];

  logger.info(`Converting files to eval samples...`);
  logger.info(`Input: ${inputPath}`);
  logger.info(`Output: ${outputPath}`);
  logger.info(`Question prefix: ${inputQuestion}`);

  try {
    // Check if input exists
    const inputStat = await Deno.stat(inputPath);

    // Collect all files to process
    const filesToProcess: string[] = [];

    if (inputStat.isFile) {
      // Single file
      const ext = path.extname(inputPath).toLowerCase();
      if (ext === ".txt" || ext === ".md") {
        filesToProcess.push(inputPath);
      } else {
        logger.error(`File ${inputPath} is not a .txt or .md file`);
        return 1;
      }
    } else if (inputStat.isDirectory) {
      // Directory - walk through it
      for await (
        const entry of walk(inputPath, {
          exts: [".txt", ".md"],
          includeDirs: false,
        })
      ) {
        filesToProcess.push(entry.path);
      }
    }

    if (filesToProcess.length === 0) {
      logger.error("No .txt or .md files found to process");
      return 1;
    }

    logger.info(`Found ${filesToProcess.length} files to process`);

    // Process each file and create samples
    const samples: EvalSample[] = [];

    for (const filePath of filesToProcess) {
      const content = await Deno.readTextFile(filePath);
      const relativePath = inputStat.isFile
        ? path.basename(filePath)
        : path.relative(inputPath, filePath);
      const fileId = relativePath.replace(/[^\w-]/g, "-").toLowerCase();

      const sample: EvalSample = {
        score: null,
        id: fileId,
        description: null,
        assistantResponse: "",
        userMessage: `${inputQuestion}\n\n${content}`,
      };

      samples.push(sample);
      logger.info(`Processed: ${relativePath}`);
    }

    // Write to output file (append mode)
    const file = await Deno.open(outputPath, {
      write: true,
      append: true,
      create: true,
    });

    const encoder = new TextEncoder();
    for (const sample of samples) {
      const line = JSON.stringify(sample) + "\n";
      await file.write(encoder.encode(line));
    }

    file.close();

    logger.info(
      `✨ Successfully appended ${samples.length} samples to ${outputPath}`,
    );
    return 0;
  } catch (error) {
    logger.error(
      `Error processing files: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 1;
  }
}

register(
  "toEval",
  "Convert text/markdown files to eval samples in JSONL format",
  toEvalCommand,
  [
    {
      option: "<input-path>",
      description: "Path to file or directory containing .txt/.md files",
    },
    {
      option: "<output-jsonl>",
      description: "Path to output JSONL file (will append if exists)",
    },
    {
      option: "<input-question>",
      description: "Question prefix to prepend to file contents",
    },
  ],
  false, // Not AI-safe as it writes files
);
