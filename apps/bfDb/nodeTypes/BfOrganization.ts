import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

export class BfOrganization extends BfNode<InferProps<typeof BfOrganization>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("name")
      .string("domain")
    // Removing the members relationship for now to focus on 1:1
  );
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
  );
}
