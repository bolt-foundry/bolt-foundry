import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsCallout } from "@bfmono/apps/bfDs/components/BfDsCallout.tsx";
import { getLogger } from "@bolt-foundry/logger";
import { useDebounced } from "../hooks/useDebounced.ts";

const logger = getLogger(import.meta);

interface GraderEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
}

export function GraderEditor(
  { initialContent = "", onContentChange, onSave }: GraderEditorProps,
) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange?.(newContent);
    setSaveStatus("unsaved");
    debouncedSave();
  };

  const handleSave = async () => {
    if (onSave) {
      setSaveStatus("saving");
      try {
        await onSave();
        setSaveStatus("saved");
        logger.debug("Saving grader:", content);
      } catch (error) {
        setSaveStatus("unsaved");
        logger.error("Failed to save grader:", error);
      }
    }
  };

  // Create debounced save function (auto-saves after 2 seconds of inactivity)
  const debouncedSave = useDebounced(handleSave, 2000);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid #3a3b3c",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fafaff" }}>
          Grader Definition
        </h2>
        <BfDsButton
          onClick={handleSave}
          variant="primary"
          size="small"
          disabled={saveStatus === "saving"}
        >
          Save Now
        </BfDsButton>
      </div>

      {/* Save status callout */}
      <BfDsCallout
        variant={saveStatus === "saved"
          ? "success"
          : saveStatus === "saving"
          ? "info"
          : "warning"}
        visible={saveStatus !== "saved"}
        autoDismiss={saveStatus === "saved" ? 3000 : 0}
      >
        {saveStatus === "saving" ? "Saving..." : "Unsaved changes"}
      </BfDsCallout>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          overflow: "auto",
        }}
      >
        <label
          style={{
            fontSize: "0.875rem",
            color: "#b8b8c0",
            fontWeight: 500,
          }}
        >
          Grader Deck (Markdown)
        </label>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="Your grader definition will appear here as we build it together..."
          style={{
            flex: 1,
            width: "100%",
            minHeight: "200px",
            padding: "1rem",
            border: "1px solid #3a3b3c",
            borderRadius: "0.25rem",
            backgroundColor: "#1a1b1c",
            color: "#fafaff",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            resize: "vertical",
            outline: "none",
          }}
        />

        {/* Help text */}
        <div
          style={{
            fontSize: "0.75rem",
            color: "#b8b8c0",
            marginTop: "0.5rem",
          }}
        >
          This grader uses the gradient scale: +3 (correct) to -3 (incorrect),
          with 0 for invalid input.
        </div>
      </div>
    </div>
  );
}
