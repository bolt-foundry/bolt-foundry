import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull
      .object("currentViewer", "CurrentViewer", {
        resolve: (_src, _args, ctx) => ctx.getCvForGraphql(),
      })
      // Add test field that returns a TestType
      .object("test", "TestType", {
        resolve: () => ({
          id: "test-123",
          name: "Test Object",
          isActive: true,
          count: 42,
        }),
      })
      // Add health check field
      .nonNull.boolean("ok", {
        resolve: () => true,
      })
  );
  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
