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
    ? (isCorrect ? "green" : "red")
    : "initial";
  return (
    <div
      className="answer-container"
      onClick={onClick}
      style={{ backgroundColor }}
    >
      {text}
    </div>
  );
}

export function Answers({ incorrectAnswers, correctAnswer }: AnswersProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [randomizedAnswers, setRandomizedAnswers] = useState([]);

  useEffect(() => {
    const answers = [...incorrectAnswers, correctAnswer].sort(() =>
      Math.random() - 0.5
    );
    setRandomizedAnswers(answers);
    setSelectedAnswer(null);
  }, [incorrectAnswers, correctAnswer]);

  return (
    <div className="answers-container">
      {randomizedAnswers.map((a, index) => (
        <Answer
          key={index}
          text={a}
          isSelected={selectedAnswer === a}
          isCorrect={a === correctAnswer}
          onClick={(e) => {
            e.preventDefault();
            setSelectedAnswer(a);
          }}
        />
      ))}
    </div>
  );
}
