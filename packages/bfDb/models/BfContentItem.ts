import { BfNodeInMemory } from "packages/bfDb/coreModels/BfNodeInMemory.ts";
import { getLogger } from "packages/logger.ts";

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
 */
export class BfContentItem extends BfNodeInMemory<BfContentItemProps> {
}
