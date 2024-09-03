import {
  type ConnectionArguments,
  connectionFromArray,
  objectType,
} from "packages/graphql/deps.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";

export const BfGraphQLPerson = objectType({
  name: "BfPerson",
  description: "A real human who uses our system",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
    t.string("email");
    t.connectionField("accounts", {
      type: "BfAccount",
      async resolve(
        _,
        args: ConnectionArguments,
        { bfCurrentViewer }: GraphQLContext,
      ) {
        const accounts = await BfAccount.findAllForCurrentViewer(
          bfCurrentViewer,
        );
        const accountsForGraphQL = accounts.map((account) =>
          account.toGraphql()
        );
        return connectionFromArray(accountsForGraphQL, args);
      },
    });
  },
});
