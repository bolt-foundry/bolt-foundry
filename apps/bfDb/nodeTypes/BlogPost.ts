import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";
import { connectionFromArray } from "graphql-relay";
import {
  type BlogFrontMatter,
  generateExcerpt,
  safeExtractFrontmatter,
} from "apps/bfDb/utils/contentUtils.ts";
import { marked, Renderer } from "marked";

/**
 * BlogPost node representing a blog post with front matter metadata and content.
 */
export class BlogPost extends GraphQLNode {
  private _id: string;
  private _content: string;
  private _author?: string;
  private _publishedAt?: Date;
  private _updatedAt?: Date;
  private _tags: Array<string>;
  private _excerpt: string;
  private _title: string;
  private static _cache = new Map<string, Promise<BlogPost>>();

  constructor(
    id: string,
    content: string,
    author?: string,
    publishedAt?: Date,
    updatedAt?: Date,
    tags?: Array<string>,
    excerpt?: string,
    title?: string,
  ) {
    super();
    this._id = id;
    this._content = content;
    this._author = author;
    this._publishedAt = publishedAt;
    this._updatedAt = updatedAt;
    this._tags = tags || [];
    this._excerpt = excerpt || generateExcerpt(content);
    this._title = title || this.extractTitleFromContent(content, id);
  }

  /**
   * Required id field from the Node interface.
   */
  override get id(): string {
    return this._id;
  }

  /**
   * Blog post content (body without front matter).
   */
  get content(): string {
    return this._content;
  }

  /**
   * Post author.
   */
  get author(): string | undefined {
    return this._author;
  }

  /**
   * Post published date.
   */
  get publishedAt(): Date | undefined {
    return this._publishedAt;
  }

  /**
   * Post updated date.
   */
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  /**
   * Post tags.
   */
  get tags(): Array<string> {
    return this._tags;
  }

  /**
   * Post excerpt.
   */
  get excerpt(): string {
    return this._excerpt;
  }

  /**
   * Post title.
   */
  get title(): string {
    return this._title;
  }

  /**
   * Extract title from content or generate from ID.
   */
  private extractTitleFromContent(content: string, id: string): string {
    // Look for title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1];
    }

    // Fallback: generate from ID
    return id.replace(/-/g, " ").replace(/^\d{4} \d{2} /, "");
  }

  /**
   * Extract first image URL from markdown content for hero display.
   */
  get heroImage(): string | undefined {
    let extractedImage: string | undefined;

    const renderer = new Renderer();
    renderer.image = function (href: string) {
      if (!extractedImage) {
        extractedImage = href;
      }
      return ""; // We don't need HTML output, just extraction
    };

    // Process the content to trigger image extraction
    marked(this._content, { renderer });

    return extractedImage;
  }

  /**
   * Load a blog post by slug. Alias for findX.
   */
  static load(slug: string): Promise<BlogPost> {
    return this.findX(slug);
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
          const rawContent = await Deno.readTextFile(mdPath);

          // Extract front matter (TOML format)
          const { attrs, body } = safeExtractFrontmatter<BlogFrontMatter>(
            rawContent,
            {},
            "toml",
          );

          return new BlogPost(
            slug,
            body,
            attrs.author,
            attrs.publishedAt,
            attrs.updatedAt,
            attrs.tags,
            attrs.excerpt,
            attrs.title,
          );
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

          // Only include posts that have a publishedAt date and are not in the future
          if (post.publishedAt && post.publishedAt <= new Date()) {
            posts.push(post);
          }
        }
      }
    } catch (error) {
      // If directory doesn't exist, return empty array
      if (error instanceof Deno.errors.NotFound) {
        return [];
      }
      throw error;
    }

    // Sort by publishedAt date
    posts.sort((a, b) => {
      // Both posts should have publishedAt since we filter for it above
      const dateA = a.publishedAt?.getTime() ?? 0;
      const dateB = b.publishedAt?.getTime() ?? 0;

      if (sortDirection === "ASC") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
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
   * GraphQL specification extending the Node interface with blog post fields.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("content")
      .string("author")
      .isoDate("publishedAt")
      .isoDate("updatedAt")
      // Since lists are not supported by the GraphQL builder, we return tags as JSON string
      .nonNull.string("tags", {
        resolve: (root) => JSON.stringify(root.tags),
      })
      .nonNull.string("excerpt")
      .nonNull.string("title")
      .string("heroImage")
  );
}
