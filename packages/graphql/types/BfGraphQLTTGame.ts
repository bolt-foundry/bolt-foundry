import {
  booleanArg,
  mutationField,
  nonNull,
  objectType,
} from "packages/graphql/deps.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfGraphQLTTQuestionType } from "packages/graphql/types/BfGraphQLTTQuestion.ts";
import { BfTTGame } from "packages/bfDb/models/triviaTaxi/BfTTGame.ts";
import { BfTTQuestion } from "packages/bfDb/models/triviaTaxi/BfTTQuestion.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const BfGraphQLTTGameType = objectType({
  name: "BfTTGame",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.int("correctResponses");
    t.int("incorrectResponses");
    t.connectionField("questions", {
      type: BfGraphQLTTQuestionType,
      resolve: async ({ id }, args, { bfCurrentViewer }: GraphQLContext) => {
        logger.debug(`id`, id);
        const game = await BfTTGame.findX(bfCurrentViewer, id);
        const results = await game.queryTargetsConnectionForGraphQL(
          BfTTQuestion,
          args,
        );
        logger.debug(results);
        console.log(results);
        return results;
      },
    });
  },
});

export const createTTGameMutation = mutationField("createTTGame", {
  type: BfGraphQLTTGameType,
  args: { shouldCreate: booleanArg() },
  async resolve(_, _args, { bfCurrentViewer }) {
    const org = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
    const game = await org.createTargetNode(BfTTGame, {
      correctResponses: 0,
      incorrectResponses: 0,
    });
    console.log("game stuff", game);
    await game.genQuestions();
    return game.toGraphql();
  },
});

export const updateScoreMutation = mutationField("updateTTGameScore", {
  type: BfGraphQLTTGameType,
  args: {
    respondedCorrectly: nonNull(booleanArg()),
  },
  async resolve({ id }, { respondedCorrectly }, { bfCurrentViewer }) {
    const game = await BfTTGame.findX(bfCurrentViewer, id);
    await game.updateScore(correctResponses, incorrectResponses);
    return game.toGraphql();
  },
});
