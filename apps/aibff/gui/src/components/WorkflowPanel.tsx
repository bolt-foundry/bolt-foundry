import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";
import { TestConversation } from "./TestConversation.tsx";

interface WorkflowSection {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function WorkflowPanel() {
  const [expandedSection, setExpandedSection] = useState<string>(
    "system-prompt",
  );
  const [inputVariables, setInputVariables] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [testConversation, setTestConversation] = useState("");
  const [savedResults, setSavedResults] = useState("");
  const [calibration, setCalibration] = useState("");
  const [evalPrompt, setEvalPrompt] = useState("");
  const [runEval, setRunEval] = useState("");
  const [files, setFiles] = useState("");

  const sections: Array<WorkflowSection> = [
    {
      id: "system-prompt",
      label: "System Prompt",
      description: "Define the system prompt for the AI.",
      value: systemPrompt,
      onChange: setSystemPrompt,
      placeholder: "You are a helpful assistant...",
    },
    {
      id: "input-variables",
      label: "Input Variables",
      description: "Define input variables as JSONL for prompt testing.",
      value: inputVariables,
      onChange: setInputVariables,
      placeholder:
        '{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}',
    },
    {
      id: "test-conversation",
      label: "Test Conversation",
      description: "Test your system prompt in an ephemeral conversation.",
      value: testConversation,
      onChange: setTestConversation,
      placeholder: "Test conversation will appear here...",
    },
    {
      id: "saved-results",
      label: "Saved Results",
      description: "Saved outputs from test conversations.",
      value: savedResults,
      onChange: setSavedResults,
      placeholder: "Saved conversation outputs will appear here...",
    },
    {
      id: "calibration",
      label: "Calibration",
      description: "Calibration settings and parameters.",
      value: calibration,
      onChange: setCalibration,
      placeholder: "Calibration parameters...",
    },
    {
      id: "eval-prompt",
      label: "Eval Prompt",
      description: "Define the evaluation prompt.",
      value: evalPrompt,
      onChange: setEvalPrompt,
      placeholder: "Evaluation prompt...",
    },
    {
      id: "run-eval",
      label: "Run Eval",
      description: "Execute evaluations and view results.",
      value: runEval,
      onChange: setRunEval,
      placeholder: "Evaluation execution and results...",
    },
    {
      id: "files",
      label: "Files",
      description: "File management and workflow settings.",
      value: files,
      onChange: setFiles,
      placeholder: "File management...",
    },
  ];

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      // Clicking on the currently expanded section collapses it
      setExpandedSection("");
    } else {
      // Clicking on any other section expands it and collapses the previous one
      setExpandedSection(sectionId);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    // console.log("Save workflow data:", {
    //   inputVariables,
    //   systemPrompt,
    //   testConversation,
    //   savedResults,
    //   calibration,
    //   evalPrompt,
    //   runEval,
    //   files,
    // });
  };

  const handleSaveTestResult = (
    messages: Array<
      {
        id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
      }
    >,
  ) => {
    // Convert test conversation to JSONL format and add to saved results
    const jsonlResult = messages.map((msg) =>
      JSON.stringify({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })
    ).join("\n");

    const timestamp = new Date().toISOString();
    const newResult =
      `# Test Result - ${timestamp}\n\n\`\`\`jsonl\n${jsonlResult}\n\`\`\`\n\n`;

    setSavedResults((prev) => prev + newResult);
  };

  return (
    <div
      style={{
        width: "400px",
        height: "100vh",
        backgroundColor: "#1a1b1c",
        borderLeft: "1px solid #3a3b3c",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Accordion Sections */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#1a1b1c",
        }}
      >
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} style={{ borderBottom: "1px solid #3a3b3c" }}>
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() =>
                  toggleSection(section.id)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: isExpanded ? "#2a2b2c" : "#1a1b1c",
                  color: "#fafaff",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#232425";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#1a1b1c";
                  }
                }}
              >
                <span>{section.label}</span>
                <span
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontSize: "0.75rem",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div style={{ padding: "0" }}>
                  {section.id === "test-conversation"
                    ? (
                      <TestConversation
                        systemPrompt={systemPrompt}
                        onSaveResult={handleSaveTestResult}
                      />
                    )
                    : (
                      <WorkflowTextArea
                        label={section.label}
                        description={section.description}
                        value={section.value}
                        onChange={section.onChange}
                        placeholder={section.placeholder}
                      />
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        <BfDsButton
          onClick={handleSave}
          variant="primary"
          style={{ width: "100%" }}
        >
          Save Workflow
        </BfDsButton>
      </div>
    </div>
  );
}
