import {
  idArg,
  list,
  nonNull,
  objectType,
  queryField,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfClipReviewComment } from "packages/bfDb/models/BfClipReviewComment.ts";

export const BfClipReviewCommentGraphQLType = objectType({
  name: "BfClipReviewComment",
  description: "A comment on a clip review",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("reviewId");
    t.nonNull.string("text");
    t.nonNull.int("timecode");
  },
});

export const commentsByReviewId = queryField("commentsByReviewId", {
  type: nonNull(list(nonNull(BfClipReviewCommentGraphQLType))),
  args: {
    reviewId: nonNull(idArg()),
  },
  resolve: async (
    _root,
    { reviewId },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const comments = await BfClipReviewComment.findByReviewId(
      bfCurrentViewer,
      reviewId,
    );
    console.log(comments);
    return comments.map((comment) => comment.toGraphql());
  },
});
