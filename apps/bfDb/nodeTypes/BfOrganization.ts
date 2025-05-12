import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";
import { BfPerson } from "apps/bfDb/nodeTypes/BfPerson.ts";
import { BfError, BfErrorNotImplemented } from "lib/BfError.ts";

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

  async addPersonIfNotMember(person: BfPerson) {
    throw new BfErrorNotImplemented();
  }
}
