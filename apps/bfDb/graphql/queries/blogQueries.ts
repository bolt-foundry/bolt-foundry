/**
 * Blog Query Fragment
 *
 * This fragment defines all blog-related queries that can be composed
 * into the main Query root type.
 */

import { defineQueryFragment } from "../fragments/defineQueryFragment.ts";
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";

export const blogQueries = defineQueryFragment(
  (gql) =>
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
      }),
  {
    name: "blogQueries",
    description: "Blog post queries including individual posts and collections",
    dependencies: ["BlogPost", "IsoDate"],
  },
);
