import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const BfSearchResultItemType = objectType({
  name: "BfSearchResultItem",
  description: "A search result item.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
  },
});
