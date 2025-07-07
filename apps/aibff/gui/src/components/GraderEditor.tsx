import { useEffect, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsCallout } from "@bfmono/apps/bfDs/components/BfDsCallout.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

interface GraderEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
}

export function GraderEditor(
  { initialContent = "", onSave }: GraderEditorProps,
) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

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
          <BfDsCallout 
            variant={getStatusVariant()} 
            message={getStatusMessage()}
          />
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

      {/* Simplified static content display */}
      <div className="grader-editor-content">
        <div className="grader-editor-static">
          <h3>Grader Deck (Static)</h3>
          <p>This grader uses the gradient scale: +3 (correct) to -3 (incorrect), with 0 for invalid input.</p>
          <div 
            style={{ 
              border: "1px solid #ccc", 
              padding: "1rem", 
              backgroundColor: "#f5f5f5",
              minHeight: "200px",
              fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace"
            }}
          >
            {content || "Your grader definition will appear here as we build it together..."}
          </div>
        </div>
      </div>
    </div>
  );
}
