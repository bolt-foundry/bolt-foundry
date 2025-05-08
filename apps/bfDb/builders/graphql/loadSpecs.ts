import * as modelBarrel from "apps/bfDb/models/__generated__/nodeTypesList.ts";
import * as classBarrel from "apps/bfDb/classes/__generated__/classesList.ts";
import * as roots from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";

import { compileSpecs } from "apps/bfDb/builders/graphql/compiler.ts";
import type { GqlNodeSpec } from "apps/bfDb/builders/graphql/builder.ts";

export function loadModelTypes() {
  const specs: Record<string, GqlNodeSpec> = {};

  const barrels = [modelBarrel, classBarrel, roots];

  for (const b of barrels) {
    for (const cls of Object.values(b)) {
      if (typeof cls === "function" && "gqlSpec" in cls) {
        specs[cls.name] = cls.gqlSpec as never;
      }
    }
  }
  return compileSpecs(specs);
}
