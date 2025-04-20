import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
} from "apps/bfDb/classes/BfNodeBase.ts";

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
