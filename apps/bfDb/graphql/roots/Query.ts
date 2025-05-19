import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field.boolean("ok")
  );
  
  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
