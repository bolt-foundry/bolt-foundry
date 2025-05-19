import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { CurrentViewer } from "../../classes/CurrentViewer.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) => {
    return field
      .nonNull
      .object("currentViewer", () => CurrentViewer, {
        resolve: (_src, _args, ctx) => ctx.getCvForGraphql(),
      });
  });
  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
