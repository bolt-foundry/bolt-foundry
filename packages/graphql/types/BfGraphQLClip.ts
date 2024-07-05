import {
  arg,
  ConnectionArguments,
  connectionFromArraySlice,
  idArg,
  list,
  nonNull,
  objectType,
  queryField,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import {
  BfClipReviewConnection,
  BfClipReviewGraphQLType,
} from "./BfGraphQLClipReview.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";

export const BfClipGraphQLType = objectType({
  name: "BfClip",
  description: "A clip resource",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.nonNull.id("id");
    t.nonNull.string("title");
    t.nonNull.string("owner");
    t.nonNull.string("client");
    t.nonNull.id("oldClipId", {
      description: "The old clip identifier",
      resolve: (obj) => {
        return obj.oldClipId;
      },
    });
    t.connectionField("reviews", {
      type: "BfClipReview",
      resolve: async (
        clipObj: Record<string, string>,
        args: ConnectionArguments,
        { bfCurrentViewer }: GraphQLContext,
      ) => {
        const clip = BfClip.findFakeData(
          bfCurrentViewer,
          undefined,
          clipObj,
        );
        // check if clip is instance of BfClip
        if (!(clip instanceof BfClip)) {
          console.log("Clippp", clip);
          throw new Error("clip is not an instance of BfClip");
        }
        if (!clip) {
          console.log("Clippp not clip", clip);
          return null;
        }

        // console.log("clip id", clipObj);
        // const reviews = await BfClipReview.findByOldClipId(
        //   bfCurrentViewer,
        //   toBfGid(clipObj.oldClipId),
        // );
        // return reviews.map((review) => {
        //   const nodes = review.toGraphql();
        //   return {
        //     edges: {
        //       nodes,
        //     },
        //   };
        // });
        const reviewsConnection = await clip.getReviewsConnection(
          bfCurrentViewer,
          args,
        );
        console.log("Clippp success", clip, clipObj);
        return connectionFromArraySlice(reviewsConnection.edges, args, {
          sliceStart: 0,
          arrayLength: reviewsConnection.count,
        });
      },
    });
  },
});

export const clipsByOldClipIds = queryField("clipsByOldClipIds", {
  type: (list(BfClipGraphQLType)),
  args: {
    oldClipIds: (list(idArg())),
  },
  resolve: async (
    _root,
    { oldClipIds },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const clips = await BfClip.findByOldClipIds(bfCurrentViewer, oldClipIds);

    const returnClips = clips.map((clip) => {
      if (!(clip instanceof BfClip)) {
        throw new Error("Returned object is not an instance of BfClip");
      }

      return clip.toGraphql();
    });
    console.log("returnClips", returnClips);
    return returnClips;
  },
});
