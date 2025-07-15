import { GraphQLObjectBase } from "../graphql/GraphQLObjectBase.ts";
import type { GqlNodeSpec } from "../builders/graphql/makeGqlSpec.ts";
import { GraphQLInterface } from "../graphql/decorators.ts";
import { BfErrorNodeNotFound } from "./BfErrorsBfNode.ts";

/**
 * Base class for all GraphQL nodes that implement the Node interface.
 * This class provides the foundation for objects that can be retrieved by ID
 * and conform to the Relay Node specification.
 *
 * The @GraphQLInterface decorator marks this class as a GraphQL interface,
 * which will be used to generate the Node interface in the schema.
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

  /**
   * Find a node by some criteria, throwing BfErrorNodeNotFound if not found.
   * Subclasses should implement this method.
   */
  static findX(..._args: Array<unknown>): Promise<GraphQLNode> {
    throw new TypeError("findX method must be implemented by subclasses");
  }

  /**
   * Find a node, returning null if not found.
   * This method catches only BfErrorNodeNotFound and returns null, other errors are re-thrown.
   */
  static async find(...args: Array<unknown>): Promise<GraphQLNode | null> {
    try {
      return await this.findX(...args);
    } catch (error) {
      if (error instanceof BfErrorNodeNotFound) {
        return null;
      }
      throw error;
    }
  }

  constructor() {
    super();

    if (this.constructor === GraphQLNode) {
      throw new TypeError("Cannot instantiate abstract class GraphQLNode");
    }

    // Check if get id() is implemented anywhere in the prototype chain
    let hasIdGetter = false;
    let proto = Object.getPrototypeOf(this);
    while (proto && proto !== Object.prototype) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, "id");
      if (descriptor?.get) {
        hasIdGetter = true;
        break;
      }
      proto = Object.getPrototypeOf(proto);
    }

    if (!hasIdGetter) {
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
