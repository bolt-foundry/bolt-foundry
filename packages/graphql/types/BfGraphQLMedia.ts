import { extendType, objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { getLogger } from "deps.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";

const logger = getLogger(import.meta);

export const BfGraphQLMediaType = objectType({
  name: "BfMedia",
  description: "A media object",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("filename");
  },
});

export const BfGraphQLMediaQuery = extendType({
  type: "BfOrganization",
  definition(t) {
    t.connectionField("media", {
      type: "BfMedia",
      resolve: (_, args, { bfCurrentViewer }) => {
        logger.debug("Fetching all transcripts");
        const media = BfMedia.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: bfCurrentViewer.bfOid },
          {},
          args,
        );
        logger.debug("Fetched all transcripts successfully");
        return media;
      },
    });
  },
});
