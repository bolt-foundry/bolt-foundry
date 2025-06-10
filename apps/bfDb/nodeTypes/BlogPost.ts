import { PublishableContent } from "./PublishableContent.ts";

/**
 * BlogPost node representing a blog post with content.
 * Extends PublishableContent for common functionality.
 */
export class BlogPost extends PublishableContent {
  /**
   * The directory where blog posts are stored.
   */
  protected static override get contentDirectory(): string {
    return "docs/blog";
  }

  /**
   * Override to satisfy GraphQLNode's prototype check.
   */
  override get id(): string {
    return super.id;
  }

  /**
   * GraphQL specification inherits from PublishableContent.
   * Can be extended with blog-specific fields in the future.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("content")
  );
}
