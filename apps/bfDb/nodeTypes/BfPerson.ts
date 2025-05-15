import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

export class BfPerson extends BfNode<InferProps<typeof BfPerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      .object("memberOf", {
        type: "BfOrganization",
        isEdgeRelationship: true,
        edgeRole: "member",
      })
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
  );
}
