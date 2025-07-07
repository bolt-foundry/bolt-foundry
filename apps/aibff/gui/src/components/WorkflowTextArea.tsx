import { BfDsTextArea } from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";

interface WorkflowTextAreaProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  height?: string;
}

export function WorkflowTextArea({
  label,
  description,
  value,
  onChange,
  placeholder,
  height = "300px",
}: WorkflowTextAreaProps) {
  return (
    <div className="workflow-textarea-container">
      <BfDsTextArea
        label={label}
        description={description}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={Math.floor(parseInt(height) / 20)} // Convert height to approximate rows
        resize="vertical"
        style={{
          fontFamily:
            "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
        }}
      />
    </div>
  );
}
