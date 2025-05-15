/* FieldBuilder.ts – promise-friendly, no intersection tricks */
import type {
  AnyBfNodeCtor,
  Cardinality,
  Direction,
  FieldSpec,
  RelationSpec,
} from "./types.ts";
import {
  makeRelationBuilder,
  type RelationBuilder as EdgeRelationBuilder,
} from "./makeRelationBuilder.ts";

type SyncOrAsync<T> = T | Promise<T>; // ——— helper

/* ─────────────────────────────────────────────────────────────── */
/*  FIELD BUILDER                                                 */
/* ─────────────────────────────────────────────────────────────── */
export type FieldBuilder<
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
> = {
  string<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "string" } }, R>;

  number<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "number" } }, R>;

  one: RelationAdder<"out", "one", F, R>;

  readonly _spec: { fields: F; relations: R };
};

/* ─────────────────────────────────────────────────────────────── */
/*  RELATION-ADDER                                                */
/* ─────────────────────────────────────────────────────────────── */
type RelationAdder<
  D extends Direction,
  C extends Cardinality,
  F extends Record<string, FieldSpec>,
  R extends Record<string, RelationSpec>,
> = <
  N extends string,
<<<<<<< dest:   18e9ccc3484f - randallb: Introduce GraphQL Builder Migration ...
  // deno-lint-ignore no-explicit-any
=======
>>>>>>> source: bd899641f7cc - randallb: Rename makeSpec to makeBfDbSpec and ...
  TargetFn extends () => SyncOrAsync<any>, // ① one broad type
  Resolved extends AnyBfNodeCtor = Awaited<ReturnType<TargetFn>>, // ② constrain here
  EB extends EdgeRelationBuilder = EdgeRelationBuilder,
>(
  name: N,
  target: TargetFn, // no intersection
  edge?: (e: EdgeRelationBuilder) => EB,
) => FieldBuilder<
  F,
  & R
  & {
    [K in N]: RelationSpec<C> & {
      direction: D;
      target: () => SyncOrAsync<Resolved>;
      // deno-lint-ignore ban-types
      props: EB extends EdgeRelationBuilder<infer EP> ? EP : {};
    };
  }
>;

/* ─────────────────────────────────────────────────────────────── */
/*  FACTORY                                                       */
/* ─────────────────────────────────────────────────────────────── */
export function makeFieldBuilder<
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
>(
  out = { fields: {} as F, relations: {} as R },
): FieldBuilder<F, R> {
  const next = <
    NF extends Record<string, FieldSpec>,
    NR extends Record<string, RelationSpec>,
  >(o: { fields: NF; relations: NR }): FieldBuilder<NF, NR> =>
    makeFieldBuilder(o);

  const string = <N extends string>(name: N) =>
    next({ ...out, fields: { ...out.fields, [name]: { kind: "string" } } });

  const number = <N extends string>(name: N) =>
    next({ ...out, fields: { ...out.fields, [name]: { kind: "number" } } });

  const addRel =
    <D extends Direction, C extends Cardinality>(direction: D, card: C) =>
    <
      N extends string,
      // deno-lint-ignore no-explicit-any
      TargetFn extends () => SyncOrAsync<any>,
      Resolved extends AnyBfNodeCtor = Awaited<ReturnType<TargetFn>>,
      EB extends EdgeRelationBuilder = EdgeRelationBuilder,
    >(
      name: N,
      target: TargetFn,
      edge?: (e: EdgeRelationBuilder) => EB,
    ) => {
      // deno-lint-ignore ban-types
      type EP = EB extends EdgeRelationBuilder<infer P> ? P : {};
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

  return {
    string,
    number,
    one: addRel("out", "one"),
    _spec: out,
  } as FieldBuilder<F, R>;
}
