import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

export class BfPerson extends BfNode<InferProps<typeof BfPerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      // Define an edge relationship to BfOrganization
      // The field name "memberOf" automatically becomes the edge role
      .object(
        "memberOf",
        () =>
          import("apps/bfDb/nodeTypes/BfOrganization.ts").then((m) =>
            m.BfOrganization
          ),
      )
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
  );
}
