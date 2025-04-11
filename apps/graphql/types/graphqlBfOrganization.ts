import { mutationField, nonNull, objectType, stringArg } from "nexus";
import { graphqlBfNode } from "apps/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const graphqlBfOrganizationType = objectType({
  name: "BfOrganization",
  definition(t) {
    t.implements(graphqlBfNode);
  },
});
