/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

export type FieldSpec =
  | { kind: "string" }
  | { kind: "number" };

export type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : never;

/* -------------------------------------------------------------------------- */
/*  Relation primitives                                                       */
/* -------------------------------------------------------------------------- */

export type Direction = "out" | "in";
export type Cardinality = "one" | "many";

/** Forward decl for any node ctor (keeps builders generic-friendly) */
// deno-lint-ignore no-explicit-any
export type AnyBfNodeCtor = abstract new (...args: any[]) => any;

/* -------------------------------------------------------------------------- */
/*  Edge-builder helper                                                       */
/* -------------------------------------------------------------------------- */

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

  many<T extends AnyBfNodeCtor, N extends string = string>(
    opposite: N,
    target: () => T,
  ): RelationBuilder<EdgeP, "many">;

  /* raw access for FieldBuilder.in / addRelation() */
  readonly _spec: {
    cardinality: C;
    target: () => AnyBfNodeCtor;
    props: EdgeP;
    opposite?: string;
  };
};

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
