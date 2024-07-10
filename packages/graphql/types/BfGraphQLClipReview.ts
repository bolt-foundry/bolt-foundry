import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/mod.ts";

export const BfGraphQLClipReviewType = objectType({
  name: "BfClipReview",
  description: "A review of a clip.",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.url("mediaUrl");
  }
})