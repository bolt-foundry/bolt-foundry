import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";

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
  },
});
