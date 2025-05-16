import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";
import { BfOrganization } from "./BfOrganization.ts";

export class BfPerson extends BfNode<InferProps<typeof BfPerson>> {
  static override gqlSpec = this.defineGqlNode((node) =>
    node
      .string("email")
      .string("name")
      .object("primaryOrg", () => BfOrganization, {
        // deno-lint-ignore require-await
        resolve: async (_root, _args, _ctx, _info) => {
          // TODO: Implement edge resolution logic
          // This would query for BfEdge relationships where this person is the source
          // and the target is an organization with role "member"
          return null; // Placeholder until edge query is implemented
        },
      })
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
  );
}