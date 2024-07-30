import {
  extendType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { GraphQLContext } from "infra/graphql/graphql.ts";
import { BfClipReviewComment } from "packages/bfDb/models/BfClipReviewComment.ts";
import { getLogger } from "deps.ts";
import { toBfOid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

const logger = getLogger(import.meta);

export const BfGraphQLClipReviewCommentType = objectType({
  name: "BFClipReviewComment",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("author");
    t.int("timecode");
    t.string("message");
  },
});

export const BfGraphQLClipReviewConnection = extendType({
  type: "BfClipReview",
  definition: (t) => {
    t.connectionField("comments", {
      type: "BFClipReviewComment",
      description: "Comments left on review.",
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        return await BfClipReviewComment.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: toBfOid(parent.id) },
          {},
          args,
        );
      },
    });
  },
});
