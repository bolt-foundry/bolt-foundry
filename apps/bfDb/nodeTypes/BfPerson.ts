import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";
import { BfOrganization } from "apps/bfDb/nodeTypes/BfOrganization.ts";

export class BfPerson extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
      .relation(
        "organizations",
        () => BfOrganization,
        (edge) => edge.string("role"),
      )
  );
}
