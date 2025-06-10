/**
 * Types and utilities for hierarchical document structure with TOML configuration.
 */

export interface DocumentSection {
  /** URL-friendly identifier */
  slug: string;
  /** Display title */
  title: string;
  /** Optional description */
  description?: string;
  /** Documents in this section */
  documents: Array<DocumentInfo>;
  /** Nested subsections */
  subsections: Array<DocumentSection>;
  /** Path to this section */
  path: string;
  /** Sort order */
  order: number;
}

export interface DocumentInfo {
  /** Document slug (filename without extension) */
  slug: string;
  /** Display title */
  title: string;
  /** Full path to document */
  path: string;
  /** Sort order within section */
  order: number;
}

export interface SectionConfig {
  section?: {
    title?: string;
    description?: string;
  };
  documents?: Array<{
    slug: string;
    title?: string;
  }>;
  settings?: {
    hidden?: Array<string>;
  };
}

/**
 * Extract order prefix from filename (e.g., "01-intro" -> 1)
 */
export function extractOrderPrefix(
  name: string,
): { order: number; cleanName: string } {
  const match = name.match(/^(\d+)-(.+)$/);
  if (match) {
    return {
      order: parseInt(match[1], 10),
      cleanName: match[2],
    };
  }
  return {
    order: 999, // Default order for non-prefixed items
    cleanName: name,
  };
}

/**
 * Convert filename to title (e.g., "getting-started" -> "Getting Started")
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
