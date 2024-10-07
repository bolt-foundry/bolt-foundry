import { register } from "infra/bff/mod.ts";
import { walk } from "std/fs/mod.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const EXTS = [".ts", ".tsx", ".js", ".jsx"];
const SKIP = [/__generated__/, /__tests__/, /bff/, /build/, /graphql/, /bfDb/] ;

async function getAllFiles(dir: string): Promise<Set<string>> {
  const files = new Set<string>();
  for await (const entry of walk(dir, { exts: EXTS, skip: SKIP  })) {
    files.add(entry.path);
  }
  return files;
}
async function findUsedFiles(dir: string): Promise<Set<string>> {
  const usedFiles = new Set<string>();
  for await (const entry of walk(dir, { exts: EXTS, skip: SKIP })) {
    // Ensure the entry is a file before reading
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      const regex =
        /import\s+.*?\s+from\s+["'](.*?)["']|require\(["'](.*?)["']\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const importedPath = match[1] || match[2];
        const resolvedPath = importedPath.startsWith(".")
          ? new URL(importedPath, `file://${entry.path}`).pathname
          : importedPath;
        if (resolvedPath.startsWith("/")) {
          usedFiles.add(resolvedPath);
        }
      }
    }
  }
  return usedFiles;
}
async function findUnusedFiles(): Promise<number> {
  logger.info("Running unused file check...");
  const directories = [`${Deno.cwd()}/infra`, `${Deno.cwd()}/packages`];
  let unusedFilesFound = false;
  for (const directory of directories) {
    const allFiles = await getAllFiles(directory);
    const usedFiles = await findUsedFiles(directory);

    for (const file of allFiles) {
      if (!usedFiles.has(file)) {
        logger.info(`Unused file in ${directory}: ${file}`);
        unusedFilesFound = true;
      }
    }
  }

  return unusedFilesFound ? 1 : 0; // Return a non-zero code if unused files are found
}
// Register the command in the BFF system
register(
  "unused",
  "Checks for unused TypeScript and JavaScript files in the project.",
  async () => await findUnusedFiles(),
);
