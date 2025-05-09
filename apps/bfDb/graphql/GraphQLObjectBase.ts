import {
  defineGqlNode as _baseDefineGqlNode,
  type GqlNodeSpec,
} from "apps/bfDb/builders/graphql/builder.ts";
import { BfError } from "lib/BfError.ts";
import type { GraphqlNode } from "apps/bfDb/graphql/helpers.ts";

type HasGqlSpecCtor = {
  new (...args: unknown[]): unknown; // <- constructor signature
  gqlSpec?: GqlNodeSpec; // <- static prop
};
/** Small helper so other files can do `isGraphQLObjectBase(SomeCtor)` */
export function isGraphQLObjectBase(
  ctor: unknown,
): ctor is typeof GraphQLObjectBase {
  return typeof ctor === "function" &&
    "defineGqlNode" in ctor &&
    "gqlSpec" in ctor;
}

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

  /* ────────────────────────────────
   *  GraphQL definition cache
   * ────────────────────────────────*/

  /**
   * Public DSL entry-point.
   *  ✔ adds an `id()` helper automatically
   *  ✔ throws if generic mutation helpers are invoked
   *  ✔ caches the generated spec so callers get the same object back
   */
  static defineGqlNode(
    def: Parameters<typeof _baseDefineGqlNode>[0] | null,
  ): GqlNodeSpec {
    // 1) return our own cached copy (but not an ancestor’s)
    if (Object.prototype.hasOwnProperty.call(this, "gqlSpec") && this.gqlSpec) {
      return this.gqlSpec;
    }

    //— Wrap the user callback to (a) inject id helper, (b) ban update/delete —
    const wrapped = (
      // #techdebt
      // deno-lint-ignore no-explicit-any
      field: any,
      // deno-lint-ignore no-explicit-any
      relation: any,
      // deno-lint-ignore no-explicit-any
      mutation: any,
    ) => {
      // 1) Ensure `id()` always exists even if user never calls it
      if (!("id" in field)) {
        field.id = (name = "id") => {
          // Delegate to normal scalar builder so types line up
          return field.string(name); // "id" becomes scalar later
        };
      }

      // Always materialise the field so specs that *never* call `field.id()`
      // still end up with it in the SDL.  Calling it twice is harmless.
      field.id("id");

      // 2) Keep only the custom mutation helper
      const bad = () => {
        throw new BfError(
          "Generic mutation helpers don't exist on GraphQLObjectBase and BfNodeBase. " +
            "Use mutation.custom(…) instead.",
        );
      };
      Object.defineProperties(mutation, {
        update: { value: bad },
        delete: { value: bad },
        create: { value: bad },
      });

      // 3) Finally run the user’s callback
      if (def) {
        def(field, relation, mutation);
      }
    };

    //— Build and cache the spec ————————————————————————————————
    const spec = _baseDefineGqlNode(wrapped);
    spec.owner ??= this.name;

    // subclasses that *extend* another GraphQLObjectBase automatically
    // inherit the parent’s implements-chain
    const Parent = Object.getPrototypeOf(this) as HasGqlSpecCtor;
    // Skip the base class itself – we don’t want a GraphQLObjectBase
    // interface appearing in the schema (would require resolveType).
    if (
      isGraphQLObjectBase(Parent) && Parent !== this && Parent.gqlSpec
    ) {
      // put the direct parent first, then keep whatever it already implements
      spec.implements = [Parent.name, ...(Parent.gqlSpec.implements ?? [])];
    }

    return (this.gqlSpec = spec);
  }

  static gqlSpec?: GqlNodeSpec = this.defineGqlNode(
    (field) => {
      field.id("id");
    },
  );

  toGraphql(): GraphqlNode {
    return {
      __typename: this.__typename,
      id: this.id,
    };
  }
}
