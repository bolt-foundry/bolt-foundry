import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import {
  idArg,
  interfaceType,
  nonNull,
  queryField,
} from "packages/graphql/deps.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const BfNodeGraphQLType = interfaceType({
  name: "BfNode",
  definition(t) {
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

    // @ts-expect-error using BfModel.findX should only be used here ever, probably.
    const model = await BfModel.findX(bfCurrentViewer, id, undefined, true);
    if (!model) {
      return null;
    }
    logger.debug(model);
    return model.toGraphql();
  },
});
