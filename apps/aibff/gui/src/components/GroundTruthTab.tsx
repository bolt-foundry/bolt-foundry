import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface GroundTruthTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function GroundTruthTab({ value, onChange }: GroundTruthTabProps) {
  return (
    <WorkflowTextArea
      label="Ground Truth"
      description="Define expected outputs or reference standards for evaluation."
      value={value}
      onChange={onChange}
      placeholder={`[contexts.expectedOutput]\nassistantQuestion = "What is the expected output?"\ndefault = "A clear, accurate, and helpful response"`}
    />
  );
}
