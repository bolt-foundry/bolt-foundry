import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

export class BfOrganization extends BfNode<InferProps<typeof BfOrganization>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("name")
      .string("domain")
  );
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
  );
}
