import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class HomeComponent extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .string("__typename", {
        resolve: () => "HomeComponent",
      })
  );

  override toGraphql() {
    return { __typename: "HomeComponent", id: "HomeComponent" };
  }
}
