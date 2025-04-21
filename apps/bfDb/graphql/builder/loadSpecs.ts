import * as barrel from "apps/bfDb/models/__generated__/modelClassesList.ts";
import * as roots from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import { compileSpecs } from "apps/bfDb/graphql/builder/compiler.ts";
import type { GqlNodeSpec } from "apps/bfDb/graphql/builder/builder.ts";

export function loadModelTypes() {
  const specs: Record<string, GqlNodeSpec> = {};

  for (const cls of Object.values(barrel)) {
    if (typeof cls === "function" && "gqlSpec" in cls) {
      specs[cls.name] = cls.gqlSpec as never;
    }
  }

  return compileSpecs({ ...specs, ...roots });
}
