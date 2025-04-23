import { specsToNexusDefs } from "apps/bfDb/graphql/builder/fromSpec.ts";
import type { GqlNodeSpec } from "apps/bfDb/graphql/builder/builder.ts";

export function compileSpecs(
  specs: Record<string, GqlNodeSpec | undefined>,
): unknown[] {
  const collected: unknown[] = [];
  const seen = new Set<string>();

  function add(def: unknown) {
    const name = (def as { name?: string }).name;

    // allow multiple Query *and* Mutation type defs so their fields merge
    const isRoot = name === "Mutation" || name === "Query";

    if (typeof name === "string" && seen.has(name) && !isRoot) return;

    if (typeof name === "string") seen.add(name);
    collected.push(def);
  }

  for (const [typeName, spec] of Object.entries(specs)) {
    if (!spec) continue; // nothing to compile
    const res = specsToNexusDefs({ [typeName]: spec });
    Array.isArray(res) ? res.forEach(add) : add(res);
  }

  return collected;
}
