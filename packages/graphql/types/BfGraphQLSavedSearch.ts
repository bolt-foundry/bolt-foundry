import {
  enumType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import {
  BfMediaNodeTranscript,
  type BfMediaNodeTranscriptProps,
} from "packages/bfDb/models/BfMediaNodeTranscript.ts";

import { callAPI } from "packages/lib/langchain.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import type { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import {
  BfSavedSearch,
  SearchStatus,
} from "packages/bfDb/models/BfSavedSearch.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";

export const SearchStatusEnum = enumType({
  name: "SearchStatus",
  members: SearchStatus,
});

export const bfSavedSearchType = objectType({
  name: "BfSavedSearch",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("query");
    t.field("status", {
      type: SearchStatusEnum,
    });
  },
});

export const searchMutation = mutationField("createSavedSearch", {
  type: "BfSavedSearchEdge",
  args: {
    query: nonNull(stringArg()),
  },
  resolve: async (
    _root,
    { query },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const org = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
    const search = await org.createTargetNode(BfSavedSearch, { query });
    return search.toGraphqlEdge();
    // const allMedia = await BfMedia.findMediaByViewer(bfCurrentViewer);
    // const transcripts = await Promise.all(
    //   allMedia.map(async (media) => {
    //     const mediaId = media.metadata.bfGid;
    //     // get the transcript
    //     const transcriptsOnMedia = await BfEdge.queryTargetInstances(
    //       bfCurrentViewer,
    //       BfMediaNodeTranscript as typeof BfNode,
    //       media.metadata.bfGid,
    //     );
    //     const transcript = transcriptsOnMedia[0]; // assuming there's only one transcript
    //     const transcriptId = transcript?.metadata.bfGid;

    //     const { filename, words } = (transcript?.props ??
    //       { filename: "no file", words: "[]" }) as BfMediaNodeTranscriptProps;
    //     return { mediaId, transcriptId, filename, words };
    //   }),
    // );

    // try {
    //   const message = await callAPI(
    //     input,
    //     transcripts,
    //     suggestedModel,
    //   );
    //   return {
    //     success: true,
    //     message,
    //   };
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: `Form submission failed. ${error}`,
    //   };
    // }
  },
});
