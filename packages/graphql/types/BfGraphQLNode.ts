import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import {
  idArg,
  interfaceType,
  nonNull,
  objectType,
  queryField,
  stringArg,
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

export const BfConnectionEdgeType = objectType({
  name: "BfConnectionEdge",
  definition(t) {
    t.field("node", {
      type: BfNodeGraphQLType,
    });
    t.string("cursor");
  },
});

export const BfConnectionSubscriptionPayloadType = objectType({
  name: "BfConnectionSubscriptionPayload",
  definition(t) {
    t.field("append", { type: BfConnectionEdgeType });
    // t.field("prepend", { type: BfConnectionEdgeType });
    t.field("delete", { type: BfConnectionEdgeType });
    // TODO: Move would be so sick.
    // t.field("move", { type: BfConnectionEdgeType });
  },
});

export const BfConnectionCreateEdgeSubscriptionType = subscriptionField(
  "connection",
  {
    type: BfConnectionSubscriptionPayloadType,
    args: {
      id: idArg(),
      targetClassName: stringArg(),
    },
    subscribe: async function (
      _,
      { id, targetClassName },
      { bfCurrentViewer },
    ) {
      if (!id || !targetClassName) {
        return Promise.reject();
      }
      logger.debug(`Subscribing to node ${id}`);
      const node = await BfNode.findX(bfCurrentViewer, toBfGid(id));
      return node.getConnectionSubscriptionForGraphql(targetClassName);
    },
    resolve: async function (
      { operation, bfTid, cursor },
      _,
      { bfCurrentViewer },
    ) {
      const node = await BfNode.findX(bfCurrentViewer, bfTid);
      const edge = {
        node: node.toGraphql(),
        cursor,
      };
      switch (operation) {
        case "INSERT": {
          return {
            append: edge,
          };
        }
      }
    },
  },
);
