import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import {
  BfTTQuestion,
  type BfTTQuestionProps,
} from "packages/bfDb/models/triviaTaxi/BfTTQuestion.ts";

type BfTTGameProps = {
  correctResponses: int;
  incorrectResponses: int;
};

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

const OPEN_TRIVIA_DB_REQUEST_URL =
  "https://opentdb.com/api.php?type=multiple&encode=url3986";

export class BfTTGame extends BfNode<BfTTGameProps> {
  __typename = "BfTTGame" as const;
  private async genQuestionsByDifficulty(
    difficulty: Difficulty = Difficulty.EASY,
    quantity: int = 40,
  ) {
    const response = await fetch(
      `${OPEN_TRIVIA_DB_REQUEST_URL}&difficulty=${difficulty}&amount=${quantity}`,
    );
    const questions = await response.json();
    const questionCreationPromises = questions.results.map(
      async (question) => {
        const questionProps: BfTTQuestionProps = {
          type: question.type,
          difficulty: question.difficulty,
          category: question.category,
          question: decodeURIComponent(question.question),
          correct_answer: decodeURIComponent(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map((a) =>
            decodeURIComponent(a)
          ),
        };
        await this.createQuestion(questionProps);
      },
    );
    return Promise.all(questionCreationPromises);
  }

  async genQuestions() {
    return Promise.all([
      await this.genQuestionsByDifficulty(Difficulty.EASY, 40),
      setTimeout(
        async () => await this.genQuestionsByDifficulty(Difficulty.MEDIUM, 30),
        6000,
      ),
      setTimeout(
        async () => await this.genQuestionsByDifficulty(Difficulty.HARD, 5),
        12000,
      ),
    ]);
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
