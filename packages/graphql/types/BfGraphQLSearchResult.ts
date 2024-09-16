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

export const BfGraphQLSearchResult = objectType({
  name: "BfSearchResult",
  description: "Search results",
  definition: (t) => {
    t.implements(BfNodeGraphQLType)
    t.connectionField("results", {
      type: BfSearchResultItemType,
      resolve: async (parentSearchResult, args, { bfCurrentViewer }: GraphQLContext) => {
        return connectionFromArray([], args)
      }
    });
    t.field("creator", {
      type: BfGraphQLPerson,
    })
  },
});

export const BfGraphQLSearch = mutationField("createSearchResult", {
  type: BfGraphQLSearchResult,
  args: {
    query: nonNull(stringArg()),
  },
  resolve: async (parent, { query }, { bfCurrentViewer }: GraphQLContext) => {
    const currentViewerPerson = await BfPerson.findCurrentViewer(bfCurrentViewer);
    const searchResult = await currentViewerPerson.createTargetNode(BfSearchResult, {query});
    return searchResult.toGraphql();
  },
});
