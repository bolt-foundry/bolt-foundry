import { objectType } from "nexus";
import { getLogger } from "packages/logger/logger.ts";
import { graphqlBfNode } from "apps/bfDb/graphql/types/graphqlBfNode.ts";

const _logger = getLogger(import.meta);

export const graphqlBfPerson = objectType({
  name: "BfPerson",
  definition(t) {
    t.implements(graphqlBfNode);
    t.string("name");
  },
});
