import {
arg,
booleanArg,
  connectionFromArray,
  extendType,
  idArg,
  mutationField,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { BfGraphQLClipReviewType } from "packages/graphql/types/BfGraphQLClipReview.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfGraphQLBfCurrentViewerAccessToken, BfGraphQLCurrentViewerType } from "packages/graphql/types/BfGraphQLCurrentViewer.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";

export const BfGraphQLClipType = objectType({
  name: "BfClip",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.connectionField("clipReviews", {
      type: "BfClipReview",
      additionalArgs: {
        reviewable: booleanArg({default: true}),
      },
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        const clip = await BfClip.find(bfCurrentViewer, parent.id);
        const clipReviewEdges = await clip?.queryClipReviewEdges() ?? [];
        const clipReviewPromises = clipReviewEdges.map(async (clipReviewEdge) => {
          return await BfClipReview.find(bfCurrentViewer, clipReviewEdge.metadata.bfTid)
        })
        const clipReviews = await Promise.all(clipReviewPromises);
        const clipReviewsForGraphql = clipReviews.map(clipReview => clipReview?.toGraphql()).filter(Boolean);
        
        return connectionFromArray(clipReviewsForGraphql, args);
      },
    });
  },
});

export const BfGraphQLClipCreateMutation = mutationField("upsertClip", {
  type: BfGraphQLClipType,
  args: {
    originalClipId: stringArg(),
    title: stringArg(),
  },
  resolve: async (_, { originalClipId, title }, { bfCurrentViewer }) => {
    const clip = await BfClip.find(bfCurrentViewer, originalClipId);
    if (!clip) {
      const newClip = await BfClip.create(bfCurrentViewer, {
        title,
      }, {
        bfGid: originalClipId,
      });
      return newClip.toGraphql();
    }
    if (clip) {
      await clip.createNewClipReview();
      return clip.toGraphql();
    }
  },
});

export const BfGraphQLClipCurrentViewerConnection = extendType({
  type: 'BfCurrentViewerAccessToken',
  definition: (t) => {
    t.connectionField("clips", {
      additionalArgs: {
        reviewable: booleanArg({default: true, description: "foo"}),
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
