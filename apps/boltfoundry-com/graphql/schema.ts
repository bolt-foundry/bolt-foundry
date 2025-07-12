/**
 * Selective GraphQL Schema for boltfoundry-com
 *
 * This demonstrates the viewer-centric approach by using a custom CurrentViewer
 * that provides access to blog and document content through a single entry point.
 * Only BlogPost, PublishedDocument, and CurrentViewer models are included.
 */

import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";
import { BoltFoundryComCurrentViewer } from "./BoltFoundryComCurrentViewer.ts";
import { currentViewerQueries } from "./currentViewerQueries.ts";
import { createAppSchema } from "@bfmono/apps/bfDb/graphql/createAppSchema.ts";

/**
 * Schema configuration for boltfoundry-com app
 *
 * This selective schema includes:
 * - BlogPost and PublishedDocument node types
 * - BoltFoundryComCurrentViewer with blog/document queries
 * - Single currentViewer entry point for all content
 * - No mutations (docs site is read-only)
 * - IsoDate scalar for BlogPost date fields
 */
export const schema = await createAppSchema({
  nodeTypes: [
    BlogPost,
    PublishedDocument,
    BoltFoundryComCurrentViewer,
  ],
  queryFragments: [currentViewerQueries],
  mutationFragments: [], // No mutations needed for docs site
  customScalars: ["IsoDate"],
});
