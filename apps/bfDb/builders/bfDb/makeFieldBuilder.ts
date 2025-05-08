/* ---------- builder ----------------------------------------------- */

export type FieldSpec =
  | { kind: "string" }
  | { kind: "number" };

export type FieldBuilder<
  Acc extends Record<string, FieldSpec> = {},
> = {
  string<N extends string>(
    name: N,
  ): FieldBuilder<Acc & { [K in N]: { kind: "string" } }>;

  number<N extends string>(
    name: N,
  ): FieldBuilder<Acc & { [K in N]: { kind: "number" } }>;

  _spec: Acc;
};

export function makeFieldBuilder<
  Acc extends Record<string, FieldSpec> = {},
>(tgt: Record<string, FieldSpec>): FieldBuilder<Acc> {
  return {
    string<N extends string>(name: N) {
      tgt[name] = { kind: "string" };
      return makeFieldBuilder<
        Acc & { [K in N]: { kind: "string" } }
      >(tgt);
    },
    number<N extends string>(name: N) {
      tgt[name] = { kind: "number" };
      return makeFieldBuilder<
        Acc & { [K in N]: { kind: "number" } }
      >(tgt);
    },
    _spec: {} as Acc,
  };
}

/* ---------- props helper ------------------------------------------ */

type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : never;

export type PropsFromFieldSpec<F extends Record<string, FieldSpec>> = {
  [
    K in keyof F as string extends K ? never
      : number extends K ? never
      : symbol extends K ? never
      : K
  ]: FieldValue<F[K]>;
};
