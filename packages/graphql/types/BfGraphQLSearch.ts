import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { callAPI } from "infra/aiPlayground/langchainAPI.ts";

// Define the output type for the mutation response
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
    documents: stringArg(),
  },
  resolve: async (
    _root,
    { documents, input, suggestedModel },
    {}: GraphQLContext,
  ) => {
    try {
      const message = await callAPI(
        input,
        undefined,
        suggestedModel,
        documents,
      );
      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error("Form submission error:", error);
      return {
        success: false,
        message: "Form submission failed.",
      };
    }
  },
});
