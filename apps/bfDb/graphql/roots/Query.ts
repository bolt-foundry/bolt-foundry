import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { CurrentViewer, CurrentViewerLoggedOut } from "./CurrentViewer.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

/** Root object that extends the *real* GraphQL Query type */
export class Query extends GraphQLObjectBase {
  static override gqlSpec = defineGqlNode((_field, relation) => {
    // The relation DSL only describes the schema; resolver lives in `me()`.
    relation.one("me", () => CurrentViewer);
  });

  /**
   * Resolver for the `me` field.
   * (GraphQL's default field resolver treats methods as callables.)
   */
  me() {
    // For now we always return an anonymous viewer.
    // Replace with real auth logic once it exists.
    return CurrentViewerLoggedOut.create();
  }
}
