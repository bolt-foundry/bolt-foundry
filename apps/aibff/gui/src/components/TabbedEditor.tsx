import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { getLogger } from "@bolt-foundry/logger";
import { useDebounced } from "../hooks/useDebounced.ts";

const logger = getLogger(import.meta);

type TabType =
  | "inputSamples"
  | "actor"
  | "grader"
  | "groundTruth"
  | "notes"
  | "debug";

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
  const [actorContent, setActorContent] = useState("");
  const [graderContent, setGraderContent] = useState(initialGraderContent);
  const [groundTruthContent, setGroundTruthContent] = useState("");
  const [notesContent, setNotesContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update grader content when initialGraderContent changes
  useEffect(() => {
    setGraderContent(initialGraderContent);
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
          if (savedData.actorDeck) setActorContent(savedData.actorDeck);
          if (savedData.graderDeck) setGraderContent(savedData.graderDeck);
          if (savedData.groundTruth) {
            setGroundTruthContent(savedData.groundTruth);
          }
          if (savedData.notes) setNotesContent(savedData.notes);

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
    actorContent,
    graderContent,
    groundTruthContent,
    notesContent,
    activeTab,
  ]);

  const handleInputSamplesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newContent = e.target.value;
    setInputSamplesContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleActorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setActorContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleGraderChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setGraderContent(newContent);
    onGraderContentChange?.(newContent);
    markUnsavedAndAutoSave();
  };

  const handleGroundTruthChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newContent = e.target.value;
    setGroundTruthContent(newContent);
    markUnsavedAndAutoSave();
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNotesContent(newContent);
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
        actorDeck: actorContent,
        graderDeck: graderContent,
        groundTruth: groundTruthContent,
        notes: notesContent,
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
      case "actor":
        return actorContent;
      case "grader":
        return graderContent;
      case "groundTruth":
        return groundTruthContent;
      case "notes":
        return notesContent;
      default:
        return "";
    }
  };

  const getCurrentHandler = () => {
    switch (activeTab) {
      case "inputSamples":
        return handleInputSamplesChange;
      case "actor":
        return handleActorChange;
      case "grader":
        return handleGraderChange;
      case "groundTruth":
        return handleGroundTruthChange;
      case "notes":
        return handleNotesChange;
      default:
        return handleInputSamplesChange;
    }
  };

  const getCurrentPlaceholder = () => {
    switch (activeTab) {
      case "inputSamples":
        return "Your input samples will appear here...";
      case "actor":
        return "Your actor definition will appear here as we build it together...";
      case "grader":
        return "Your grader definition will appear here as we build it together...";
      case "groundTruth":
        return "Your ground truth data will appear here...";
      case "notes":
        return "Your notes and observations will appear here...";
      default:
        return "";
    }
  };

  const getCurrentLabel = () => {
    switch (activeTab) {
      case "inputSamples":
        return "Input Samples";
      case "actor":
        return "Actor";
      case "grader":
        return "Grader";
      case "groundTruth":
        return "Ground Truth";
      case "notes":
        return "Notes";
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
            onClick={() => setActiveTab("actor")}
            aria-selected={activeTab === "actor"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "actor"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "actor" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Actor Deck
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grader")}
            aria-selected={activeTab === "grader"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "grader"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "grader" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Grader Deck
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("groundTruth")}
            aria-selected={activeTab === "groundTruth"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "groundTruth"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "groundTruth" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Ground Truth
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            aria-selected={activeTab === "notes"}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeTab === "notes"
                ? "#2a2b2c"
                : "transparent",
              color: activeTab === "notes" ? "#fafaff" : "#b8b8c0",
              border: "1px solid #3a3b3c",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            Notes
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
          {activeTab === "inputSamples" || activeTab === "groundTruth" ||
              activeTab === "notes"
            ? "Data"
            : "Deck"} {activeTab === "inputSamples" ? "(JSONL)" : "(Markdown)"}
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
              case "actor":
                return "This actor defines the behavior and personality for the AI assistant.";
              case "grader":
                return "This grader uses the gradient scale: +3 (correct) to -3 (incorrect), with 0 for invalid input.";
              case "groundTruth":
                return "Expected correct outputs for comparison and evaluation.";
              case "notes":
                return "Notes shared with the assistant but not used in calibration or evaluation.";
              default:
                return "";
            }
          })()}
        </div>
      </div>
    </div>
  );
}
