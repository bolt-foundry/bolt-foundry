import {
  makeRelationBuilder,
  type RelationBuilder,
} from "./RelationBuilder.ts";
import {
  type FieldBuilder,
  type FieldSpec,
  makeFieldBuilder,
} from "./makeFieldBuilder.ts";

/* ─────────── defineBfNode ────────── */

export function defineBfNode<
  F extends Record<string, FieldSpec>,
  R = unknown,
>(
  // deno-lint-ignore ban-types
  builder: (f: FieldBuilder<{}>, r: RelationBuilder) => FieldBuilder<F>,
): { fields: F; relations: R } {
  const fields: Record<string, FieldSpec> = {};
  const relations: unknown[] = [];

  // NB: the cast is only for the runtime side; the compile-time
  //     shape is captured in the generics above.
  builder(makeFieldBuilder(fields), makeRelationBuilder(relations));

  return { fields: fields as F, relations: relations as R };
}
