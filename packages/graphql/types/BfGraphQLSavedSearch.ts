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
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import {
  BfSavedSearch,
  SearchStatus,
} from "packages/bfDb/models/BfSavedSearch.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfGraphQLSavedSearchResultType } from "packages/graphql/types/BfGraphQLSavedSearchResult.ts";
import { BfSavedSearchResult } from "packages/bfDb/models/BfSavedSearchResult.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta)
export const SearchStatusEnum = enumType({
  name: "SearchStatus",
  members: SearchStatus,
});

export const bfSavedSearchType = objectType({
  name: "BfSavedSearch",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("query");
    t.connectionField("searchResults", {
      type: BfGraphQLSavedSearchResultType,
      resolve: async ({id}, args, {bfCurrentViewer}: GraphQLContext) => {
        logger.debug(`id`, id);
        const savedSearch = await BfSavedSearch.findX(bfCurrentViewer, id);
        const results = await savedSearch.queryTargetsConnectionForGraphQL(BfSavedSearchResult, args);
        // logger.debug(results);
        return results;
      }
    })
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
