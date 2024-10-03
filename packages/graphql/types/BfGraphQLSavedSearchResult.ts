import { intArg, objectType } from "nexus";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfGraphQLFakeClipDataType } from "packages/graphql/types/BfGraphQLFakeClipData.ts";
import {
  GraphQLVideoDownloadableType,
  GraphQLVideoPreviewableType,
} from "packages/graphql/types/GraphQLMedia.ts";
import { BfSavedSearchResult } from "packages/bfDb/models/BfSavedSearchResult.ts";
import { fakeWords } from "packages/client/components/clipsearch/fakeData/fakeWords.tsx";
export const BfGraphQLSavedSearchResultType = objectType({
  name: "BfSavedSearchResult",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.string("body");
    t.string("rationale");
    t.string("description");
    t.float("confidence");
    t.list.string("topics");
    t.boolean("verbatim");
    t.msTime("duration");
    t.msTime("startTime");
    t.msTime("endTime");
    t.field("previewable", {
      type: GraphQLVideoPreviewableType,
      async resolve({ id }, _, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getPreviewableForGraphql();
      },
    });
    t.field("downloadable", {
      type: GraphQLVideoDownloadableType,
      async resolve({ id }, _, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getDownloadableForGraphql();
      },
    });
    t.connectionField("words", {
      type: BfGraphQLFakeClipDataType,
      resolve: (_a, _b, _c) => {
        return {
          edges: fakeWords
        };
      },
    });
  },
});
