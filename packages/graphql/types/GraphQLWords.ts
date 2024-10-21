import { list, objectType } from "packages/graphql/deps.ts";
import { GraphQLWordType } from "./GraphQLWord.ts";

export const GraphQLWordsType = objectType({
  name: "Words",
  definition: (t) => {
    t.list.field("wordsBeforeResult", {
      type: GraphQLWordType,
      async resolve({ id }, _, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getWordsForGraphql();
      },
    });
    t.list.field("wordsInResult", {
      type: GraphQLWordType,
      async resolve({ id }, _, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getWordsForGraphql();
      },
    });
    t.list.field("wordsAfterResult", {
      type: GraphQLWordType,
      async resolve({ id }, _, { bfCurrentViewer }) {
        const result = await BfSavedSearchResult.findX(bfCurrentViewer, id);
        return result.getWordsForGraphql();
      },
    });
  },
});
