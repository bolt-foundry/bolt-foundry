import {
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

export const BfGraphQLSearchResult = objectType({
  name: "BfSearchResult",
  description: "Search results",
  definition: (t) => {
    t.implements(BfNodeGraphQLType)
    t.connectionField("results", {
      type: BfSearchResultItemType,
      resolve: async (parent, args, { bfCurrentViewer }: GraphQLContext) => {
        return []
      }
    });
    t.field("creator", {
      type: BfGraphQLPerson,
    })
  },
});

export const BfGraphQLSearch = mutationField("createSearch", {
  type: BfGraphQLSearchResult,
  args: {
    query: nonNull(stringArg()),
  },
  resolve: async (parent, { query }, { bfCurrentViewer }: GraphQLContext) => {
    const currentOrg = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
    const searchResult = await currentOrg.createTargetNode(BfSearchResult, {query});
    return searchResult.toGraphql();
  },
});
