export type GqlScalar = "id" | "string" | "int" | "float" | "boolean" | "json";

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
  const add = (scalar: GqlScalar) =>
    (name: string): ArgBuilder => ((store[name] = scalar), b);

  const b: ArgBuilder = {
    id: add("id"),
    string: add("string"),
    int: add("int"),
    float: add("float"),
    boolean: add("boolean"),
    json: add("json"),
  } as const;
  fn(b);
  return store;
}
