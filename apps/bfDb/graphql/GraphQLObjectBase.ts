import type { GraphqlNode } from "@bfmono/apps/bfDb/graphql/helpers.ts";
import {
  type GqlNodeSpec,
  makeGqlSpec,
} from "@bfmono/apps/bfDb/builders/graphql/makeGqlSpec.ts";

export abstract class GraphQLObjectBase {
  /* ────────────────────────────────
   *  Runtime identity helpers
   * ────────────────────────────────*/
  static get __typename(): string {
    return this.name;
  }
  readonly __typename = (this.constructor as typeof GraphQLObjectBase)
    .__typename;

  /** Local-only fallback id for objects that don’t persist */
  #tmpId?: string;
  get id(): string {
    return this.#tmpId ??= globalThis.crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2);
  }

  // allow subclasses to override the id
  constructor(tmpId?: string) {
    if (tmpId) this.#tmpId = tmpId;
  }

  /**
   * Define a GraphQL node using the fluent builder pattern.
   * This is the primary way to define GraphQL types for nodes.
   *
   * The builder provides methods for:
   * - Scalar fields (.string(), .int(), .boolean(), .id())
   * - Object relationships (.object())
   * - Mutations (.mutation())
   * - Required fields (.nonNull.string(), etc.)
   *
   * Object fields without custom resolvers are automatically treated as edge
   * relationships, with the field name becoming the edge role.
   *
   * **Inheritance**: This method automatically inherits fields, relations, and mutations
   * from the parent class's gqlSpec. Child classes can add new fields or override
   * existing ones.
   *
   * Example:
   * ```typescript
   * static override gqlSpec = this.defineGqlNode(gql =>
   *   gql
   *     .string("name")
   *     .id("id")
   *     .nonNull.boolean("isActive")
   *     .object("owner", () => OtherClass)
   *     .mutation("update", {
   *       args: (a) => a.nonNull.string("newName"),
   *       returns: (r) => r.boolean("success").string("message"),
   *       resolve: (root, args, ctx) => ({ success: true, message: "Updated" })
   *     })
   * );
   * ```
   *
   * @param def Builder function that configures the GraphQL type
   * @returns GqlNodeSpec with fields, relations, and mutations
   */
  static defineGqlNode(
    def: Parameters<typeof makeGqlSpec>[0],
  ): GqlNodeSpec {
    // Get parent class's gqlSpec if it exists
    const parentClass = Object.getPrototypeOf(this);
    const parentSpec = parentClass?.gqlSpec;

    // Create the new spec
    const newSpec = makeGqlSpec(def);

    // If there's no parent spec, return the new spec as-is
    if (!parentSpec) {
      return newSpec;
    }

    // Merge parent spec with new spec (new spec takes precedence)
    return {
      fields: { ...parentSpec.fields, ...newSpec.fields },
      relations: { ...parentSpec.relations, ...newSpec.relations },
      mutations: { ...parentSpec.mutations, ...newSpec.mutations },
      connections: { ...parentSpec.connections, ...newSpec.connections },
    };
  }

  /**
   * Default GraphQL specification that includes only an ID field.
   * Subclasses should override this with their own field definitions.
   */
  static gqlSpec?: GqlNodeSpec = this.defineGqlNode((gql) => gql.id("id"));

  /**
   * Converts the object to a GraphQL-compatible format.
   * This implementation returns the minimal required fields, but subclasses
   * (especially BfNode) provide more comprehensive implementations.
   *
   * @returns A GraphQL-compatible representation of this object
   */
  toGraphql(): GraphqlNode {
    return {
      __typename: this.__typename,
      id: this.id,
    };
  }
}
