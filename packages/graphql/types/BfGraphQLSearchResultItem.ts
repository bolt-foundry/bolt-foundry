import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";

export const BfSearchResultItemType = objectType({
  name: "BfSearchResultItem",
  description: "A search result item.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("query");
    /**
     * What goes here???
     */
  },
})