import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { defineGqlNode } from "../builder/builder.ts";
import { CurrentViewer } from "../../classes/CurrentViewer.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = defineGqlNode((field) => {
    field
      .nonNull
      .object("currentViewer", () => CurrentViewer, {
        resolve: (_src, _args, ctx) => ctx.getCvForGraphql(),
      });
  });
}
