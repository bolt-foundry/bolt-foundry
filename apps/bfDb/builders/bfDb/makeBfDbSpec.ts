import { type FieldBuilder, makeFieldBuilder } from "./makeFieldBuilder.ts";
import type {
  FieldSpec,
  RelationSpec,
} from "@bfmono/apps/bfDb/builders/bfDb/types.ts";

export function makeBfDbSpec<
  F extends Record<string, FieldSpec>,
  R extends Record<string, RelationSpec>,
>(
  // deno-lint-ignore ban-types
  build: (f: FieldBuilder<{}, {}>) => FieldBuilder<F, R>,
): { fields: F; relations: R } {
  const b = build(makeFieldBuilder());

  // Your builder already stashes the maps on itself – just return them. Keeps type safety.
  return { fields: b._spec.fields, relations: b._spec.relations };
}
