import * as React from "react";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Question } from "packages/client/components/triviataxi/Question.tsx";
import { Answers } from "packages/client/components/triviataxi/Answers.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { useState } from "react";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
const { Suspense } = React;
import { TriviaTaxiCreateTTGameMutation } from "packages/__generated__/TriviaTaxiCreateTTGameMutation.graphql.ts";
const createGameMutation = await graphql`
  mutation TriviaTaxiCreateTTGameMutation($shouldCreate: Boolean!) {
    createTTGame(shouldCreate: $shouldCreate) {
      id
    }
  }
`;

const query = await graphql`
  query TriviaTaxiQuery($gameID: ID!, $gameExists: Boolean!) {
    node(id: $gameID) @include(if: $gameExists) {
      ... on BfTTGame {
        id
        correctResponses
        incorrectResponses
        questions(first: 75) {
          edges {
            node {
              id
              type
              difficulty
              category
              question
              correct_answer
              incorrect_answers
            }
          }
        }
      }
    }
  }
`;

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export function TriviaTaxi() {
  const { navigate, routeParams } = useRouter();
  const gameId = routeParams.gameId ?? "";
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [gameOver, setGameOver] = useState(false);
  const [commit, isInFlight] = useMutation<TriviaTaxiCreateTTGameMutation>(
    createGameMutation,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const data = useLazyLoadQuery<TriviaTaxiQuery>(query, {
    gameID: gameId,
    gameExists: Boolean(gameId),
  });
  const questions = data?.node?.questions?.edges ?? [];
  const filteredQuestions = questions.filter((q) =>
    q.node.difficulty === difficulty
  );

  function onSubmit() {
    commit({
      variables: {
        shouldCreate: true,
      },
      optimisticResponse: {
        createTTGame: {
          id: "",
        },
      },
      onCompleted: (data) => {
        const { id } = data.createTTGame ?? {};
        navigate(`/trivia-taxi/${id}`);
      },
    });
  }

  const handleNextQuestion = () => {
    if (currentQuestion >= (filteredQuestions?.length - 1)) {
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSetDifficulty = (newDifficulty: Difficulty) => {
    if (newDifficulty === difficulty) return;
    setCurrentQuestion(0);
    setDifficulty(newDifficulty);
  };

  return (
    <div className="trivia-page-wrapper">
      {(currentQuestion === -1) && (
        <>
          <div className="game-over-modal">
            Welcome to Taxi Trivia!
            <BfDsButton
              kind="primary"
              size="xlarge"
              text="Start"
              onClick={() => {
                setCurrentQuestion(currentQuestion + 1);
                if (!gameId || filteredQuestions.length === currentQuestion) {
                  onSubmit();
                }
              }}
            />
          </div>
        </>
      )}
      {gameOver && (
        <>
          <div className="game-over-modal">
            {`That's all of the ${difficulty} questions!`}
            <BfDsButton
              kind="primary"
              size="xlarge"
              text="Start"
              onClick={() => {
                setCurrentQuestion(-1);
                setGameOver(false);
              }}
            />
          </div>
        </>
      )}
      {gameId && (
        <Suspense fallback={<BfDsFullPageSpinner />}>
          <div className="main-content-container">
            <div className="difficulty-container">
              <BfDsButton
                kind={difficulty === Difficulty.EASY ? "primary" : "outline"}
                size="large"
                text="Easy"
                onClick={() => handleSetDifficulty(Difficulty.EASY)}
              />
              <BfDsButton
                kind={difficulty === Difficulty.MEDIUM ? "primary" : "outline"}
                size="large"
                text="Medium"
                onClick={() => handleSetDifficulty(Difficulty.MEDIUM)}
              />
              <BfDsButton
                kind={difficulty === Difficulty.HARD ? "primary" : "outline"}
                size="large"
                text="Hard"
                onClick={() => handleSetDifficulty(Difficulty.HARD)}
              />
            </div>
            <Question
              text={filteredQuestions[currentQuestion]?.node.question}
            />
          </div>
          <Answers
            incorrectAnswers={filteredQuestions[currentQuestion]?.node
              .incorrect_answers}
            correctAnswer={filteredQuestions[currentQuestion]?.node
              .correct_answer}
          />
          <div
            className="flexRow"
            style={{ width: "80%", justifyContent: "space-between" }}
          >
            <BfDsButton
              kind="primary"
              size="xlarge"
              text="Next question"
              onClick={() => handleNextQuestion()}
            />
            <BfDsButton
              kind="primary"
              size="xlarge"
              text="Previous question"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
