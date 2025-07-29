/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

export type FieldSpec =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "json" }
  | { kind: "enum"; values: readonly Array<string> };

export type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : S extends { kind: "json" } ? import("@bfmono/apps/bfDb/bfDb.ts").JSONValue
  : S extends { kind: "enum"; values: readonly Array<infer V> } ? V
  : never;

/* -------------------------------------------------------------------------- */
/*  Relation primitives                                                       */
/* -------------------------------------------------------------------------- */

export type Direction = "out" | "in";
export type Cardinality = "one" | "many";

/** Forward decl for any node ctor (keeps builders generic-friendly) */
// deno-lint-ignore no-explicit-any
export type AnyBfNodeCtor = abstract new (...args: Array<any>) => any;

/** Forward decl for any GraphQL object ctor */
export type AnyGraphqlObjectBaseCtor = abstract new (
  // deno-lint-ignore no-explicit-any
  ...args: Array<any>
  // deno-lint-ignore no-explicit-any
) => any;

/** Forward decl that includes objects with protected constructors like CurrentViewer */
// deno-lint-ignore no-explicit-any
export type AnyConstructor = new (...args: Array<any>) => any;

/* -------------------------------------------------------------------------- */
/*  Complete RelationSpec type (runtime)                                      */
/* -------------------------------------------------------------------------- */
export type RelationSpec<C extends Cardinality = Cardinality> = {
  direction: Direction;
  cardinality: C;
  target: () => AnyBfNodeCtor;
  props: Record<string, FieldSpec>;
  opposite?: string;
};

/* -------------------------------------------------------------------------- */
/*  Helper – derive props type from a field-spec map                          */
/* -------------------------------------------------------------------------- */
export type PropsFromFieldSpec<F extends Record<string, FieldSpec>> = {
  [K in keyof F]: FieldValue<F[K]>;
};
