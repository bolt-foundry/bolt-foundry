type QuestionProps = {
  text: string;
};

export function Question({ text }: QuestionProps) {
  return (
    <div className="question-container">
      {text}
    </div>
  );
}
