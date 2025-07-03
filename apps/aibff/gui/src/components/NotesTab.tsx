import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface NotesTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesTab({ value, onChange }: NotesTabProps) {
  return (
    <WorkflowTextArea
      label="Notes"
      description="Additional notes, observations, and documentation."
      value={value}
      onChange={onChange}
      placeholder="# Project Notes\n\n## Objectives\n- [ ] Define clear evaluation criteria\n- [ ] Create representative input samples\n- [ ] Establish baseline performance\n\n## Observations\n- Add your observations here..."
    />
  );
}
