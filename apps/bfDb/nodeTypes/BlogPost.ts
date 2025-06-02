import { GraphQLNode } from "apps/bfDb/classes/GraphQLNode.ts";

/**
 * BlogPost node representing a blog post with content.
 * Minimal viable implementation with just content field.
 */
export class BlogPost extends GraphQLNode {
  private _id: string;
  private _content: string;

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
   * GraphQL specification extending the Node interface with content field.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("content")
  );
}
