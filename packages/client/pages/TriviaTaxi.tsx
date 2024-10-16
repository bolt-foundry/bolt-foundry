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
        questions(first: 10) {
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

export function TriviaTaxi() {
  const { navigate, routeParams } = useRouter();
  const gameId = routeParams.gameId ?? "";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [commit, isInFlight] = useMutation<TriviaTaxiCreateTTGameMutation>(
    createGameMutation,
  );
  const data = useLazyLoadQuery<TriviaTaxiQuery>(query, {
    gameID: gameId,
    gameExists: Boolean(gameId),
  });
  const questions = data?.node?.questions?.edges ?? [];
  console.log("questions", data);
  function onSubmit() {
    console.log("SUBMITTING BLARGH");

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
    if (currentQuestion >= (questions?.length - 1)) {
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleStartNewGame = () => {
    setTimeout(() => {
      setCurrentQuestion(0);
      setGameOver(false);
    }, 200);
  };

  return (
    <div className="trivia-page-wrapper">
      {(gameOver || !gameId) && (
        <>
          <div className="game-over-modal">
            Trivia Taxi
            <BfDsButton
              kind="primary"
              size="xlarge"
              text="Start New Game"
              onClick={() => onSubmit()}
            />
          </div>
        </>
      )}
      {gameId && (
        <Suspense fallback={<BfDsFullPageSpinner />}>
          <Question text={questions[currentQuestion]?.node.question} />
          <Answers
            incorrectAnswers={questions[currentQuestion]?.node
              .incorrect_answers}
            correctAnswer={questions[currentQuestion]?.node.correct_answer}
          />
          <BfDsButton
            kind="primary"
            size="xlarge"
            text="Next question"
            onClick={() => handleNextQuestion()}
          />
        </Suspense>
      )}
    </div>
  );
}
