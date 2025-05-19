import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { CurrentViewer } from "../../classes/CurrentViewer.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) => {
    return field
      .nonNull
      .object("currentViewer", () => CurrentViewer, {
        resolve: (_src, _args, ctx) => ctx.getCvForGraphql(),
      })
      // Health check field
      .nonNull.boolean("ok", {
        resolve: () => true,
      })
      // Test field for the TestType
      .object("test", () => Promise.resolve({ name: "TestType" }), {
        resolve: () => ({ name: "Test", id: "test-id", isActive: true, count: 42 }),
      });
  });
  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
