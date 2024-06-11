// #BOOTCAMPTASK create a local graphql deps file for infra
import { interfaceType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";

export const IBfGraphQLNodeType = interfaceType({
  name: "IBfGraphQLNode",
  definition(t) {
    t.implements(BfNodeGraphQLType);
  },
});
