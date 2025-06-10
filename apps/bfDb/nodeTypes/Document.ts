import { PublishableContent } from "./PublishableContent.ts";
import { DocumentStructureBuilder } from "./DocumentStructureBuilder.ts";
import type { DocumentSection } from "./DocumentStructure.ts";

/**
 * Document node representing a documentation page.
 * Extends PublishableContent for common functionality.
 */
export class Document extends PublishableContent {
  /**
   * The directory where documentation is stored.
   */
  protected static override get contentDirectory(): string {
    return "docs/guides";
  }

  /**
   * Get the hierarchical document structure.
   */
  static async getStructure(): Promise<DocumentSection> {
    const builder = new DocumentStructureBuilder(this.contentDirectory);
    return await builder.build();
  }

  /**
   * Override to satisfy GraphQLNode's prototype check.
   */
  override get id(): string {
    return super.id;
  }

  /**
   * GraphQL specification inherits from PublishableContent.
   * Can be extended with document-specific fields in the future.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("content")
  );
}
