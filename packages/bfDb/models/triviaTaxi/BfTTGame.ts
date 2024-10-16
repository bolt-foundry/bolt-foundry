import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import {
  BfTTQuestion,
  type BfTTQuestionProps,
} from "packages/bfDb/models/triviaTaxi/BfTTQuestion.ts";

type BfTTGameProps = {
  correctResponses: int;
  incorrectResponses: int;
};

const OPEN_TRIVIA_DB_REQUEST_URL =
  "https://opentdb.com/api.php?amount=50&type=multiple";

export class BfTTGame extends BfNode<BfTTGameProps> {
  __typename = "BfTTGame" as const;
  async genQuestions() {
    const response = await fetch(OPEN_TRIVIA_DB_REQUEST_URL);
    const questions = await response.json();
    const questionCreationPromises = questions.results.map(
      async (question) => {
        const questionProps: BfTTQuestionProps = {
          type: question.type,
          difficulty: question.difficulty,
          category: question.category,
          question: question.question,
          correct_answer: question.correct_answer,
          incorrect_answers: question.incorrect_answers,
        };
        const ttQuestion = await this.createQuestion(questionProps);
        await BfEdge.createBetweenNodes(
          this.currentViewer,
          this,
          ttQuestion,
        );
      },
    );
    return Promise.all(questionCreationPromises);
  }

  private async createQuestion(questionProps: BfTTQuestionProps) {
    const question = await this.createTargetNode(BfTTQuestion, questionProps);
    return question;
  }

  async updateScore(respondedCorrectly: boolean) {
    respondedCorrectly ? this.correctResponses++ : this.incorrectResponses++;
    await this.save();
    return this;
  }
}
