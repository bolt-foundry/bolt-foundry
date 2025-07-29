import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface GraderDeckTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function GraderDeckTab({ value, onChange }: GraderDeckTabProps) {
  return (
    <WorkflowTextArea
      label="Grader Deck"
      description="Define the evaluation criteria and grading instructions."
      value={value}
      onChange={onChange}
      placeholder="# Grader Instructions\n\n## Evaluation Criteria\n- **Helpfulness**: Does the response address the question?\n- **Accuracy**: Is the information correct?\n- **Clarity**: Is the response easy to understand?\n\n## Grading Scale\n- +3: Excellent\n- +2: Good\n- +1: Adequate\n- 0: Neutral\n- -1: Poor\n- -2: Bad\n- -3: Harmful"
    />
  );
}
