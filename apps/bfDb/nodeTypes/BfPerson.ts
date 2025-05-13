import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

export class BfPerson extends BfNode<InferProps<typeof BfPerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
  );
}
