#!/usr/bin/env -S deno run -A

import { ensureDir } from "@std/fs";
// import { dirname, extname, join } from "@std/path";
import { getLogger } from "packages/logger.ts";
// import { compile } from "@mdx-js/mdx";
// import { processNotebookContent } from "infra/appBuild/utils/notebookUtils.ts";

const logger = getLogger(import.meta);

async function copyContentFiles() {
  //   const contentDir = "content";
  const buildDir = "build/content";

  //   // Ensure build directory exists
  await ensureDir(buildDir);

  //   // Walk through content directory
  //   for await (const entry of Deno.readDir(contentDir)) {
  //     await processEntry(entry, contentDir, buildDir);
  //   }
}

// async function processEntry(
//   entry: Deno.DirEntry,
//   currentPath: string,
//   buildPath: string,
// ) {
//   const sourcePath = join(currentPath, entry.name);
//   const targetPath = join(buildPath, entry.name);

//   if (entry.isDirectory) {
//     await ensureDir(targetPath);
//     for await (const subEntry of Deno.readDir(sourcePath)) {
//       await processEntry(subEntry, sourcePath, targetPath);
//     }
//   } else if (entry.isFile) {
//     // Ensure target directory exists
//     await ensureDir(dirname(targetPath));

//     const ext = extname(sourcePath).toLowerCase();
//     if (ext === ".md" || ext === ".mdx" || ext === ".ipynb") {
//       let content = "";

//       if (ext === ".ipynb") {
//         const notebookContent = await Deno.readTextFile(sourcePath);

//         content = processNotebookContent(notebookContent);
//       } else {
//         content = await Deno.readTextFile(sourcePath);
//       }

//       try {
//         const compiled = await compile(content);
//         const destPath = targetPath;
//         logger.info(`Processing ${sourcePath} -> ${destPath}`);

//         // Post-process import statements
//         let processedContent = String(compiled).replace(
//           /from\s+["']content\//g,
//           'from "build/content/',
//         );
//         processedContent = processedContent.replace(
//           /import\s+["']content\//g,
//           'import "build/content/',
//         );

//         await Deno.writeTextFile(destPath, processedContent);
//       } catch (error) {
//         logger.error(`Error compiling ${sourcePath}: ${error}`);
//       }
//     } else {
//       const destPath = targetPath;
//       logger.info(`Processing ${sourcePath} -> ${destPath}`);
//       try {
//         await Deno.copyFile(sourcePath, destPath);
//       } catch (error) {
//         logger.error(`Error copying ${sourcePath}: ${error}`);
//       }
//     }
//   }
// }

if (import.meta.main) {
  logger.info("Starting content build process");
  try {
    await copyContentFiles();
    logger.info("Content build process complete");
  } catch (error) {
    logger.error("Build failed:", error);
    Deno.exit(1);
  }
}
