/**
 * BoltFoundry.com specific viewer object for GraphQL
 *
 * This is a simple GraphQL object that provides blog and document query methods
 * for the boltfoundry-com application. It's completely separate from the
 * authentication CurrentViewer system.
 */

import { GraphQLObjectBase } from "@bfmono/apps/bfDb/graphql/GraphQLObjectBase.ts";
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";

export class BoltFoundryComCurrentViewer extends GraphQLObjectBase {
  constructor() {
    super("boltfoundry-com-viewer");
  }

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
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
      .object("documentsBySlug", () => PublishedDocument, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "getting-started";
          const post = await PublishedDocument.findX(slug).catch(() => null);
          return post;
        },
      })
  );

  override toGraphql() {
    return {
      __typename: "BoltFoundryComCurrentViewer",
      id: this.id,
    };
  }
}
