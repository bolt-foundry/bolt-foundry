import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

enum TriviaTaxiQuestionType {
  MULTIPLE = "multiple",
  TRUE_FALSE = "true_false",
}

enum TriviaTaxiQuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

type BfTTQuestionProps = {
  type: TriviaTaxiQuestionType;
  difficulty: TriviaTaxiQuestionDifficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export class BfTTQuestion extends BfNode<BfTTQuestionProps> {
  __typename = "BfTTQuestion" as const;
}
