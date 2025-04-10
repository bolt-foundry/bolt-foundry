import { extractYaml } from "@std/front-matter";
import { getLogger } from "packages/logger/logger.ts";
import type { BfContentItemProps } from "apps/bfDb/models/BfContentItem.ts";

const logger = getLogger(import.meta);

/**
 * Safely extracts YAML frontmatter from a content string
 * Falls back gracefully if frontmatter is missing or malformed
 */
export function safeExtractFrontmatter<T = BfContentItemProps>(
  content: string,
  defaultValues: Partial<T> = {},
): { attrs: Partial<T>; body: string } {
  // Default return structure
  const result = {
    attrs: { ...defaultValues } as Partial<T>,
    body: content,
  };

  // No content or doesn't start with frontmatter delimiter
  if (!content || !content.trim().startsWith("---")) {
    logger.debug("Content has no frontmatter, using defaults");
    return result;
  }

  try {
    const extracted = extractYaml<Partial<T>>(content);
    return {
      attrs: { ...defaultValues, ...extracted.attrs },
      body: extracted.body || "",
    };
  } catch (err) {
    logger.debug("Failed to parse frontmatter, using defaults:", err);

    // Try to extract the body at least (everything after the second ---)
    const secondDelimiterIndex = content.indexOf("---", 3);
    if (secondDelimiterIndex !== -1) {
      result.body = content.substring(secondDelimiterIndex + 3).trim();
    }

    return result;
  }
}
