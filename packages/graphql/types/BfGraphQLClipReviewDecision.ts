import {
  idArg,
  list,
  nonNull,
  objectType,
  queryField,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfClipReviewDecision } from "packages/bfDb/models/BfClipReviewDecision.ts";

export const BfClipReviewDecisionGraphQLType = objectType({
  name: "BfClipReviewDecision",
  description: "A decision on a clip review",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("reviewId");
    t.nonNull.string("decision");
  },
});

export const decisionsByReviewId = queryField("decisionsByReviewId", {
  type: nonNull(list(nonNull(BfClipReviewDecisionGraphQLType))),
  args: {
    reviewId: nonNull(idArg()),
  },
  resolve: async (
    _root,
    { reviewId },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const decisions = await BfClipReviewDecision.findByReviewId(
      bfCurrentViewer,
      reviewId,
    );
    return decisions.map((decision) => decision.toGraphql());
  },
});
