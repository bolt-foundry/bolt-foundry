import type {
  AnyBfNodeCtor,
  Cardinality,
  Direction,
  FieldSpec,
  RelationSpec,
} from "./types.ts";
import { makeRelationBuilder, type RelationBuilder as EdgeRelationBuilder } from "./makeRelationBuilder.ts";
/* ────────────────────────────────────────────────────────────────────────── */
/*  FIELD BUILDER                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

export type FieldBuilder<
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
> = {
  /* scalars */
  string<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "string" } }, R>;

  number<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "number" } }, R>;

  /* outbound relations */
  one: RelationAdder<"out", "one", F, R>;
  many: RelationAdder<"out", "many", F, R>;

  /* inbound helper (fixture-style) */
  in<
    N extends string,
    // deno-lint-ignore ban-types
    EdgeP extends Record<string, FieldSpec> = {},
    C extends Cardinality = Cardinality,
  >(
    name: N,
    build: (b: EdgeRelationBuilder<EdgeP>) => EdgeRelationBuilder<EdgeP, C>,
  ): FieldBuilder<
    F,
    & R
    & {
      [K in N]: RelationSpec<C> & {
        direction: "in";
        props: EdgeP;
      };
    }
  >;
  /* raw spec */
  readonly _spec: { fields: F; relations: R };
};

/* relation-adder ---------------------------------------------------------- */
type RelationAdder<
  D extends Direction,
  C extends Cardinality,
  F extends Record<string, FieldSpec>,
  R extends Record<string, RelationSpec>,
> = <
  N extends string,
  T extends AnyBfNodeCtor,
  EB extends EdgeRelationBuilder = EdgeRelationBuilder, // 🆕
>(
  name: N,
  target: () => T,
  edge?: (e: EdgeRelationBuilder) => EB, // 🆕
) => FieldBuilder<
  F,
  & R
  & {
    [K in N]: RelationSpec<C> & {
      direction: D;
      target: () => T;
      // deno-lint-ignore ban-types
      props: EB extends EdgeRelationBuilder<infer EP> ? EP : {}; // 🆕
    };
  }
>;

/* ────────────────────────────────────────────────────────────────────────── */
/*  FACTORY                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export function makeFieldBuilder<
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
>(
  out = { fields: {} as F, relations: {} as R },
): FieldBuilder<F, R> {
  /* helper that creates a **new** builder with fresh generics */
  const next = <
    NF extends Record<string, FieldSpec>,
    NR extends Record<string, RelationSpec>,
  >(o: { fields: NF; relations: NR }): FieldBuilder<NF, NR> =>
    makeFieldBuilder(o);

  /* scalar helpers */
  const string = <N extends string>(name: N) =>
    next({
      ...out,
      fields: { ...out.fields, [name]: { kind: "string" } },
    });

  const number = <N extends string>(name: N) =>
    next({
      ...out,
      fields: { ...out.fields, [name]: { kind: "number" } },
    });

  /* outbound relations */
  const addRel =
    <D extends Direction, C extends Cardinality>(direction: D, card: C) =>
    <
      N extends string,
      T extends AnyBfNodeCtor,
      EB extends EdgeRelationBuilder = EdgeRelationBuilder, // 🆕
    >(
      name: N,
      target: () => T,
      edge?: (e: EdgeRelationBuilder) => EB, // 🆕
    ) => {
      // deno-lint-ignore ban-types
      type EP = EB extends EdgeRelationBuilder<infer P> ? P : {}; // 🆕
      const props: EP = edge
        ? edge(makeRelationBuilder())._spec.props as EP
        : {} as EP;

      return next({
        ...out,
        relations: {
          ...out.relations,
          [name]: {
            direction,
            cardinality: card,
            target,
            props,
          } as RelationSpec & { props: EP },
        },
      });
    };

  /* inbound helper */
  const inbound = <
    N extends string,
    EdgeP extends Record<string, FieldSpec>,
    C extends Cardinality,
  >(
    name: N,
    build: (b: EdgeRelationBuilder<EdgeP>) => EdgeRelationBuilder<EdgeP, C>,
  ) => {
    const rb = build(makeRelationBuilder<EdgeP>());
    const { cardinality, target, props } = rb._spec;
    return next({
      ...out,
      relations: {
        ...out.relations,
        [name]: {
          direction: "in",
          cardinality,
          target,
          props,
        } as RelationSpec & { props: EdgeP },
      },
    });
  };

  return {
    /* scalars */
    string,
    number,
    /* outbound */
    one: addRel("out", "one"),
    many: addRel("out", "many"),
    /* inbound */
    in: inbound,
    /* spec exposer */
    _spec: out,
  } as FieldBuilder<F, R>;
}
