import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import {
  BfTranscript,
  BfTranscriptProps,
} from "packages/bfDb/models/BfTranscript.ts";

import { callAPI } from "packages/lib/langchain.ts";

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
    const rawDocuments = await BfTranscript.findTranscriptsByViewer(
      bfCurrentViewer,
    );
    const documents = rawDocuments.map((doc) => {
      const { filename, words } = doc.props as BfTranscriptProps;
      return { filename, words };
    });
    try {
      const message = await callAPI(
        input,
        documents,
        suggestedModel,
        undefined,
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
