#!/usr/bin/env -S deno run --allow-net --allow-env --allow-write --allow-read

/**
 * Complete pipeline to fetch invoice data from Extend API and convert to JSONL
 * Usage: deno run --allow-net --allow-env --allow-write --allow-read extend-pipeline.ts
 */

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface ExtendFile {
  id: string;
  name: string;
  createdAt: string;
}

interface SpatialTextResult {
  fileId: string;
  fileName: string;
  createdAt: string;
  markdown: string | null;
  rawText: string | null;
}
const EXTEND_API_KEY = getConfigurationVariable("EXTEND_API_KEY");
const EXTEND_BASE_URL = "https://api.extend.ai";

if (!EXTEND_API_KEY) {
  logger.error("❌ EXTEND_API_KEY environment variable is required");
  Deno.exit(1);
}

async function step1_fetchFiles() {
  logger.info("🔄 Step 1: Fetching files from Extend API...");

  try {
    const response = await fetch(`${EXTEND_BASE_URL}/files`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${EXTEND_API_KEY}`,
        "x-extend-api-version": "2025-04-21",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Extend API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    await Deno.writeTextFile(
      "./extend_output.json",
      JSON.stringify(data, null, 2),
    );

    logger.info(
      `✅ Step 1 complete: Fetched ${data?.files?.length || "unknown"} files`,
    );
    return data.files || [];
  } catch (error) {
    logger.error("❌ Step 1 failed:", error.message);
    Deno.exit(1);
  }
}

async function step2_fetchSpatialText(files: Array<ExtendFile>) {
  logger.info(`🔄 Step 2: Fetching spatial text for ${files.length} files...`);

  const spatialTextResults = [];

  for (const file of files) {
    logger.info(`📄 Processing file: ${file.name} (${file.id})`);

    try {
      const response = await fetch(
        `${EXTEND_BASE_URL}/files/${file.id}?rawText=true&markdown=true`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${EXTEND_API_KEY}`,
            "x-extend-api-version": "2025-04-21",
          },
        },
      );

      if (!response.ok) {
        logger.warn(
          `⚠️  Failed to fetch file ${file.id}: ${response.status} ${response.statusText}`,
        );
        continue;
      }

      const fileData = await response.json();

      spatialTextResults.push({
        fileId: file.id,
        fileName: file.name,
        createdAt: file.createdAt,
        markdown: fileData.file?.contents?.pages?.[0]?.markdown || null,
        rawText: fileData.file?.contents?.rawText || null,
      });

      logger.info(`✅ Fetched spatial text for ${file.name}`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      logger.warn(`⚠️  Error processing file ${file.id}: ${error.message}`);
    }
  }

  await Deno.writeTextFile(
    "./spatial_text_output.json",
    JSON.stringify(spatialTextResults, null, 2),
  );
  logger.info(
    `✅ Step 2 complete: Fetched spatial text for ${spatialTextResults.length} files`,
  );

  return spatialTextResults;
}

async function step3_convertToJsonl(spatialTextData: Array<SpatialTextResult>) {
  logger.info(
    `🔄 Step 3: Converting ${spatialTextData.length} invoice spatial texts to JSONL...`,
  );

  const jsonlLines = [];

  for (const invoice of spatialTextData) {
    if (invoice.markdown) {
      const jsonlEntry = {
        user:
          `Extract line items from this invoice spatial text:\n\n${invoice.markdown}`,
        assistant:
          "I'll extract the line items from this invoice. Let me analyze the spatial text and provide structured JSON output.",
        metadata: {
          fileId: invoice.fileId,
          fileName: invoice.fileName,
          createdAt: invoice.createdAt,
        },
      };

      jsonlLines.push(JSON.stringify(jsonlEntry));
    }
  }

  await Deno.writeTextFile(
    "./invoice_spatial_text.jsonl",
    jsonlLines.join("\n") + "\n",
  );
  logger.info(
    `✅ Step 3 complete: Converted ${jsonlLines.length} invoices to JSONL`,
  );

  return jsonlLines.length;
}

async function runPipeline() {
  logger.info("🚀 Starting Extend invoice extraction pipeline...");
  logger.info("=====================================");

  try {
    // Step 1: Fetch file list
    const files = await step1_fetchFiles();

    // Step 2: Extract spatial text
    const spatialTextData = await step2_fetchSpatialText(files);

    // Step 3: Convert to JSONL
    const jsonlCount = await step3_convertToJsonl(spatialTextData);

    logger.info("=====================================");
    logger.info("🎉 Pipeline completed successfully!");
    logger.info(`📁 Files created:`);
    logger.info(`   - extend_output.json (${files.length} files)`);
    logger.info(
      `   - spatial_text_output.json (${spatialTextData.length} invoices with spatial text)`,
    );
    logger.info(
      `   - invoice_spatial_text.jsonl (${jsonlCount} training samples)`,
    );
  } catch (error) {
    logger.error("❌ Pipeline failed:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await runPipeline();
}
