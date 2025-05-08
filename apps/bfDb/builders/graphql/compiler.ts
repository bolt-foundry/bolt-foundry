import { specsToNexusDefs } from "./fromSpec.ts";
import type { GqlNodeSpec } from "./builder.ts";

export function compileSpecs(
  specs: Record<string, GqlNodeSpec | undefined>,
): unknown[] {
  // drop `undefined` entries
  const filtered = Object.fromEntries(
    Object.entries(specs).filter(([, v]) => v),
  ) as Record<string, GqlNodeSpec>;

  // one single build guarantees real interfaces override placeholders
  return specsToNexusDefs(filtered);
}
