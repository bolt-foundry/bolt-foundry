import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

export class BfPerson extends BfNode<InferProps<typeof BfPerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      .object(
        "memberOf", 
        () => import("apps/bfDb/nodeTypes/BfOrganization.ts").then(m => m.BfOrganization)
        // No options needed - the field name itself defines the relationship
      
      )
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
  );
}
