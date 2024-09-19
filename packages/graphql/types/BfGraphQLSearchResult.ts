import {
  connectionFromArray,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfSearchResult } from "packages/bfDb/models/BfSearchResult.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfGraphQLPerson } from "packages/graphql/types/BfGraphQLPerson.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfSearchResultItemType } from "packages/graphql/types/BfGraphQLSearchResultItem.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { getLogger } from "deps.ts";
import { BfSearchResultItem } from "packages/bfDb/models/BfSearchResultItem.ts";

const logger = getLogger(import.meta);

export const BfGraphQLSearchResult = objectType({
  name: "BfSearchResult",
  description: "Search results",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.int("collectionLength", {
      resolve: async (source, args, { bfCurrentViewer }) => {
        const searchResult = await BfSearchResult.findX(
          bfCurrentViewer,
          source.id,
        );
        return await searchResult.getCollectionLength();
      },
    });
    t.string("status", { resolve: () => "COMPLETE" });
    t.string("query");
    t.connectionField("searchResultItems", {
      type: BfSearchResultItemType,
      resolve: async (
        source,
        args,
        { bfCurrentViewer }: GraphQLContext,
      ) => {
        const searchResult = await BfSearchResult.findX(
          bfCurrentViewer,
          source.id,
        );
        return await searchResult.queryTargetsConnectionForGraphQL(
          BfSearchResultItem,
          args,
        );
      },
    });
    t.field("creator", {
      type: BfGraphQLPerson,
    });
  },
});

export const BfGraphQLSearch = mutationField("createSearchResult", {
  type: BfGraphQLSearchResult,
  args: {
    query: nonNull(stringArg()),
  },
  resolve: async (parent, { query }, { bfCurrentViewer }: GraphQLContext) => {
    const currentViewerPerson = await BfPerson.findCurrentViewer(
      bfCurrentViewer,
    );
    const searchResult = await currentViewerPerson.createTargetNode(
      BfSearchResult,
      { query },
    );
    // await (new Promise((resolve) => setTimeout(resolve, 10000)))
    return searchResult.toGraphql();
  },
});
