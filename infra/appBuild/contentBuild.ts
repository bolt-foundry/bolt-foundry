#!/usr/bin/env -S deno run -A

import { getLogger } from "packages/logger/logger.ts";
import { ensureDir } from "@std/fs";
import { dirname, extname, join } from "@std/path";
import { compile } from "@mdx-js/mdx";

const logger = getLogger(import.meta);

/**
 * Process markdown/MDX content and compile it to a JavaScript module
 * @param content - The markdown or MDX content to process
 * @returns Compiled JavaScript module as a string
 */
export async function processDocsContent(content: string): Promise<string> {
  logger.debug("Processing docs content");

  try {
    const compiled = await compile(content);
    return String(compiled);
  } catch (error) {
    logger.error(`Error compiling MDX: ${error}`);
    // Return a simple error module for graceful degradation
    return `export default function() { return "Error compiling content"; }`;
  }
}

/**
 * Build all documentation from /docs directory to /build/docs
 * Processes all .md and .mdx files, maintaining directory structure
 */
export async function buildDocs(): Promise<void> {
  logger.info("Building documentation");

  const docsDir = "docs";
  const buildDir = "build/docs";

  // Ensure build directory exists
  await ensureDir(buildDir);

  // Walk through docs directory
  for await (const entry of Deno.readDir(docsDir)) {
    await processEntry(entry, docsDir, buildDir);
  }
}

async function processEntry(
  entry: Deno.DirEntry,
  currentPath: string,
  buildPath: string,
) {
  const sourcePath = join(currentPath, entry.name);
  const targetPath = join(buildPath, entry.name);

  if (entry.isDirectory) {
    await ensureDir(targetPath);
    for await (const subEntry of Deno.readDir(sourcePath)) {
      await processEntry(subEntry, sourcePath, targetPath);
    }
  } else if (entry.isFile) {
    const ext = extname(sourcePath).toLowerCase();
    if (ext === ".md" || ext === ".mdx") {
      // Ensure target directory exists
      await ensureDir(dirname(targetPath));

      const content = await Deno.readTextFile(sourcePath);
      const compiled = await processDocsContent(content);

      // Change extension to .js
      const jsPath = targetPath.replace(/\.(md|mdx)$/, ".js");
      logger.info(`Processing ${sourcePath} -> ${jsPath}`);

      await Deno.writeTextFile(jsPath, compiled);
    }
  }
}

// Run build if called directly
if (import.meta.main) {
  logger.info("Starting docs build process");
  try {
    await buildDocs();
    logger.info("Docs build process complete");
  } catch (error) {
    logger.error("Build failed:", error);
    Deno.exit(1);
  }
}
