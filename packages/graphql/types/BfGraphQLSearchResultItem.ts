import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfSearchResultItem } from "packages/bfDb/models/BfSearchResultItem.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
const ExcerptItemType = objectType({
  name: "ExcerptItem",
  definition: (t) => {
    t.string("titleText");
    t.string("text");
    t.string("descriptionText");
    t.string("topics");
    t.string("rationale");
    t.float("confidence");
  }
})

export const BfSearchResultItemType = objectType({
  name: "BfSearchResultItem",
  description: "A search result item.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.list.field('excerpts', {
      type: ExcerptItemType,
      resolve: async (source, args, { bfCurrentViewer }) => {
        const searchResultItem = await BfSearchResultItem.findX(
          bfCurrentViewer,
          source.id,
        );
        logger.setLevel(logger.levels.DEBUG);
        logger.debug("searchResultItem", searchResultItem.props)
        return searchResultItem.props.excerpts;
      }
    });
  },
})