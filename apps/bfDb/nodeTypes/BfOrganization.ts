import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";
import { BfPerson } from "./BfPerson.ts";

export class BfOrganization extends BfNode<InferProps<typeof BfOrganization>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("name")
      .string("domain")
      .object("primaryOwner", () => BfPerson, {
        // deno-lint-ignore require-await
        resolve: async (_root, _args, _ctx, _info) => {
          // TODO: Implement edge resolution logic
          // This would query for BfEdge relationships where this organization is the target
          // and the source is a person with role "owner"
          return null; // Placeholder until edge query is implemented
        },
      })
  );
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
  );
}
