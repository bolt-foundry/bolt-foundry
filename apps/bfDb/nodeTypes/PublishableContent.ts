import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorsBfNode.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";
import { connectionFromArray } from "graphql-relay";

/**
 * Base class for publishable content (blog posts, documentation, etc.).
 * Provides common functionality for loading markdown files from disk,
 * caching them, and exposing them through GraphQL.
 */
export class PublishableContent extends GraphQLNode {
  private _id: string;
  private _content: string;

  // Each subclass maintains its own cache
  protected static _caches = new WeakMap<
    typeof PublishableContent,
    Map<string, Promise<PublishableContent>>
  >();

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
   * Content of the publishable item.
   */
  get content(): string {
    return this._content;
  }

  /**
   * The directory where content files are stored.
   * Must be overridden by subclasses.
   */
  protected static get contentDirectory(): string {
    throw new Error("contentDirectory must be implemented by subclasses");
  }

  /**
   * Get or create cache for this specific class.
   */
  protected static getCache<T extends PublishableContent>(
    this: typeof PublishableContent,
  ): Map<string, Promise<T>> {
    let cache = PublishableContent._caches.get(this);
    if (!cache) {
      cache = new Map();
      PublishableContent._caches.set(this, cache);
    }
    return cache as Map<string, Promise<T>>;
  }

  /**
   * Find a publishable item by slug, throwing an error if not found.
   */
  static override findX<T extends PublishableContent>(
    this: typeof PublishableContent & { new (id: string, content: string): T },
    slug: string,
  ): Promise<T> {
    // Get cache for this specific class
    const cache = this.getCache<T>();
    let itemPromise = cache.get(slug);

    if (!itemPromise) {
      // Create a new promise for loading this item
      itemPromise = (async (): Promise<T> => {
        // Get the content directory from the static property
        const contentDir = (this as unknown as { contentDirectory: string })
          .contentDirectory;

        // Only check for .md files
        const mdPath = join(contentDir, `${slug}.md`);

        if (await exists(mdPath)) {
          const content = await Deno.readTextFile(mdPath);
          return new this(slug, content) as T;
        } else {
          throw new BfErrorNodeNotFound(`${this.name} not found: ${slug}`);
        }
      })();

      // Cache the promise
      cache.set(slug, itemPromise);
    }

    return itemPromise;
  }

  /**
   * List all items from the filesystem.
   * @param sortDirection - "ASC" for chronological, "DESC" for reverse chronological (default)
   * @returns Array of PublishableContent instances
   */
  static async listAll<T extends PublishableContent>(
    this: typeof PublishableContent & { new (id: string, content: string): T },
    sortDirection: "ASC" | "DESC" = "DESC",
  ): Promise<Array<T>> {
    // Get the content directory from the static property
    const contentDir = (this as unknown as { contentDirectory: string })
      .contentDirectory;
    const items: Array<T> = [];

    try {
      // Read all files in the content directory
      for await (const entry of Deno.readDir(contentDir)) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          const slug = entry.name.replace(".md", "");
          // Use findX to leverage caching
          const item = await this.findX<T>(slug);
          items.push(item);
        }
      }
    } catch (error) {
      // If directory doesn't exist, return empty array
      if (error instanceof Deno.errors.NotFound) {
        return [];
      }
      throw error;
    }

    // Sort by filename (which may include date prefix)
    items.sort((a, b) => {
      if (sortDirection === "ASC") {
        return a.id.localeCompare(b.id);
      } else {
        return b.id.localeCompare(a.id);
      }
    });

    return items;
  }

  /**
   * Create a Relay-style connection from an array of items.
   * @param items - Array of PublishableContent instances
   * @param args - Relay connection arguments (first, last, after, before)
   * @returns Relay Connection object
   */
  static connection<T extends PublishableContent>(
    items: Array<T>,
    args: ConnectionArguments,
  ): Promise<Connection<T>> {
    // connectionFromArray handles all the cursor logic for us
    return Promise.resolve(connectionFromArray(items, args));
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
