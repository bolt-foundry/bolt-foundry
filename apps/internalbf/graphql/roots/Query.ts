import { GraphQLObjectBase } from "@bfmono/apps/bfDb/classes/GraphQLObjectBase.ts";
import { Dashboard } from "../Dashboard.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .object("dashboard", () => Dashboard, {
        resolve: () => ({}), // Dashboard is a stateless object
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
