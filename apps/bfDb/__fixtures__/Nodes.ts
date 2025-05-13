import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

/* -------------------------------------------------------------------------- */
/*  Organisation                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Pet                                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Person                                                                    */
/* -------------------------------------------------------------------------- */

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
  );
}
