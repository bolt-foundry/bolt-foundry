import {
  type FieldBuilder,
  type FieldSpec,
  makeFieldBuilder,
  type RelationSpec,
} from "./makeFieldBuilder.ts";

export function defineBfNode<
  F extends Record<string, FieldSpec>,
  R extends Record<string, RelationSpec>,
>(
  builder: (
    // deno-lint-ignore ban-types
    f: FieldBuilder<{}, {}>,
  ) => FieldBuilder<F, R>, // 👈  include R
): { fields: F; relations: R } {
  const fields: Record<string, FieldSpec> = {};
  const fb = makeFieldBuilder(fields);

  builder(fb);

  return { fields: fb._spec as F, relations: fb._rels as R };
}
