import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { parseArgs } from "@std/cli";
import { basename } from "@std/path";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export async function assetUploadCommand(
  options: Array<string>,
): Promise<number> {
  // Handle help
  if (options.includes("--help") || options.includes("-h")) {
    ui.output(`Usage: bft asset-upload <file...> [options]
    
Upload assets to CDN and return URLs.

Options:
  --help, -h     Show this help message
  
Examples:
  bft asset-upload image.jpg`);
    return 0;
  }

  const args = parseArgs(options, {
    boolean: ["verbose", "v"],
    alias: { v: "verbose" },
    "--": true,
  });

  const verbose = args.verbose || args.v;
  const files = args._ as Array<string>;

  if (files.length === 0) {
    ui.error("No files specified. Use --help for usage information.");
    return 1;
  }

  try {
    // Process each file
    for (const filePath of files) {
      await processFile(filePath, verbose);
    }
    return 0;
  } catch (error) {
    ui.error(
      `Upload failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 1;
  }
}

async function processFile(filePath: string, verbose: boolean): Promise<void> {
  if (verbose) {
    ui.output(`Processing: ${filePath}`);
  }

  // Check if file exists
  try {
    await Deno.stat(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }

  // Read file and calculate hash
  const fileData = await Deno.readFile(filePath);
  const hash = await calculateHash(fileData);
  const fileName = basename(filePath);

  if (verbose) {
    ui.output(`  Hash: ${hash}`);
    ui.output(`  Size: ${fileData.length} bytes`);
  }

  // Check if asset already exists
  const exists = await checkAssetExists(hash, fileName);
  if (exists) {
    if (verbose) {
      ui.output(`  Already exists, skipping upload`);
    }
  } else {
    // Upload to S3
    await uploadToS3(hash, fileName, fileData, verbose);
  }

  const cdnUrl = `https://bltcdn.com/assets/${hash}/${fileName}`;
  ui.output(cdnUrl);
}

// Initialize S3 client
function createS3Client(): S3Client {
  const accessKey = getConfigurationVariable("S3_ACCESS_KEY");
  const secretKey = getConfigurationVariable("S3_SECRET_KEY");

  if (!accessKey || !secretKey) {
    throw new Error(
      "S3 credentials not found. Set S3_ACCESS_KEY and S3_SECRET_KEY environment variables.",
    );
  }

  return new S3Client({
    region: "hel1", // Helsinki region
    endpoint: "https://hel1.your-objectstorage.com",
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });
}

async function checkAssetExists(
  hash: string,
  fileName: string,
): Promise<boolean> {
  try {
    const s3Client = createS3Client();
    const key = `assets/${hash}/${fileName}`;

    await s3Client.send(
      new HeadObjectCommand({
        Bucket: "bolt-foundry-assets",
        Key: key,
      }),
    );

    return true; // Object exists
  } catch (error: unknown) {
    const err = error as {
      name?: string;
      $metadata?: { httpStatusCode?: number };
    };
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return false; // Object doesn't exist
    }
    // Re-throw other errors
    throw error;
  }
}

async function uploadToS3(
  hash: string,
  fileName: string,
  data: Uint8Array,
  verbose: boolean,
): Promise<void> {
  if (verbose) {
    ui.output(`  Uploading to S3...`);
  }

  const s3Client = createS3Client();
  const key = `assets/${hash}/${fileName}`;

  // Determine content type
  const contentType = getMimeType(fileName);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: "bolt-foundry-assets",
      Key: key,
      Body: data,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  if (verbose) {
    ui.output(`  Upload complete`);
  }
}

export function getMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
    "svg": "image/svg+xml",
    "mp4": "video/mp4",
    "webm": "video/webm",
    "pdf": "application/pdf",
    "txt": "text/plain",
    "md": "text/markdown",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

export async function calculateHash(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 8); // Use first 8 chars for shorter URLs
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Upload assets to CDN and return URLs",
  fn: assetUploadCommand,
  aiSafe: true,
} satisfies TaskDefinition;
