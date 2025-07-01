import { useEffect, useState } from "react";
import { getLogger } from "@bolt-foundry/logger";
import { useGrader } from "../contexts/GraderContext.tsx";

const logger = getLogger(import.meta);

type MainTabType = "edit" | "RLHF" | "calibrate" | "update";

interface FileViewerProps {
  conversationId?: string;
}

// Default files that should be available
const defaultFiles = [
  "input-samples.jsonl",
  "actor-deck.md",
  "grader-deck.md",
  "grader-base.deck.md",
  "grader-base.deck.toml",
  "ground-truth.deck.toml",
  "notes.md",
];

export function FileViewer({ conversationId }: FileViewerProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("edit");
  const [selectedFile, setSelectedFile] = useState<string>("actor-deck.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [files, _setFiles] = useState<Array<string>>(defaultFiles);
  const { graderContent, updateGraderContent } = useGrader();

  // Initialize grader context with content from file system
  useEffect(() => {
    if (!conversationId || graderContent) return; // Don't reload if already has content

    const loadInitialGraderContent = async () => {
      try {
        const response = await fetch(
          `/api/conversations/${conversationId}/files/grader-deck.md`,
        );
        if (response.ok) {
          const data = await response.json();
          updateGraderContent(data.content || "");
          logger.debug("Initialized grader context from file");
        }
      } catch (error) {
        logger.debug("Could not load initial grader content:", error);
      }
    };

    loadInitialGraderContent();
  }, [conversationId, graderContent, updateGraderContent]);

  // Load file content when selectedFile changes
  useEffect(() => {
    if (!conversationId || !selectedFile) return;

    // Special handling for grader-deck.md - use context instead of API
    if (selectedFile === "grader-deck.md") {
      setFileContent(graderContent);
      logger.debug("Loaded grader-deck.md from context");
      return;
    }

    const loadFileContent = async () => {
      try {
        // Use the new files endpoint to load arbitrary files
        const response = await fetch(
          `/api/conversations/${conversationId}/files/${selectedFile}`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            setFileContent(
              `# ${selectedFile}\n\nFile not found in conversation directory`,
            );
          } else {
            throw new Error(`Failed to load: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setFileContent(data.content || "");
        logger.debug(`Loaded file: ${selectedFile}`);
      } catch (error) {
        logger.error(`Failed to load file ${selectedFile}:`, error);
        setFileContent(
          `# Error\n\nFailed to load ${selectedFile}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    };

    loadFileContent();
  }, [conversationId, selectedFile, graderContent]);

  const renderEditTab = () => (
    <div style={{ padding: "1rem", height: "100%" }}>
      {/* File List Table */}
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            color: "#fafaff",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          Files
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.75rem",
          }}
        >
          <tbody>
            {files.map((file) => (
              <tr
                key={file}
                onClick={() => setSelectedFile(file)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedFile === file
                    ? "#2a2b2c"
                    : "transparent",
                  borderBottom: "1px solid #3a3b3c",
                }}
              >
                <td
                  style={{
                    padding: "0.25rem 0.5rem",
                    color: selectedFile === file ? "#fafaff" : "#b8b8c0",
                    fontFamily: "monospace",
                  }}
                >
                  {file}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* File Editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h4
          style={{
            color: "#fafaff",
            marginBottom: "0.5rem",
            fontSize: "0.75rem",
            fontFamily: "monospace",
          }}
        >
          {selectedFile}
        </h4>
        <textarea
          value={fileContent}
          onChange={(e) => {
            const newContent = e.target.value;
            setFileContent(newContent);
            // Update grader context if editing grader-deck.md
            if (selectedFile === "grader-deck.md") {
              updateGraderContent(newContent);
            }
          }}
          style={{
            flex: 1,
            minHeight: "300px",
            padding: "0.75rem",
            backgroundColor: "#2a2b2c",
            color: "#fafaff",
            border: "1px solid #3a3b3c",
            borderRadius: "0.25rem",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            lineHeight: "1.4",
            resize: "none",
            outline: "none",
          }}
          placeholder={`Edit ${selectedFile}...`}
        />
      </div>
    </div>
  );

  const renderPlaceholderTab = (tabName: string) => (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#b8b8c0",
        fontSize: "0.875rem",
      }}
    >
      {tabName} tab - Coming soon
    </div>
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1f2021",
      }}
    >
      {/* Main Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        {(["edit", "RLHF", "calibrate", "update"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveMainTab(tab)}
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: activeMainTab === tab
                ? "#2a2b2c"
                : "transparent",
              color: activeMainTab === tab ? "#fafaff" : "#b8b8c0",
              border: "none",
              borderRight: "1px solid #3a3b3c",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeMainTab === "edit" && renderEditTab()}
        {activeMainTab === "RLHF" && renderPlaceholderTab("RLHF")}
        {activeMainTab === "calibrate" && renderPlaceholderTab("Calibrate")}
        {activeMainTab === "update" && renderPlaceholderTab("Update")}
      </div>
    </div>
  );
}
