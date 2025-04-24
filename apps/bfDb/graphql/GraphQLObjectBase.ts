import {
  defineGqlNode as _baseDefineGqlNode,
  type GqlNodeSpec,
} from "./builder/builder.ts";

type HasGqlSpecCtor = {
  new (...args: unknown[]): unknown; // <- constructor signature
  gqlSpec?: GqlNodeSpec; // <- static prop
};
/** Small helper so other files can do `isGraphQLObjectBase(SomeCtor)` */
export function isGraphQLObjectBase(
  ctor: unknown,
): ctor is typeof GraphQLObjectBase {
  return typeof ctor === "function" &&
    ctor.prototype instanceof GraphQLObjectBase;
}

export class GraphQLObjectBase {
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
    def: Parameters<typeof _baseDefineGqlNode>[0],
  ): GqlNodeSpec | null {
    //— Return cached copy on subsequent calls ————————————————
    if (this.gqlSpec) return this.gqlSpec;

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
          return field.string(name); // “id” becomes scalar later
        };
      }

      // 2) Keep only the custom mutation helper
      const bad = () => {
        throw new Error(
          "Generic mutation helpers have been removed. " +
            "Use mutation.custom(…) instead.",
        );
      };
      Object.defineProperties(mutation, {
        update: { value: bad },
        delete: { value: bad },
        create: { value: bad },
      });

      // 3) Finally run the user’s callback
      def(field, relation, mutation);
    };

    //— Build and cache the spec ————————————————————————————————
    const spec = _baseDefineGqlNode(wrapped);

    // subclasses that *extend* another GraphQLObjectBase automatically
    // inherit the parent’s implements-chain
    const Parent = Object.getPrototypeOf(this) as HasGqlSpecCtor;
    if (Parent?.gqlSpec) {
      spec.implements = [...(Parent.gqlSpec.implements ?? []), Parent.name];
    }

    return (this.gqlSpec = spec);
  }

  static gqlSpec?: GqlNodeSpec | null | undefined = this.defineGqlNode(
    (field) => {
      field.id("id");
    },
  );
}
