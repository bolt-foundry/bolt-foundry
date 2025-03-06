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
 * 
 * BfContentItem is the core class for content management, representing
 * individual content files like articles, pages, posts, etc. within a collection.
 * It stores both the content itself and the metadata extracted from frontmatter.
 */
export class BfContentItem extends BfNodeInMemory<BfContentItemProps> {
  /**
   * Converts the content item to a GraphQL representation with helpful derived properties
   */
  override toGraphql() {
    // Get the base GraphQL representation from parent
    const baseGraphql = super.toGraphql();

    // Add derived properties
    return {
      ...baseGraphql,
      // Add base properties needed for GraphQL
      title: this.props.title,
      body: this.props.body,
      slug: this.props.slug,
      author: this.props.author || null,
      summary: this.props.summary || null,
      cta: this.props.cta || null,
      href: this.props.href || null,
      // Add wordCount as a derived property
      wordCount: this.getWordCount(),
      // Convert raw markdown body to excerpt if summary is not available
      excerpt: this.props.summary || this.generateExcerpt(),
      // Add file path if available
      filePath: this.props.filePath || null,
    };
  }

  /**
   * Get the word count of the content body
   */
  private getWordCount(): number {
    if (!this.props.body) return 0;
    // Split on whitespace and filter out empty strings
    const words = this.props.body.split(/\s+/).filter(Boolean);
    return words.length;
  }

  /**
   * Generate an excerpt from the content body if summary is not provided
   */
  private generateExcerpt(maxLength: number = 160): string {
    if (!this.props.body) return '';

    // Strip markdown headings, links, and other syntax
    const plainText = this.props.body
      .replace(/#+\s+(.*)/g, '$1') // Remove headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/[*_~`]/g, ''); // Remove basic formatting characters

    // Truncate to maxLength and add ellipsis if truncated
    if (plainText.length <= maxLength) {
      return plainText.trim();
    }

    // Try to find a sentence or paragraph break for a cleaner cutoff
    let excerpt = plainText.substring(0, maxLength);
    const lastPeriod = excerpt.lastIndexOf('.');
    const lastNewline = excerpt.lastIndexOf('\n');

    // Prefer sentence break, then paragraph break, then just truncate at maxLength
    if (lastPeriod > maxLength * 0.5) {
      excerpt = excerpt.substring(0, lastPeriod + 1);
    } else if (lastNewline > maxLength * 0.5) {
      excerpt = excerpt.substring(0, lastNewline);
    }

    return excerpt.trim() + '...';
  }
}