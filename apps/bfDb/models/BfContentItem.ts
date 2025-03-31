import { BfNodeInMemory } from "apps/bfDb/coreModels/BfNodeInMemory.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

/**
 * Props for BfContentItem
 */
export type BfContentItemProps = {
  title: string;
  body: string;
  slug: string;
  filePath?: string;
  summary?: string;
  author?: string;
  cta?: string;
  href?: string;
};

/**
 * Content item representing a single piece of content
 * (article, page, post, etc.)
 *
 * BfContentItem is the core class for content management, representing
 * individual content files like articles, pages, posts, etc. within a collection.
 * It stores both the content itself and the metadata extracted from frontmatter.
 */
export class BfContentItem extends BfNodeInMemory<BfContentItemProps> {}
