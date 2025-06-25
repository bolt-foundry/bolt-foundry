import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

export class BfExamplePerson
  extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("email")
      .string("name")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
      .one("primaryOrg", () =>
        // if you do a runtime import, you avoid circular dependencies but still get type safety
        import("apps/bfDb/__fixtures__/Nodes.ts").then((m) => m.BfExampleOrg))
  );
}
