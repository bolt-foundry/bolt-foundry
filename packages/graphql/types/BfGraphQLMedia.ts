import {
  extendType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { getLogger } from "deps.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfMediaNodeVideoGoogleDriveResource } from "packages/bfDb/models/BfMediaNodeVideoGoogleDriveResource.ts";
import {
  BfMediaNodeVideo,
  BfMediaNodeVideoRole,
  BfMediaNodeVideoStatus,
} from "packages/bfDb/models/BfMediaNodeVideo.ts";

const logger = getLogger(import.meta);

export const BfGraphQLMediaType = objectType({
  name: "BfMedia",
  description: "A media object",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("filename");
    t.string("fileId", {
      deprecation: "Only used for demo hack",
    });
    t.string("name");
    t.string("previewVideoUrl", {
      resolve: async ({ id }, _, { bfCurrentViewer }) => {
        const media = await BfMedia.findX(bfCurrentViewer, id);
        const video = await media.findVideo(BfMediaNodeVideoRole.PREVIEW);
        return await video?.getFilePath();
      },
    });
  },
});

export const BfGraphQLMediaQuery = extendType({
  type: "BfOrganization",
  definition(t) {
    t.connectionField("media", {
      type: "BfMedia",
      resolve: async (_, args, { bfCurrentViewer }) => {
        logger.debug("Fetching all media");
        const media = await BfMedia.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: bfCurrentViewer.bfOid },
          {},
          args,
        );
        logger.debug("Fetched all media successfully");
        return media;
      },
    });
  },
});

export const BfGraphQLMediaDeleteMutation = mutationField(
  "deleteMedia",
  {
    type: BfGraphQLMediaType,
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_, { id }, { bfCurrentViewer }) => {
      const media = await BfMedia.find(bfCurrentViewer, id);
      if (!media) {
        throw new Error("Media not found");
      }
      logger.debug("deleteMedia", { id });
      await media.delete();
      logger.debug("Deleted media successfully");
      return media.toGraphql();
    },
  },
);
