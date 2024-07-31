import {
  arg,
  booleanArg,
  connectionFromArray,
  extendType,
  idArg,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { callAPI, aiSettings } from "infra/aiPlayground/langchainAPI.ts";



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
  resolve: async (_root, { input, suggestedModel }, { bfCurrentViewer }: GraphQLContext) => {
    try {
      if (suggestedModel === undefined) {
        suggestedModel = undefined;
      }
      const message =  await callAPI(input, undefined, suggestedModel);
      return {
        success: true,
        message: message,
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