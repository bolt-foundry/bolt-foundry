import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface InputSamplesTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputSamplesTab({ value, onChange }: InputSamplesTabProps) {
  return (
    <WorkflowTextArea
      label="Input Samples"
      description="Define the input samples for your grader evaluation. Each line should be a JSON object."
      value={value}
      onChange={onChange}
      placeholder={`{"input": "What is the capital of France?"}\n{"input": "Explain photosynthesis in simple terms"}`}
    />
  );
}
