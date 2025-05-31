import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      // Super janky doc implementation for v0.1
      .string("docContent", {
        args: (a) => a.nonNull.string("slug"),
        resolve(_root, { slug }: { slug: string }) {
          // Hardcoded for now
          const docs: Record<string, string> = {
            "getting-started": "# Getting Started\n\nWelcome to Bolt Foundry!",
            "README": "# Bolt Foundry Documentation\n\nThis is the main docs.",
          };
          return docs[slug] || `# ${slug}\n\nContent not found`;
        },
      })
      .string("docTitle", {
        args: (a) => a.nonNull.string("slug"),
        resolve(_root, { slug }: { slug: string }) {
          // Hardcoded titles
          const titles: Record<string, string> = {
            "getting-started": "Getting Started",
            "README": "Bolt Foundry Documentation",
          };
          return titles[slug] || slug;
        },
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
