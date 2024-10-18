import { arg, idArg, mutationField, nonNull, objectType } from "nexus";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { GraphQLWordType } from "packages/graphql/types/GraphQLWord.ts";
import {
  GraphQLVideoDownloadableType,
  GraphQLVideoPreviewableType,
} from "packages/graphql/types/GraphQLMedia.ts";
import { BfSavedSearchResult } from "packages/bfDb/models/BfSavedSearchResult.ts";
import { TimecodeInMillisecondsScalarType } from "packages/graphql/types/Timecode.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import type { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
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
    t.float("percentageRendered");
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
    t.list.field("words", {
      type: GraphQLWordType,
      args: {
        startTime: arg({ type: TimecodeInMillisecondsScalarType }),
        endTime: arg({ type: TimecodeInMillisecondsScalarType }),
      },
      async resolve({ id }, { startTime, endTime }, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getWordsForGraphql(startTime, endTime);
      },
    });
  },
});

const downloadMutationType = objectType({
  name: "DownloadMutationType",
  definition(t) {
    t.id("id");
  },
});

export const BfGraphQLClipDownloadMutation = mutationField("downloadClip", {
  type: downloadMutationType,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (
    _,
    { id },
    { bfCurrentViewer },
  ) => {
    const searchResult = await BfSavedSearchResult.findX(
      bfCurrentViewer,
      id,
    );
    await BfJob.createJobForNode(searchResult, "downloadClip", [{ id }], true);
    return { id };
  },
});
