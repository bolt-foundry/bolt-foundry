import * as modelBarrel from "apps/bfDb/models/__generated__/modelClassesList.ts";
import * as coreBarrel from "apps/bfDb/coreModels/__generated__/coreModelClassesList.ts";
import * as classBarrel from "apps/bfDb/classes/__generated__/classesList.ts";
import * as roots from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";

import { compileSpecs } from "apps/bfDb/graphql/builder/compiler.ts";
import type { GqlNodeSpec } from "apps/bfDb/graphql/builder/builder.ts";

export function loadModelTypes() {
  const specs: Record<string, GqlNodeSpec> = {};

  const barrels = [modelBarrel, coreBarrel, classBarrel];

  for (const b of barrels) {
    for (const cls of Object.values(b)) {
      if (typeof cls === "function" && "gqlSpec" in cls) {
        specs[cls.name] = cls.gqlSpec as never;
      }
    }
  }

  return compileSpecs({ ...specs, ...roots });
}
