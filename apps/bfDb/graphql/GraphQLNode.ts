import { GraphQLObjectBase } from "./GraphQLObjectBase.ts";
import type { GqlNodeSpec } from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";
import { GraphQLInterface } from "./decorators.ts";

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
