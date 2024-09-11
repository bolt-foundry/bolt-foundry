import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import {
  BfMediaNodeTranscript,
  type BfMediaNodeTranscriptProps,
} from "packages/bfDb/models/BfMediaNodeTranscript.ts";

import { callAPI } from "packages/lib/langchain.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import type { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";

const searchMutationPayload = objectType({
  name: "SearchMutationPayload",
  definition(t) {
    t.nonNull.boolean("success");
    t.string("message");
  },
});

export const searchMutation = mutationField("searchMutation", {
  type: searchMutationPayload,
  args: {
    input: nonNull(stringArg()),
    suggestedModel: stringArg(),
  },
  resolve: async (
    _root,
    { input, suggestedModel },
    { bfCurrentViewer }: GraphQLContext,
  ) => {

    const currentOrg = await BfOrganization.findX(bfCurrentViewer, bfCurrentViewer.organizationBfGid);
    const allMedia = await currentOrg.queryTargetInstances(BfMedia)
    
    const [transcripts] = await Promise.all(allMedia.map((media) => {
      return media.queryTargetInstances(BfMediaNodeTranscript)
    }))

    try {
      const message = await callAPI(
        input,
        transcripts,
        suggestedModel,
      );
      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        message: `Form submission failed. ${error}`,
      };
    }
  },
});
