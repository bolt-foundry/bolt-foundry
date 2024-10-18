import { useEffect, useState } from "react";

type AnswerProps = {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
};

type AnswersProps = {
  incorrectAnswers: string[];
  correctAnswer: string;
};

function Answer({ text, onClick, isSelected, isCorrect }: AnswerProps) {
  const backgroundColor = isSelected
    ? (isCorrect ? "var(--success)" : "var(--alert)")
    : "initial";
  const color = isSelected ? "white" : "black";
  return (
    <div
      className="answer-container"
      onClick={onClick}
      style={{ backgroundColor, color }}
    >
      {text}
    </div>
  );
}

export function Answers({ incorrectAnswers, correctAnswer }: AnswersProps) {
  if (!incorrectAnswers) {
    return null;
  }
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [randomizedAnswers, setRandomizedAnswers] = useState([]);

  useEffect(() => {
    const answers = [...incorrectAnswers, correctAnswer].sort(() =>
      Math.random() - 0.5
    );
    setRandomizedAnswers(answers);
  }, [incorrectAnswers, correctAnswer]);

  useEffect(() => {
    if (selectedAnswer && selectedAnswer !== correctAnswer) {
      setTimeout(() => {
        setSelectedAnswer(correctAnswer);
      }, 1500);
    }
  }, [selectedAnswer]);

  return (
    <div className="answers-container">
      {randomizedAnswers.map((a, index) => (
        <Answer
          key={index}
          text={a}
          isSelected={selectedAnswer === a}
          isCorrect={a === correctAnswer}
          onClick={() => {
            setSelectedAnswer(a);
          }}
        />
      ))}
    </div>
  );
}
