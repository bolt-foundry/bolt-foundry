import { connectionFromArray, mutationField, objectType, stringArg } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { BfGraphQLClipReviewType } from "packages/graphql/types/BfGraphQLClipReview.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";

export const BfGraphQLClipType = objectType({
  name: "BfClip",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.connectionField("clipReviews", {
      type: BfGraphQLClipReviewType,
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        // const reviews = await BfClipReview
        return connectionFromArray([], args);
      }
    });
  },
})

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
      })
      return newClip.toGraphql();
    }
    if (clip) {
      await clip.createNewClipReview();
      return clip.toGraphql();
    }
    
  }
})