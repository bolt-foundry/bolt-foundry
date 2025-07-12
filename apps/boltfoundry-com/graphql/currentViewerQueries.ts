/**
 * CurrentViewer Query Fragment for boltfoundry-com
 *
 * This fragment exposes the BoltFoundryComCurrentViewer as the root currentViewer field,
 * providing a viewer-centric entry point to all blog and document content.
 */

import { defineQueryFragment } from "@bfmono/apps/bfDb/graphql/fragments/defineQueryFragment.ts";
import { BoltFoundryComCurrentViewer } from "./BoltFoundryComCurrentViewer.ts";

export const currentViewerQueries = defineQueryFragment(
  (gql) =>
    gql.object("currentViewer", () => BoltFoundryComCurrentViewer, {
      resolve: (_root, _args, _ctx) => {
        // Return a simple viewer object for boltfoundry-com
        return new BoltFoundryComCurrentViewer();
      },
    }),
  {
    name: "currentViewerQueries",
    description: "Root currentViewer field for boltfoundry-com app",
    dependencies: [
      "BoltFoundryComCurrentViewer",
      "BlogPost",
      "PublishedDocument",
    ],
  },
);
