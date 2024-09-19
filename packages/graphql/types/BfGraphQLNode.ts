import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import {
  idArg,
  interfaceType,
  nonNull,
  queryField,
  subscriptionField,
} from "packages/graphql/deps.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const NodeGraphQLType = interfaceType({
  name: "Node",
  definition(t) {
    t.nonNull.id("id", {
      description: "Unique identifier for the resource",
      resolve: (obj) => obj.id ?? obj.bfGid ?? obj.metadata?.bfGid,
    });
  },
});
export const BfNodeGraphQLType = interfaceType({
  name: "BfNode",
  definition(t) {
    t.implements(NodeGraphQLType);
    t.nonNull.id("id", {
      description: "Unique identifier for the resource",
      resolve: (obj) => obj.id ?? obj.bfGid ?? obj.metadata?.bfGid,
    });
  },
});

export const BfNodeGraphQLQueryType = queryField("node", {
  type: BfNodeGraphQLType,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (_, { id }, { bfCurrentViewer }) => {
    logger.debug(id);

    const model = await BfNode.findX(bfCurrentViewer, toBfGid(id));

    logger.debug(model);
    return model.toGraphql();
  },
});

export const BfNodeGraphQLSubscriptionType = subscriptionField("node", {
  type: BfNodeGraphQLType,
  args: {
    id: idArg(),
  },
  subscribe: async function (_, { id }, { bfCurrentViewer }) {
    logger.setLevel(logger.levels.DEBUG);
    if (!id) {
      return Promise.reject();
    }
    logger.debug(`Subscribing to node ${id}`);
    const node = await BfNode.findX(bfCurrentViewer, toBfGid(id));
    return node.getSubscriptionForGraphql();
  },
  resolve: async function (_, { id }, { bfCurrentViewer }) {
    logger.debug(`Resolving ${id} for ${bfCurrentViewer}`);
    const node = await BfNode.find(bfCurrentViewer, toBfGid(id));
    return node?.toGraphql();
  },
});
