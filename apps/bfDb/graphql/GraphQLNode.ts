import { GraphQLObjectBase } from "./GraphQLObjectBase.ts";
import type { GqlNodeSpec } from "apps/bfDb/builders/graphql/makeGqlSpec.ts";
import { GraphQLInterface } from "./decorators.ts";

/**
 * Base class for all GraphQL nodes that implement the Node interface.
 * This class provides the foundation for objects that can be retrieved by ID
 * and conform to the Relay Node specification.
 */
@GraphQLInterface({
  name: "Node",
  description: "An object with a unique identifier",
})
export abstract class GraphQLNode extends GraphQLObjectBase {
  /**
   * Define the GraphQL specification with Node interface fields.
   * This includes the id field which is required for all Node interface implementations.
   */
  static override gqlSpec: GqlNodeSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
  );

  /**
   * ID field required by the Node interface.
   * Concrete implementations must provide this field.
   */
  abstract override get id(): string;

  // We inherit __typename from GraphQLObjectBase, which is set to this.constructor.name
  // This is sufficient for type resolution

  constructor() {
    super();

    // Ensure that get id() is implemented in subclasses
    const proto = Object.getPrototypeOf(this);
    const hasOwnId = Object.getOwnPropertyDescriptor(proto, "id")?.get;

    if (this.constructor === GraphQLNode) {
      throw new TypeError("Cannot instantiate abstract class GraphQLNode");
    }

    if (!hasOwnId) {
      // Make the id property throw when accessed if it's not implemented
      Object.defineProperty(this, "id", {
        get() {
          throw new TypeError("Abstract method 'get id()' must be implemented");
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
}

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
