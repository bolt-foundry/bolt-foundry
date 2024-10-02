import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";

export const BfGraphQLFakeClipDataType = objectType({
  name: "BfFakeClipData",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("word");
    t.msTime("start");
    t.msTime("end");
    t.string("punctuated_word");
    t.string("speaker");
  },
});
