import { useEffect, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm.tsx";
import { BfDsTextArea } from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";
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

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (newContent: string) => {
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

  const getStatusVariant = () => {
    switch (saveStatus) {
      case "saved": return "success";
      case "saving": return "warning";
      case "unsaved": return "error";
      default: return "info";
    }
  };

  const getStatusMessage = () => {
    switch (saveStatus) {
      case "saved": return "Saved";
      case "saving": return "Saving...";
      case "unsaved": return "Unsaved changes";
      default: return "";
    }
  };

  return (
    <div className="grader-editor-container">
      {/* Header */}
      <div className="grader-editor-header">
        <h2 className="grader-editor-title">Grader Definition</h2>
        <div className="grader-editor-controls">
          <BfDsCallout variant={getStatusVariant()} size="small">
            {getStatusMessage()}
          </BfDsCallout>
          <BfDsButton
            onClick={handleSave}
            variant="primary"
            size="small"
            disabled={saveStatus === "saving"}
          >
            Save Now
          </BfDsButton>
        </div>
      </div>

      {/* Editor Form */}
      <div className="grader-editor-content">
        <BfDsForm className="grader-editor-form">
          <BfDsTextArea
            label="Grader Deck (Markdown)"
            description="This grader uses the gradient scale: +3 (correct) to -3 (incorrect), with 0 for invalid input."
            value={content}
            onChange={handleChange}
            placeholder="Your grader definition will appear here as we build it together..."
            rows={10}
            resize="vertical"
            style={{ 
              fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
              minHeight: "200px"
            }}
          />
        </BfDsForm>
      </div>
    </div>
  );
}
