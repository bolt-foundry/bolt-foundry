import { GraphQLNode } from "@bfmono/apps/bfDb/graphql/GraphQLNode.ts";

/**
 * Example implementation of GraphQLNode for testing purposes.
 * This class demonstrates a concrete implementation of the Node interface.
 */
export class TestGraphQLNode extends GraphQLNode {
  private _id: string;
  private _name: string;

  /**
   * Create a new test GraphQL node.
   *
   * @param id The ID of the node
   * @param name Optional name for the node
   */
  constructor(id: string, name = "Test Node") {
    super();
    this._id = id;
    this._name = name;
  }

  /**
   * Implementation of the required id field from the Node interface.
   */
  override get id(): string {
    return this._id;
  }

  /**
   * Additional field specific to this implementation.
   */
  get name(): string {
    return this._name;
  }

  /**
   * GraphQL specification for this node type, extending the base Node interface.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("name")
  );
}
