import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";

/**
 * PublishedDocument node representing a published document with content.
 * Minimal viable implementation with just content field.
 */
export class PublishedDocument extends GraphQLNode {
  private _id: string;
  private _content: string;
  private static _cache = new Map<string, Promise<PublishedDocument>>();

  constructor(id: string, content: string) {
    super();
    this._id = id;
    this._content = content;
  }

  /**
   * Required id field from the Node interface.
   */
  override get id(): string {
    return this._id;
  }

  /**
   * Blog post content.
   */
  get content(): string {
    return this._content;
  }

  /**
   * Find a blog post by slug, throwing an error if not found.
   */
  static override async findX(slug: string): Promise<PublishedDocument> {
    // Check cache first
    let documentPromise = this._cache.get(slug);

    if (!documentPromise) {
      // Create a new promise for loading this document
      documentPromise = (async () => {
        const docsDir = "docs";

        // Check for both .mdx and .md files
        const mdxPath = join(docsDir, `${slug}.mdx`);
        const mdPath = join(docsDir, `${slug}.md`);

        let filePath: string;
        if (await exists(mdxPath)) {
          filePath = mdxPath;
        } else if (await exists(mdPath)) {
          filePath = mdPath;
        } else {
          throw new BfErrorNodeNotFound(`Blog post not found: ${slug}`);
        }

        const content = await Deno.readTextFile(filePath);
        return new PublishedDocument(slug, content);
      })();

      // Cache the promise
      this._cache.set(slug, documentPromise);
    }

    return await documentPromise;
  }

  /**
   * GraphQL specification extending the Node interface with content field.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("content")
  );
}
