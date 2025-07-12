/**
 * Document Query Fragment
 *
 * This fragment defines all document-related queries that can be composed
 * into the main Query root type.
 */

import { defineQueryFragment } from "../fragments/defineQueryFragment.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";

export const documentQueries = defineQueryFragment(
  (gql) =>
    gql
      .object("documentsBySlug", () => PublishedDocument, {
        args: (a) => a.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = (args.slug as string) || "getting-started";
          const post = await PublishedDocument.findX(slug).catch(() => null);
          return post;
        },
      }),
  {
    name: "documentQueries",
    description: "Document queries for published documentation",
    dependencies: ["PublishedDocument"],
  },
);
