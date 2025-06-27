import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

interface CodeBlockWithActionProps {
  content: string;
  language?: string;
  onAddToGrader?: () => void;
}

export function CodeBlockWithAction({
  content,
  language = "markdown",
  onAddToGrader,
}: CodeBlockWithActionProps) {
  return (
    <div
      style={{
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        borderRadius: "0.25rem",
        border: "1px solid #3a3b3c",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          backgroundColor: "#2a2b2c",
          borderBottom: "1px solid #3a3b3c",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: "#b8b8c0",
            fontFamily: "monospace",
          }}
        >
          {language}
        </span>
        {onAddToGrader && (
          <BfDsButton
            onClick={onAddToGrader}
            size="small"
            variant="secondary"
          >
            Add to Grader
          </BfDsButton>
        )}
      </div>
      <pre
        style={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "#1a1b1c",
          overflowX: "auto",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        <code>{content}</code>
      </pre>
    </div>
  );
}
