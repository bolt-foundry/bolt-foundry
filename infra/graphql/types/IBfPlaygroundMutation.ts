import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { callAPI } from "infra/aiPlayground/langchainAPI.ts";

// Define the output type for the mutation response
const playgroundMutationPayload = objectType({
  name: "PlaygroundMutationPayload",
  definition(t) {
    t.nonNull.boolean("success");
    t.string("message");
  },
});

export const playgroundMutation = mutationField("playgroundMutation", {
  type: playgroundMutationPayload,
  args: {
    input: nonNull(stringArg()),
    suggestedModel: stringArg(),
  },
  resolve: async (
    _root,
    { input, suggestedModel },
  ) => {
    try {
      const message = await callAPI(input, undefined, suggestedModel);
      return {
        success: true,
        message: message,
      };
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Form submission error:", error);
      return {
        success: false,
        message: "Form submission failed.",
      };
    }
  },
});
