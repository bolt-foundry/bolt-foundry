import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import type { GqlNodeSpec } from "apps/bfDb/graphql/builder/builder.ts";

export function compileSpecs(
  specs: Record<string, GqlNodeSpec | undefined>,
): unknown[] {
  const collected: unknown[] = [];
  const seen = new Set<string>();

  function add(def: unknown) {
    const name = (def as { name?: string }).name;

    // allow multiple Mutation type defs so their fields merge
    const isRootMutation = name === "Mutation";

    if (typeof name === "string" && seen.has(name) && !isRootMutation) return;

    if (typeof name === "string") seen.add(name);
    collected.push(def);
  }

  for (const [typeName, spec] of Object.entries(specs)) {
    if (!spec) continue; // nothing to compile

    const res = specToNexusObject(typeName, spec);
    Array.isArray(res) ? res.forEach(add) : add(res);
  }

  return collected;
}
