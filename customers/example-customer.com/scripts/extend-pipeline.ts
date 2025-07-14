#!/usr/bin/env -S deno run --allow-net --allow-env --allow-write --allow-read

/**
 * Complete pipeline to fetch invoice data from Extend API and convert to JSONL
 * Usage: deno run --allow-net --allow-env --allow-write --allow-read extend-pipeline.ts [output-dir]
 *
 * Arguments:
 *   output-dir: Directory to write output files (default: ./output)
 */

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { ui } from "@bolt-foundry/cli-ui";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";

const EXTEND_API_KEY = getConfigurationVariable("EXTEND_API_KEY");
const EXTEND_BASE_URL = "https://api.extend.ai";
const OUTPUT_DIR = Deno.args[0] || "./output";

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

interface JsonlEntry {
  user: string;
  assistant: string;
  metadata: {
    fileId: string;
    fileName: string;
    createdAt: string;
  };
}

if (!EXTEND_API_KEY) {
  ui.error("❌ EXTEND_API_KEY environment variable is required");
  Deno.exit(1);
}

async function step1_fetchFiles(): Promise<Array<ExtendFile>> {
  ui.info("🔄 Step 1: Fetching files from Extend API...");
  await ensureDir(OUTPUT_DIR);

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
      join(OUTPUT_DIR, "extend_output.json"),
      JSON.stringify(data, null, 2),
    );

    ui.info(
      `✅ Step 1 complete: Fetched ${data?.files?.length || "unknown"} files`,
    );
    return data.files || [];
  } catch (error) {
    ui.error(
      `❌ Step 1 failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    Deno.exit(1);
  }
}

async function step2_fetchSpatialText(
  files: Array<ExtendFile>,
): Promise<Array<SpatialTextResult>> {
  ui.info(`🔄 Step 2: Fetching spatial text for ${files.length} files...`);

  const spatialTextResults: Array<SpatialTextResult> = [];

  for (const file of files) {
    ui.info(`📄 Processing file: ${file.name} (${file.id}`);

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
        ui.warn(
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

      ui.info(`✅ Fetched spatial text for ${file.name}`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      ui.warn(
        `⚠️  Error processing file ${file.id}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  await Deno.writeTextFile(
    join(OUTPUT_DIR, "spatial_text_output.json"),
    JSON.stringify(spatialTextResults, null, 2),
  );
  ui.info(
    `✅ Step 2 complete: Fetched spatial text for ${spatialTextResults.length} files`,
  );

  return spatialTextResults;
}

async function step3_convertToJsonl(
  spatialTextData: Array<SpatialTextResult>,
): Promise<number> {
  ui.info(
    `🔄 Step 3: Converting ${spatialTextData.length} invoice spatial texts to JSONL...`,
  );

  const jsonlLines: Array<string> = [];

  for (const invoice of spatialTextData) {
    if (invoice.markdown) {
      const jsonlEntry: JsonlEntry = {
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
    join(OUTPUT_DIR, "invoice_spatial_text.jsonl"),
    jsonlLines.join("\n") + "\n",
  );
  ui.info(
    `✅ Step 3 complete: Converted ${jsonlLines.length} invoices to JSONL`,
  );

  return jsonlLines.length;
}

async function runPipeline(): Promise<void> {
  ui.info("🚀 Starting Extend invoice extraction pipeline...");
  ui.info(`📁 Output directory: ${OUTPUT_DIR}`);
  ui.info("=====================================");

  try {
    // Step 1: Fetch file list
    const files = await step1_fetchFiles();

    // Step 2: Extract spatial text
    const spatialTextData = await step2_fetchSpatialText(files);

    // Step 3: Convert to JSONL
    const jsonlCount = await step3_convertToJsonl(spatialTextData);

    ui.info("=====================================");
    ui.info("🎉 Pipeline completed successfully!");
    ui.info(`📁 Files created in ${OUTPUT_DIR}:`);
    ui.info(`   - extend_output.json (${files.length} files)`);
    ui.info(
      `   - spatial_text_output.json (${spatialTextData.length} invoices with spatial text)`,
    );
    ui.info(
      `   - invoice_spatial_text.jsonl (${jsonlCount} training samples)`,
    );
  } catch (error) {
    ui.error(
      `❌ Pipeline failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await runPipeline();
}
