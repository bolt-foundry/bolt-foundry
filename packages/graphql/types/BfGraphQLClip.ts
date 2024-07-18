import {
  arg,
  booleanArg,
  connectionFromArray,
  extendType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const BfGraphQLClipType = objectType({
  name: "BfClip",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.connectionField("clipReviews", {
      type: "BfClipReview",
      additionalArgs: {
        reviewable: booleanArg({ default: true }),
      },
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        const clip = await BfClip.find(bfCurrentViewer, parent.id);
        const clipReviewEdges = await clip?.queryClipReviewEdges() ?? [];
        const clipReviewPromises = clipReviewEdges.map(
          async (clipReviewEdge) => {
            return await BfClipReview.find(
              bfCurrentViewer,
              clipReviewEdge.metadata.bfTid,
            );
          },
        );
        const clipReviews = await Promise.all(clipReviewPromises);
        const clipReviewsForGraphql = clipReviews.map((clipReview) =>
          clipReview?.toGraphql()
        ).filter(Boolean);

        return connectionFromArray(clipReviewsForGraphql, args);
      },
    });
  },
});

export const BfGraphQLClipCreateMutation = mutationField("upsertClip", {
  type: BfGraphQLClipType,
  args: {
    originalClipId: nonNull(stringArg()),
    title: stringArg(),
    file: nonNull(arg({ type: "File" })),
  },
  resolve: async (
    _,
    { originalClipId, title },
    { bfCurrentViewer, params },
  ) => {
    logger.debug("upsertClip", { originalClipId, title });
    let clip = await BfClip.find(bfCurrentViewer, originalClipId);
    if (!clip) {
      logger.debug("Couldn't find clip, creating")
      clip = await BfClip.create(bfCurrentViewer, {
        title,
      }, {
        bfGid: originalClipId,
      });
    }
    if (clip) {
      const file = params.variables.file;
      logger.debug("Uploading file to new storage", file);
      await clip.createNewClipReview(file);
      logger.debug("Uploaded file successfully", file)
      return clip.toGraphql();
    }
  },
});

export const BfGraphQLClipCurrentViewerConnection = extendType({
  type: "BfCurrentViewerAccessToken",
  definition: (t) => {
    t.connectionField("clips", {
      additionalArgs: {
        reviewable: booleanArg({ default: true, description: "foo" }),
      },
      type: "BfClip",
      description: "Clips available to the current viewer.",
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        const clips = await BfClip.findReviewableClips(bfCurrentViewer);
        return connectionFromArray(clips, args);
      },
    });
  },
});
