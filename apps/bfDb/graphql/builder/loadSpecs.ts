import * as barrel from "apps/bfDb/models/__generated__/modelClassesList.ts";
import * as roots from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import * as classes from "apps/bfDb/classes/__generated__/classesList.ts";
import * as coreModels from "apps/bfDb/coreModels/__generated__/coreModelClassesList.ts";
import { compileSpecs } from "apps/bfDb/graphql/builder/compiler.ts";
import type { GqlNodeSpec } from "apps/bfDb/graphql/builder/builder.ts";

export function loadModelTypes() {
  // Allow `undefined` so we can safely skip classes that deliberately
  // disable GraphQL by setting `gqlSpec = null`.
  const specs: Record<string, GqlNodeSpec | undefined> = {};

  /** Helper to pull `.gqlSpec` out of a re-export list */
  const collect = (mod: Record<string, unknown>) => {
    for (const item of Object.values(mod)) {
      if (typeof item === "function" && "gqlSpec" in item) {
        const spec = (item as { gqlSpec?: GqlNodeSpec | null }).gqlSpec ??
          undefined;
        specs[(item as { name: string }).name] = spec;
      }
    }
  };

  collect(barrel);
  collect(roots);
  collect(classes);
  collect(coreModels);

  return compileSpecs(specs);
}
