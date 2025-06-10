import { extractToml, extractYaml } from "@std/front-matter";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Define types for blog post front matter
export interface BlogFrontMatter {
  title?: string;
  author?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  tags?: Array<string>;
  excerpt?: string;
}

/**
 * Safely extracts frontmatter from a content string
 * Falls back gracefully if frontmatter is missing or malformed
 * @param content The content string
 * @param defaultValues Default values for missing fields
 * @param format The format to parse ("yaml" or "toml")
 */
export function safeExtractFrontmatter<T = BlogFrontMatter>(
  content: string,
  defaultValues: Partial<T> = {},
  format: "yaml" | "toml" = "yaml",
): { attrs: Partial<T>; body: string } {
  // Default return structure
  const result = {
    attrs: { ...defaultValues } as Partial<T>,
    body: content,
  };

  // Check for frontmatter delimiters
  const trimmedContent = content?.trim() || "";
  const hasYamlDelimiter = trimmedContent.startsWith("---");
  const hasTomlDelimiter = trimmedContent.startsWith("+++");

  // No content or doesn't start with frontmatter delimiter
  if (!content || (!hasYamlDelimiter && !hasTomlDelimiter)) {
    logger.debug("Content has no frontmatter, using defaults");
    return result;
  }

  try {
    // Auto-detect format if needed
    const actualFormat = format === "yaml" && hasTomlDelimiter
      ? "toml"
      : format === "toml" && hasYamlDelimiter
      ? "yaml"
      : format;

    const extracted = actualFormat === "toml"
      ? extractToml<Partial<T>>(content)
      : extractYaml<Partial<T>>(content);

    return {
      attrs: { ...defaultValues, ...extracted.attrs },
      body: extracted.body || "",
    };
  } catch (err) {
    logger.debug("Failed to parse frontmatter, using defaults:", err);

    // Try to extract the body at least
    const delimiter = hasTomlDelimiter ? "+++" : "---";
    const secondDelimiterIndex = content.indexOf(delimiter, 3);
    if (secondDelimiterIndex !== -1) {
      result.body = content.substring(secondDelimiterIndex + delimiter.length)
        .trim();
    }

    return result;
  }
}

/**
 * Extracts TOML frontmatter from content
 * This is a direct wrapper around the std library function
 */
export { extractToml } from "@std/front-matter";

/**
 * Generates an excerpt from markdown content
 * @param content The markdown content
 * @param maxWords Maximum number of words (default 150)
 * @returns The excerpt string
 */
export function generateExcerpt(
  content: string,
  maxWords: number = 150,
): string {
  // Remove front matter if present
  const { body } = safeExtractFrontmatter(content, {}, "toml");

  // Split into lines and find the first paragraph
  const lines = body.split("\n");
  let firstParagraph = "";
  let inParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headers and empty lines
    if (trimmed.startsWith("#") || trimmed === "") {
      if (inParagraph) break; // End of first paragraph
      continue;
    }

    // Found start of paragraph
    inParagraph = true;
    firstParagraph = trimmed;
    break;
  }

  if (!firstParagraph) return "";

  // Split into words and limit
  const words = firstParagraph.split(/\s+/);

  if (words.length <= maxWords) {
    return firstParagraph;
  }

  // Take first maxWords and add ellipsis
  return words.slice(0, maxWords).join(" ") + "...";
}
