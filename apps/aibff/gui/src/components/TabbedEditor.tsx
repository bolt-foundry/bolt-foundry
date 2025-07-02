import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { getLogger } from "@bolt-foundry/logger";
import { useDebounced } from "../hooks/useDebounced.ts";

const logger = getLogger(import.meta);

type TabType =
  | "inputSamples"
  | "runPrompt"
  | "outputSamples"
  | "calibrate"
  | "fix"
  | "edit";

interface TabbedEditorProps {
  initialGraderContent?: string;
  onGraderContentChange?: (content: string) => void;
  conversationId?: string;
}

export function TabbedEditor(
  { initialGraderContent = "", onGraderContentChange, conversationId }:
    TabbedEditorProps,
) {
  const [activeTab, setActiveTab] = useState<TabType>("inputSamples");
  const [inputSamplesContent, setInputSamplesContent] = useState("");
  const [runPromptContent, setRunPromptContent] = useState("");
  const [outputSamplesContent, setOutputSamplesContent] = useState("");
  const [calibrateContent, setCalibrateContent] = useState("");
  const [fixContent, setFixContent] = useState("");
  const [editContent, setEditContent] = useState(initialGraderContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update edit content when initialGraderContent changes
  useEffect(() => {
    setEditContent(initialGraderContent);
  }, [initialGraderContent]);

  // Load saved tab contents when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    const loadSavedContent = async () => {
      try {
        const response = await fetch(
          `/api/conversations/${conversationId}/load`,
        );

        if (response.ok) {
          const savedData = await response.json();

          // Only update if we have saved content (don't overwrite with empty strings if no saved files)
          if (savedData.inputSamples) {
            setInputSamplesContent(savedData.inputSamples);
          }
          if (savedData.runPrompt) setRunPromptContent(savedData.runPrompt);
          if (savedData.outputSamples) setOutputSamplesContent(savedData.outputSamples);
          if (savedData.calibrate) setCalibrateContent(savedData.calibrate);
          if (savedData.fix) setFixContent(savedData.fix);
          if (savedData.edit) setEditContent(savedData.edit);

          logger.debug(
            "Loaded saved tab contents for conversation:",
            conversationId,
          );
        } else if (response.status === 404) {
          // No saved files yet, that's fine
          logger.debug(
            "No saved tab contents found for conversation:",
            conversationId,
          );
        } else {
          logger.error(
            "Failed to load saved tab contents:",
            await response.text(),
          );
        }
      } catch (error) {
        logger.error("Error loading saved tab contents:", error);
      }
    };

    loadSavedContent();
  }, [conversationId]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [
    inputSamplesContent,
    runPromptContent,
    outputSamplesContent,
    calibrateContent,
    fixContent,
    editContent,
    activeTab,
  ]);

  const handleInputSamplesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newContent = e.target.value;
    setInputSamplesContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleRunPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setRunPromptContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleOutputSamplesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setOutputSamplesContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleCalibrateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCalibrateContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleFixChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFixContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditContent(newContent);
    onGraderContentChange?.(newContent);
    markUnsavedAndAutoSave();
  };

  const handleSave = async () => {
    if (!conversationId) {
      logger.error("No conversation ID available for saving");
      return;
    }

    try {
      setSaveStatus("saving");
      logger.debug("Saving conversation:", conversationId);

      const saveData = {
        inputSamples: inputSamplesContent,
        runPrompt: runPromptContent,
        outputSamples: outputSamplesContent,
        calibrate: calibrateContent,
        fix: fixContent,
        edit: editContent,
      };

      const response = await fetch(
        `/api/conversations/${conversationId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveData),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${errorText}`);
      }

      const result = await response.json();
      logger.info("Save successful:", result.message);
      setSaveStatus("saved");
    } catch (error) {
      logger.error("Failed to save conversation:", error);
      setSaveStatus("unsaved");
    }
  };

  // Create debounced save function (auto-saves after 2 seconds of inactivity)
  const debouncedSave = useDebounced(handleSave, 2000);

  // Mark as unsaved when content changes and trigger debounced save
  const markUnsavedAndAutoSave = () => {
    setSaveStatus("unsaved");
    debouncedSave();
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case "inputSamples":
        return inputSamplesContent;
      case "runPrompt":
        return runPromptContent;
      case "outputSamples":
        return outputSamplesContent;
      case "calibrate":
        return calibrateContent;
      case "fix":
        return fixContent;
      case "edit":
        return editContent;
      default:
        return "";
    }
  };

  const getCurrentHandler = () => {
    switch (activeTab) {
      case "inputSamples":
        return handleInputSamplesChange;
      case "runPrompt":
        return handleRunPromptChange;
      case "outputSamples":
        return handleOutputSamplesChange;
      case "calibrate":
        return handleCalibrateChange;
      case "fix":
        return handleFixChange;
      case "edit":
        return handleEditChange;
      default:
        return handleInputSamplesChange;
    }
  };

  const getCurrentPlaceholder = () => {
    switch (activeTab) {
      case "inputSamples":
        return "Your input samples will appear here...";
      case "runPrompt":
        return "The prompt used to run the actor will appear here...";
      case "outputSamples":
        return "Output samples from running the actor will appear here...";
      case "calibrate":
        return "Calibration data and results will appear here...";
      case "fix":
        return "Fixes and improvements will appear here...";
      case "edit":
        return "Your grader definition will appear here as we build it together...";
      default:
        return "";
    }
  };

  const getCurrentLabel = () => {
    switch (activeTab) {
      case "inputSamples":
        return "Input Samples";
      case "runPrompt":
        return "Run Prompt";
      case "outputSamples":
        return "Output Samples";
      case "calibrate":
        return "Calibrate";
      case "fix":
        return "Fix";
      case "edit":
        return "Edit";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      {/* Header with tabs */}
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
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("inputSamples")}
            aria-selected={activeTab === "inputSamples"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "inputSamples"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "inputSamples" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Input Samples
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("runPrompt")}
            aria-selected={activeTab === "runPrompt"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "runPrompt"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "runPrompt" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Run Prompt
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("outputSamples")}
            aria-selected={activeTab === "outputSamples"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "outputSamples"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "outputSamples" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Output Samples
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calibrate")}
            aria-selected={activeTab === "calibrate"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "calibrate"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "calibrate" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Calibrate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fix")}
            aria-selected={activeTab === "fix"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "fix"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "fix" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Fix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            aria-selected={activeTab === "edit"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "edit"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "edit" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Edit
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Save status indicator */}
          <div
            style={{
              fontSize: "0.75rem",
              color: saveStatus === "saved"
                ? "#4ade80"
                : saveStatus === "saving"
                ? "#fbbf24"
                : "#f87171",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: saveStatus === "saved"
                  ? "#4ade80"
                  : saveStatus === "saving"
                  ? "#fbbf24"
                  : "#f87171",
              }}
            />
            {saveStatus === "saved"
              ? "Saved"
              : saveStatus === "saving"
              ? "Saving..."
              : "Unsaved"}
          </div>
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
          {getCurrentLabel()}{" "}
          {activeTab === "inputSamples" || activeTab === "outputSamples"
            ? "Data (JSONL)"
            : activeTab === "runPrompt" || activeTab === "edit"
            ? "Content (Markdown)"
            : "Data"}
        </label>
        <textarea
          ref={textareaRef}
          value={getCurrentContent()}
          onChange={getCurrentHandler()}
          placeholder={getCurrentPlaceholder()}
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
          {(() => {
            switch (activeTab) {
              case "inputSamples":
                return "Input samples for testing and evaluation.";
              case "runPrompt":
                return "The prompt used to run the actor against input samples.";
              case "outputSamples":
                return "Output samples from running the actor - ready for fine-tuning.";
              case "calibrate":
                return "Calibration data and grading results for evaluation.";
              case "fix":
                return "Fixes and improvements based on calibration results.";
              case "edit":
                return "Edit the grader definition and evaluation criteria.";
              default:
                return "";
            }
          })()}
        </div>
      </div>
    </div>
  );
}
