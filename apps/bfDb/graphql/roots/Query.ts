import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { Document } from "apps/bfDb/nodeTypes/Document.ts";
import { BlogPost } from "apps/bfDb/nodeTypes/BlogPost.ts";
import { GithubRepoStats } from "apps/bfDb/nodeTypes/GithubRepoStats.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .object("documentsBySlug", () => Document, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "README";
          const doc = await Document.findX(slug).catch(() => null);
          return doc;
        },
      })
      .object("blogPost", () => BlogPost, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "README";
          const post = await BlogPost.findX(slug).catch(() => null);
          return post;
        },
      })
      .connection("blogPosts", () => BlogPost, {
        args: (a) =>
          a
            .string("sortDirection")
            .string("filterByYear"),
        resolve: async (_root, args, _ctx) => {
          // Default to reverse chronological order
          const sortDir = (args.sortDirection as "ASC" | "DESC") || "DESC";
          const posts = await BlogPost.listAll(sortDir);

          // Apply year filter if provided
          const filtered = args.filterByYear
            ? posts.filter((p) => p.id.startsWith(args.filterByYear as string))
            : posts;

          // Return relay connection
          return BlogPost.connection(filtered, args);
        },
      })
      .connection("documents", () => Document, {
        args: (a) =>
          a
            .string("sortDirection"),
        resolve: async (_root, args, _ctx) => {
          // Default to alphabetical order
          const sortDir = (args.sortDirection as "ASC" | "DESC") || "ASC";
          const docs = await Document.listAll(sortDir);

          // Return relay connection
          return Document.connection(docs, args);
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
