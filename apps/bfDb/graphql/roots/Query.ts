import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull
      .object("currentViewer", "CurrentViewer", {
        resolve: (_src, _args, ctx) => ctx.getCvForGraphql(),
      })
  );
  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
