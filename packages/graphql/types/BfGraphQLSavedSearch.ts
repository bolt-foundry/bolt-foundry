import {
  enumType,
  idArg,
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
import { BfCollection } from "packages/bfDb/models/BfCollection.ts";

const logger = getLogger(import.meta);
export const SearchStatusEnum = enumType({
  name: "SearchStatus",
  members: SearchStatus,
});

export const BfGraphQLSavedSearchType = objectType({
  name: "BfSavedSearch",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("query");
    t.connectionField("searchResults", {
      type: BfGraphQLSavedSearchResultType,
      resolve: async ({ id }, args, { bfCurrentViewer }: GraphQLContext) => {
        logger.debug(`id`, id);
        const savedSearch = await BfSavedSearch.findX(bfCurrentViewer, id);
        const results = await savedSearch.queryTargetsConnectionForGraphQL(
          BfSavedSearchResult,
          args,
        );
        // logger.debug(results);
        return results;
      },
    });
  },
});
