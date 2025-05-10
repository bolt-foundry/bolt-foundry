/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

export type FieldSpec =
  | { kind: "string" }
  | { kind: "number" };

type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : never;

/* -------------------------------------------------------------------------- */
/*  Relation primitives                                                       */
/* -------------------------------------------------------------------------- */

import type { AnyBfNodeCtor } from "apps/bfDb/classes/BfNode.ts";

export type RelationSpec = {
  target: () => AnyBfNodeCtor;
  props: Record<string, FieldSpec>;
  multiplicity: "one" | "many";
};

/* -------------------------------------------------------------------------- */
/*  Builder types — accumulating generics                                     */
/* -------------------------------------------------------------------------- */

export type FieldBuilder<
  // field map
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // relation map
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
> = {
  /* ───────── scalars ───────── */
  string<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "string" } }, R>;

  number<N extends string>(
    name: N,
  ): FieldBuilder<F & { [K in N]: { kind: "number" } }, R>;

  /* ───────── relations ───────── */
  relation<
    N extends string,
    Target extends AnyBfNodeCtor,
    // deno-lint-ignore ban-types
    EdgeF extends Record<string, FieldSpec> = {},
  >(
    name: N,
    target: () => Target,
    // deno-lint-ignore ban-types
    edge: (e: FieldBuilder<{}>) => FieldBuilder<EdgeF>,
  ):
    & FieldBuilder<
      F,
      & R
      & {
        [K in N]: {
          target: () => Target;
          props: EdgeF;
          multiplicity: "one" | "many";
        };
      }
    >
    & {
      /** call immediately for “one-to-one” */
      one(): FieldBuilder<
        F,
        & R
        & {
          [K in N]: {
            target: () => Target;
            props: EdgeF;
            multiplicity: "one";
          };
        }
      >;
      /** call immediately for “one-to-many” (default if you don’t call it) */
      many(): FieldBuilder<
        F,
        & R
        & {
          [K in N]: {
            target: Target;
            props: EdgeF;
            multiplicity: "many";
          };
        }
      >;
    };

  /* phantom maps – populated at runtime for defineBfNode/tests */
  _spec: F;
  _rels: R;
};

/* -------------------------------------------------------------------------- */
/*  Builder factory (single argument)                                         */
/* -------------------------------------------------------------------------- */

export function makeFieldBuilder<
  // deno-lint-ignore ban-types
  F extends Record<string, FieldSpec> = {},
  // deno-lint-ignore ban-types
  R extends Record<string, RelationSpec> = {},
>(
  fieldStore: Record<string, FieldSpec>,
): FieldBuilder<F, R> {
  const relationStore: Record<string, RelationSpec> = {};

  /* ------------------------------------------------ scalars ---- */
  const addScalar =
    <Kind extends "string" | "number", N extends string>(kind: Kind) =>
    (name: N): FieldBuilder<
      F & { [K in N]: { kind: Kind } },
      R
    > => {
      fieldStore[name] = { kind };
      return makeFieldBuilder<
        F & { [K in N]: { kind: Kind } },
        R
      >(fieldStore);
    };

  /* ------------------------------------------------ relation ---- */
  function addRelation<
    N extends string,
    Target extends AnyBfNodeCtor,
    // deno-lint-ignore ban-types
    EdgeF extends Record<string, FieldSpec> = {},
  >(
    name: N,
    target: () => Target,
    // deno-lint-ignore ban-types
    edgeBuilder: (e: FieldBuilder<{}>) => FieldBuilder<EdgeF>,
  ) {
    const edgeFields: Record<string, FieldSpec> = {};
    edgeBuilder(makeFieldBuilder(edgeFields));

    const spec: RelationSpec = {
      target,
      props: edgeFields,
      multiplicity: "many", // default; may be flipped below
    };
    relationStore[name] = spec;

    type BaseSpec = {
      [K in N]: {
        target: () => Target;
        props: EdgeF;
        multiplicity: "one" | "many";
      };
    };
    type OneSpec = {
      [K in N]: {
        target: () => Target;
        props: EdgeF;
        multiplicity: "one";
      };
    };
    type ManySpec = {
      [K in N]: {
        target: Target; // ← constructor, **not** thunk
        props: EdgeF;
        multiplicity: "many";
      };
    };

    const chain = {
      one(): FieldBuilder<F, R & OneSpec> {
        spec.multiplicity = "one";
        return builder as unknown as FieldBuilder<F, R & OneSpec>;
      },
      many(): FieldBuilder<F, R & ManySpec> {
        spec.multiplicity = "many";
        return builder as unknown as FieldBuilder<F, R & ManySpec>;
      },
    };

    return chain as FieldBuilder<F, R & BaseSpec> & typeof chain;
  }

  /* ------------------------------------------------ public API -- */
  const builder: FieldBuilder<F, R> = {
    string: addScalar("string"),
    number: addScalar("number"),
    relation: addRelation,
    _spec: fieldStore as F,
    _rels: relationStore as R,
  };

  return builder;
}

/* -------------------------------------------------------------------------- */
/*  Helper: props type from field spec map                                    */
/* -------------------------------------------------------------------------- */

export type PropsFromFieldSpec<F extends Record<string, FieldSpec>> = {
  [K in keyof F]: FieldValue<F[K]>;
};

// deno-lint-ignore ban-types
export type RelationBuilder = FieldBuilder<{}, {}>; // <-- add at bottom
