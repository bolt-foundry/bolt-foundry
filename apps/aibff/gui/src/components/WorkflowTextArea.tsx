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
    <div style={{ padding: "1rem" }}>
      <h3
        style={{ color: "#fafaff", marginBottom: "0.5rem", fontSize: "1rem" }}
      >
        {label}
      </h3>
      <p
        style={{
          color: "#b8b8c0",
          marginBottom: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.4",
        }}
      >
        {description}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height,
          backgroundColor: "#2a2b2c",
          border: "1px solid #3a3b3c",
          borderRadius: "0.25rem",
          color: "#fafaff",
          padding: "0.75rem",
          fontSize: "0.875rem",
          fontFamily:
            "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
          resize: "vertical",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#4a9eff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#3a3b3c";
        }}
      />
    </div>
  );
}
