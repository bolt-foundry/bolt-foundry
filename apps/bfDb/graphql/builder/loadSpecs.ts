import * as barrel from "apps/bfDb/models/__generated__/modelClassesList.ts";
import { compileNodeSpecs } from "apps/bfDb/graphql/builder/compiler.ts";

export function loadModelTypes() {
  const nodeClasses = Object.values(barrel).filter((m) =>
    typeof m === "function" &&
    "gqlSpec" in m
  );
  return compileNodeSpecs(nodeClasses);
}