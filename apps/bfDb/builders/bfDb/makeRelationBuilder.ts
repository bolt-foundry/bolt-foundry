import type {
  AnyBfNodeCtor,
  Cardinality,
  FieldSpec,
  RelationSpec,
} from "./types.ts";

export function makeRelationBuilder<
  // deno-lint-ignore ban-types
  EdgeP extends Record<string, FieldSpec> = {},
>(): RelationBuilder<EdgeP> {
  /* internal mutable bag -------------------------------------------------- */
  const bag: {
    cardinality?: Cardinality;
    target?: () => AnyBfNodeCtor;
    opposite?: string;
    props: Record<string, FieldSpec>;
  } = { props: {} };

  /* fluent helpers -------------------------------------------------------- */
  const api: RelationBuilder<EdgeP> = {
    /* edge-level scalar props ------------------------ */
    string(name) {
      bag.props[name] = { kind: "string" };
      // deno-lint-ignore no-explicit-any
      return api as any;
    },
    number(name) {
      bag.props[name] = { kind: "number" };
      // deno-lint-ignore no-explicit-any
      return api as any;
    },

    /* cardinality + target --------------------------- */
    one(opposite, target) {
      bag.cardinality = "one";
      bag.target = target;
      bag.opposite = opposite;
      // deno-lint-ignore no-explicit-any
      return api as any;
    },

    /* raw spec (read-only) --------------------------- */
    get _spec() {
      /* NB: caller guarantees both fields when using .in(); when the builder
         is used *only* for props (outbound helper), they might be missing,
         but FieldBuilder fills them with its own direction/target/cardinality */
      return {
        cardinality: bag.cardinality ?? "one",
        target: bag.target ?? (() => null as unknown as AnyBfNodeCtor),
        props: bag.props as EdgeP,
        opposite: bag.opposite,
      } as RelationSpec & { props: EdgeP };
    },
  };

  return api;
}

export type RelationBuilder<
  // deno-lint-ignore ban-types
  EdgeP extends Record<string, FieldSpec> = {},
  C extends Cardinality = Cardinality,
> = {
  /* edge-level props ------------------------------------------------------- */
  string<N extends string>(
    name: N,
  ): RelationBuilder<EdgeP & { [K in N]: { kind: "string" } }, C>;

  number<N extends string>(
    name: N,
  ): RelationBuilder<EdgeP & { [K in N]: { kind: "number" } }, C>;

  /* pick cardinality **and** target (⇐ inbound helper needs this) ---------- */
  one<T extends AnyBfNodeCtor, N extends string = string>(
    opposite: N,
    target: () => T,
  ): RelationBuilder<EdgeP, "one">;

  /* raw access for FieldBuilder.in / addRelation() */
  readonly _spec: {
    cardinality: C;
    target: () => AnyBfNodeCtor;
    props: EdgeP;
    opposite?: string;
  };
};
