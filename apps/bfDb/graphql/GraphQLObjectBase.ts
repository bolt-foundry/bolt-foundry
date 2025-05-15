import type { GraphqlNode } from "apps/bfDb/graphql/helpers.ts";
import {
  type GqlNodeSpec,
  makeGqlSpec,
} from "apps/bfDb/builders/graphql/makeGqlSpec.ts";

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
   * Define a GraphQL node using the new fluent builder pattern.
   * This is the primary way to define GraphQL types for nodes.
   *
   * Example:
   * ```
   * static override gqlSpec = this.defineGqlNode(gql =>
   *   gql
   *     .string("name")
   *     .id("id")
   *     .boolean("isActive")
   *     .object("owner")
   *     .mutation("update", {
   *       args: (a) => a.string("newName"),
   *     })
   * );
   * ```
   */
  static defineGqlNode(
    def: Parameters<typeof makeGqlSpec>[0],
  ): GqlNodeSpec {
    return makeGqlSpec(def);
  }

  static gqlSpec?: GqlNodeSpec = this.defineGqlNode((gql) => gql.id("id"));

  toGraphql(): GraphqlNode {
    return {
      __typename: this.__typename,
      id: this.id,
    };
  }
}
