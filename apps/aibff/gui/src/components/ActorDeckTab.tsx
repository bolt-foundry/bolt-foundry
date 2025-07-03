import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface ActorDeckTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function ActorDeckTab({ value, onChange }: ActorDeckTabProps) {
  return (
    <WorkflowTextArea
      label="Actor Deck"
      description="Define the behavior and instructions for the actor (the AI system being evaluated)."
      value={value}
      onChange={onChange}
      placeholder="# Actor Instructions\n\nYou are a helpful assistant that answers questions clearly and accurately..."
    />
  );
}
