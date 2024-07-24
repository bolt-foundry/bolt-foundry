import { extendType, objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/mod.ts";
import { GraphQLContext } from "infra/graphql/graphql.ts";
import { BfClipReview } from "packages/bfDb/models/BfClipReview.ts";
import { toBfOid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export const BfGraphQLClipReviewType = objectType({
  name: "BfClipReview",
  description: "A review of a clip.",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.url("mediaUrl");
  },
});

export const BfGraphQLClipCurrentViewerConnection = extendType({
  type: "BfOrganization",
  definition: (t) => {
    t.connectionField("reviewableClips", {
      type: "BfClipReview",
      description: "Clips available.",
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        return await BfClipReview.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: toBfOid(parent.id) },
          {},
          args,
        );
      },
    });
  },
});
