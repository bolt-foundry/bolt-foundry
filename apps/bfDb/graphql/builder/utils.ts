import { GqlScalar } from "./builder.ts";
export { GqlScalar };

export interface ArgBuilder {
  id(name: string): ArgBuilder;
  string(name: string): ArgBuilder;
  int(name: string): ArgBuilder;
  float(name: string): ArgBuilder;
  boolean(name: string): ArgBuilder;
  json(name: string): ArgBuilder;
}

/** Convert DSL arg‑builder calls into a `{ argName: scalar }` record. */
export function collectArgs(
  fn?: (a: ArgBuilder) => void,
): Record<string, GqlScalar> | undefined {
  if (!fn) return undefined;
  const store: Record<string, GqlScalar> = {};
  const b: ArgBuilder = {
    id: (n) => (store[n] = "id", b),
    string: (n) => (store[n] = "string", b),
    int: (n) => (store[n] = "int", b),
    float: (n) => (store[n] = "float", b),
    boolean: (n) => (store[n] = "boolean", b),
    json: (n) => (store[n] = "json", b),
  } as const;
  fn(b);
  return store;
}
