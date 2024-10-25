import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";

export const BfGraphQLMediaVideoType = objectType({
  name: "BfMediaNodeVideo",
  description: "A video.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("status");
    t.string("url");
  },
});
