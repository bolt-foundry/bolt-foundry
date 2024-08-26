import { join } from "infra/build/deps.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
export function isInsideComment(contents: string, matchIdx: number): boolean {
  const beforeMatch = contents.slice(0, matchIdx);
  // Check for single-line comments (//)
  const singleLineComments = beforeMatch.match(/\/\/.*$/gm) || [];
  const singleLineCommentFound = singleLineComments.some((comment) =>
    beforeMatch.endsWith(comment)
  );
  // Check for multi-line comments (/* ... */)
  const blockCommentStartIdx = beforeMatch.lastIndexOf("/*");
  const blockCommentEndIdx = beforeMatch.lastIndexOf("*/");
  const blockCommentOpen = blockCommentStartIdx > blockCommentEndIdx;
  return singleLineCommentFound || blockCommentOpen;
}
export function extractGraphqlTags(contents: string): string[] {
  const matches = [];
  const regex = /graphql`([\s\S]+?)`/g;
  let match;
  while ((match = regex.exec(contents)) !== null) {
    const matchIdx = match.index;
    if (!isInsideComment(contents, matchIdx)) {
      matches.push(match[1].trim());
    }
  }
  return matches;
}
export const replaceTagsWithImports = async (
  contents: string,
  matches: string[],
  rootDirectory = "packages",
) => {
  let updatedContents = contents;
  const artifactsDirectory = `${rootDirectory}/__generated__`;
  const replacements: Record<string, string> = {};
  for (const match of matches) {
    const pattern = /^(?<operationType>\w+)\s+(?<operationName>\w+)/m;
    const { _operationType, operationName } = match.match(pattern)?.groups ??
      {};
    if (!operationName) {
      return contents;
    }
    const generatedFileName = `${operationName}.graphql.ts`;
    const generatedFilePath = join(artifactsDirectory, generatedFileName);
    try {
      const filesystemPath =
        new URL(import.meta.resolve(generatedFilePath)).pathname;
      await Deno.stat(filesystemPath);
      const replacement =
        `(async () => { const importedModule = await import('${generatedFilePath}'); return importedModule.default; })()`;
      replacements[match] = replacement;
    } catch (_error) {
      logger.error(
        `Generated Relay file not found for query: ${generatedFilePath}, skipping replacement.`,
      );
    }
  }
  updatedContents = updatedContents.replace(
    /graphql`([\s\S]+?)`/g,
    (fullMatch, group) => {
      const trimmedGroup = group.trim();
      return replacements[trimmedGroup] || fullMatch;
    },
  );
  return updatedContents;
};
