import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .string("documentsBySlug", {
        args: (a) => a.nonNull.string("slug"),
        resolve: (_root, { slug }) => {
          // For now, return a simple hello world for all slugs
          return `# Hello World\n\nYou requested documentation for: **${slug}**\n\nThis is a sample markdown document.`;
        },
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
