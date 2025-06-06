import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";

/**
 * BlogPost node representing a blog post with content.
 * Minimal viable implementation with just content field.
 */
export class BlogPost extends GraphQLNode {
  private _id: string;
  private _content: string;
  private static _cache = new Map<string, Promise<BlogPost>>();

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
  static override async findX(slug: string): Promise<BlogPost> {
    // Check cache first
    let postPromise = this._cache.get(slug);

    if (!postPromise) {
      // Create a new promise for loading this post
      postPromise = (async () => {
        const blogDir = "content/blog";

        // Check for both .mdx and .md files
        const mdxPath = join(blogDir, `${slug}.mdx`);
        const mdPath = join(blogDir, `${slug}.md`);

        let filePath: string;
        if (await exists(mdxPath)) {
          filePath = mdxPath;
        } else if (await exists(mdPath)) {
          filePath = mdPath;
        } else {
          throw new BfErrorNodeNotFound(`Blog post not found: ${slug}`);
        }

        const content = await Deno.readTextFile(filePath);
        return new BlogPost(slug, content);
      })();

      // Cache the promise
      this._cache.set(slug, postPromise);
    }

    return await postPromise;
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
