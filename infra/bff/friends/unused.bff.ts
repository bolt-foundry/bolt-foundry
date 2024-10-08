import { register } from "infra/bff/mod.ts";
import { walk } from "std/fs/mod.ts";
import { normalize, resolve } from "std/path/mod.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const DIRECTORIES = ["infra", "packages", "lib"];
const EXTS = [".ts", ".tsx", ".js", ".jsx"];
const SKIP = [/__generated__/, /__tests__/];

async function getImportMap(
  importMapPath: string,
): Promise<Record<string, string>> {
  const importMapText = await Deno.readTextFile(importMapPath);
  const importMap = JSON.parse(importMapText).imports as Record<string, string>;
  return importMap;
}

function resolvePathFromImportMap(
  importedPath: string,
  importMap: Record<string, string>,
): string {
  for (const [alias, resolved] of Object.entries(importMap)) {
    if (importedPath.startsWith(alias)) {
      return importedPath.replace(alias, resolved);
    }
  }
  return importedPath;
}

async function getAllFiles(dir: string): Promise<Set<string>> {
  const files = new Set<string>();
  for await (const entry of walk(dir, { exts: EXTS, skip: SKIP })) {
    files.add(normalize(entry.path));
  }
  return files;
}
async function findUsedFiles(
  dir: string,
  importMap: Record<string, string>,
): Promise<Set<string>> {
  const usedFiles = new Set<string>();
  for await (const entry of walk(dir, { exts: EXTS, skip: SKIP })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      const regex =
        /import\s+[\s\S]*?from\s+["'](.+?)["'];?|require\(["'](.+?)["']\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const importedPath = match[1] || match[2];
        let resolvedPath = resolvePathFromImportMap(importedPath, importMap);

        if (resolvedPath.startsWith(".")) {
          resolvedPath = resolve(Deno.cwd(), resolvedPath);
        }

        usedFiles.add(normalize(resolvedPath));
      }

      // bff commands
      if (entry.path.endsWith("bff.ts")) {
        usedFiles.add(normalize(entry.path));
      }
    }
  }
  return usedFiles;
}
async function findUnusedFiles(): Promise<number> {
  logger.info("Running unused file check...");
  const importMap = await getImportMap("import_map.json");
  let unusedFilesFound = false;
  const allFiles = new Set<string>();
  const usedFiles = new Set<string>();
  const unUsedFiles = new Set<string>();

  for (const dir of DIRECTORIES) {
    const directory = `${Deno.cwd()}/${dir}`;
    const allFilesTemp = await getAllFiles(directory);
    const usedFilesTemp = await findUsedFiles(directory, importMap);
    for (const file of allFilesTemp) {
      allFiles.add(file);
    }
    for (const file of usedFilesTemp) {
      usedFiles.add(file);
    }
  }
  logger.debug(
    `Number of files to check: ${allFiles.size}\nNumber of files used: ${usedFiles.size}`,
  );

  for (const file of allFiles) {
    if (!usedFiles.has(file)) {
      const shortFile = file.replace(`${Deno.cwd()}/`, "");
      // logger.info(`Unused file: ${shortFile}`);
      unUsedFiles.add(shortFile);
      unusedFilesFound = true;
    }
  }
  logger.info(
    `Found ${unUsedFiles.size} unused files\n${
      new Array(...unUsedFiles).join("\n")
    }`,
  );

  if (!unusedFilesFound) {
    logger.info("No unused files found!");
  }

  return unusedFilesFound ? 1 : 0;
}

register(
  "unused",
  "Checks for unused TypeScript and JavaScript files in the project.",
  async () => await findUnusedFiles(),
);
