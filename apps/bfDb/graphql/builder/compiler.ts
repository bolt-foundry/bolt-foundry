import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
} from "apps/bfDb/classes/BfNodeBase.ts";

/**
 * Converts the static `gqlSpec` definitions declared on a list of `BfNode` classes
 * into Nexus object‑type definitions that can be passed directly to `makeSchema`.
 *
 * The helper takes care of three concerns:
 *  1. **Skipping** classes that do not expose a `gqlSpec`.
 *  2. **Flattening** the various return shapes of `specToNexusObject` (single
 *     object vs. array of objects).
 *  3. **De‑duplicating** definitions that share the same GraphQL `name` so that
 *     they are not registered twice with Nexus/GraphQL – this prevents the
 *     “Type X was defined more than once” error at schema‑build time (e.g. the
 *     shared `JSON` scalar).
 */
export function compileNodeSpecs<TProps extends BfNodeBaseProps>(
  nodeClasses: Array<typeof BfNodeBase<TProps> & { gqlSpec?: unknown }>,
): Array<unknown> {
  const collected: unknown[] = [];
  const seenNames = new Set<string>();

  const add = (def: unknown) => {
    const name = (def as { name?: string }).name;
    if (typeof name === "string") {
      if (seenNames.has(name)) return; // already registered – skip duplicate
      seenNames.add(name);
    }
    collected.push(def);
  };

  for (const NodeClass of nodeClasses) {
    const spec = NodeClass.gqlSpec;
    if (!spec) continue; // nothing to compile

    const result = specToNexusObject(NodeClass.name, spec as never);

    if (Array.isArray(result)) {
      for (const def of result) add(def);
    } else {
      add(result);
    }
  }

  return collected;
}
