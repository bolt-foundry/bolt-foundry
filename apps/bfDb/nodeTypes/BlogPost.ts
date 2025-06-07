import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";
import { connectionFromArray } from "graphql-relay";

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
        const blogDir = "docs/blog";

        // Only check for .md files
        const mdPath = join(blogDir, `${slug}.md`);

        if (await exists(mdPath)) {
          const content = await Deno.readTextFile(mdPath);
          return new BlogPost(slug, content);
        } else {
          throw new BfErrorNodeNotFound(`Blog post not found: ${slug}`);
        }
      })();

      // Cache the promise
      this._cache.set(slug, postPromise);
    }

    return await postPromise;
  }

  /**
   * List all blog posts from the filesystem.
   * @param sortDirection - "ASC" for chronological, "DESC" for reverse chronological (default)
   * @returns Array of BlogPost instances
   */
  static async listAll(
    sortDirection: "ASC" | "DESC" = "DESC",
  ): Promise<Array<BlogPost>> {
    const blogDir = "docs/blog";
    const posts: Array<BlogPost> = [];

    try {
      // Read all files in the blog directory
      for await (const entry of Deno.readDir(blogDir)) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          const slug = entry.name.replace(".md", "");
          // Use findX to leverage caching
          const post = await this.findX(slug);
          posts.push(post);
        }
      }
    } catch (error) {
      // If directory doesn't exist, return empty array
      if (error instanceof Deno.errors.NotFound) {
        return [];
      }
      throw error;
    }

    // Sort by filename (which includes date prefix YYYY-MM)
    posts.sort((a, b) => {
      if (sortDirection === "ASC") {
        return a.id.localeCompare(b.id);
      } else {
        return b.id.localeCompare(a.id);
      }
    });

    return posts;
  }

  /**
   * Create a Relay-style connection from an array of blog posts.
   * @param posts - Array of BlogPost instances
   * @param args - Relay connection arguments (first, last, after, before)
   * @returns Relay Connection object
   */
  static connection(
    posts: Array<BlogPost>,
    args: ConnectionArguments,
  ): Promise<Connection<BlogPost>> {
    // connectionFromArray handles all the cursor logic for us
    return Promise.resolve(connectionFromArray(posts, args));
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
