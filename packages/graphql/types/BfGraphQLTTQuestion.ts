import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfTTQuestion } from "packages/bfDb/models/triviaTaxi/BfTTQuestion.ts";

export const BfGraphQLTTQuestionType = objectType({
  name: "BfTTQuestion",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("type");
    t.string("difficulty");
    t.string("category");
    t.string("question");
    t.string("correct_answer");
    t.list.string("incorrect_answers");
  },
});
