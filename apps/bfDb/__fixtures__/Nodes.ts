import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfExamplePerson } from "@bfmono/apps/bfDb/CircularNodeExample.ts";

export class BfExampleOrg extends BfNode<InferProps<typeof BfExampleOrg>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("name")
      .string("domain")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
      .one("primaryOwner", () => BfExamplePerson)
  );
}

export class BfExamplePet extends BfNode<InferProps<typeof BfExamplePet>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("name")
      .string("type")
  );
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("type")
      .one("vetHospital", () => BfExampleOrg)
  );
}
