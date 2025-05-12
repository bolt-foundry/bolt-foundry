import type {
  AnyBfNodeCtor,
  Cardinality,
  FieldSpec,
  RelationBuilder,
  RelationSpec,
} from "./types.ts";

/**
 * makeRelationBuilder –
 * returns an *edge* builder used inside callbacks like
 *
 *   .many("pets", () => Pet, e => e.string("nickname"))
 *   .in("spouse",  b => b.one("spouseOf", () => Person))
 *
 * It deliberately starts with no cardinality/target; `.one()` / `.many()`
 * capture them when they’re called (needed for the inbound helper).
 */
export function makeRelationBuilder<
  // deno-lint-ignore ban-types
  EdgeP extends Record<string, FieldSpec> = {},
>(): RelationBuilder<EdgeP> {
  /* internal mutable bag -------------------------------------------------- */
  const bag: {
    cardinality?: Cardinality;
    target     ?: () => AnyBfNodeCtor;
    opposite   ?: string;
    props        : Record<string, FieldSpec>;
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
    one (opposite, target) {
      bag.cardinality = "one";
      bag.target      = target;
      bag.opposite    = opposite;
      // deno-lint-ignore no-explicit-any
      return api as any;
    },
    many(opposite, target) {
      bag.cardinality = "many";
      bag.target      = target;
      bag.opposite    = opposite;
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
        target     : bag.target      ?? (() => null as unknown as AnyBfNodeCtor),
        props      : bag.props       as EdgeP,
        opposite   : bag.opposite,
      } as RelationSpec & { props: EdgeP };
    },
  };

  return api;
}

/* re-export type so callers can `import type { RelationBuilder } …` */
export type { RelationBuilder };
