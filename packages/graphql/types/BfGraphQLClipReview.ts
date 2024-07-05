import {
  idArg,
  list,
  nonNull,
  objectType,
  queryField,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import { BfClipReviewCommentGraphQLType } from "./BfGraphQLClipReviewComment.ts";
import { BfClipReviewDecisionGraphQLType } from "./BfGraphQLClipReviewDecision.ts";

export const BfClipReviewGraphQLType = objectType({
  name: "BfClipReview",
  description: "A review for a clip",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("clipId");
    t.nonNull.id("oldClipId");
    t.nonNull.list.nonNull.field("comments", {
      type: BfClipReviewCommentGraphQLType,
      resolve: (review, _args, { bfCurrentViewer }: GraphQLContext) => {
        return review.getComments(bfCurrentViewer);
      },
    });
    t.nonNull.list.nonNull.field("decisions", {
      type: BfClipReviewDecisionGraphQLType,
      resolve: (review, _args, { bfCurrentViewer }: GraphQLContext) => {
        return review.getDecisions(bfCurrentViewer);
      },
    });
  },
});

export const reviewsByClipId = queryField("reviewsByClipId", {
  type: nonNull(list(nonNull(BfClipReviewGraphQLType))),
  args: {
    clipId: nonNull(idArg()),
  },
  resolve: async (
    _root,
    { clipId },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const reviews = await BfClipReview.findByClipId(bfCurrentViewer, clipId);
    return reviews.map((review) => review.toGraphql());
  },
});
