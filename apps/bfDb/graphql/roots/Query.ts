import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { PublishedDocument } from "apps/bfDb/nodeTypes/PublishedDocument.ts";
import { GithubRepoStats } from "apps/bfDb/nodeTypes/GithubRepoStats.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .object("documentsBySlug", () => PublishedDocument, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "README";
          const post = await PublishedDocument.findX(slug).catch(() => null);
          return post;
        },
      })
      .object("githubRepoStats", () => GithubRepoStats, {
        resolve: async () => {
          return await GithubRepoStats.findX();
        },
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
