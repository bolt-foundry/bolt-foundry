import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import {
  BfMediaTranscript,
  BfMediaTranscriptProps,
} from "packages/bfDb/models/BfMediaTranscript.ts";

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
    const rawDocuments = await BfMediaTranscript.findTranscriptsByViewer(
      bfCurrentViewer,
    );
    const documents = rawDocuments.map((doc) => {
      const { filename, words } = doc.props as BfMediaTranscriptProps;
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
