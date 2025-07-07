import { useState } from "react";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";
import { TestConversationUI } from "./TestConversationUI.tsx";

interface SystemPromptTabProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  inputVariables: string;
  onInputVariablesChange: (value: string) => void;
}

export function SystemPromptTab({
  systemPrompt,
  onSystemPromptChange,
  inputVariables,
  onInputVariablesChange,
}: SystemPromptTabProps) {
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(
    new Set(["system-prompt"]),
  );

  const textSubsections = [
    {
      id: "system-prompt",
      label: "System Prompt",
      description:
        "Define the main system prompt/actor deck content for the AI.",
      value: systemPrompt,
      onChange: onSystemPromptChange,
      placeholder:
        "# Actor Instructions\n\nYou are a helpful assistant that answers questions clearly and accurately...",
    },
    {
      id: "input-variables",
      label: "Input Variables",
      description: "Define input variables as JSONL for prompt testing.",
      value: inputVariables,
      onChange: onInputVariablesChange,
      placeholder:
        '{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}',
    },
  ];

  const testConversationSection = {
    id: "test-conversation",
    label: "Test Conversation",
    description: "Test your system prompt in an ephemeral conversation.",
  };

  const toggleSubsection = (sectionId: string) => {
    setExpandedSubsections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const expandedCount = expandedSubsections.size;
  const _expandedHeight = expandedCount > 0
    ? `calc((100vh - 200px) / ${expandedCount})`
    : "auto";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Text subsections (System Prompt and Input Variables) */}
      {textSubsections.map((subsection) => {
        const isExpanded = expandedSubsections.has(subsection.id);
        return (
          <div
            key={subsection.id}
            style={{
              borderBottom: "1px solid #2a2b2c",
              display: "flex",
              flexDirection: "column",
              flex: isExpanded ? 1 : "0 0 auto",
            }}
          >
            <button
              type="button"
              onClick={() => toggleSubsection(subsection.id)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: isExpanded ? "#2a2b2c" : "#1a1b1c",
                color: "#fafaff",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background-color 0.2s ease",
                flexShrink: 0,
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
              <span>{subsection.label}</span>
              <span
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  fontSize: "0.7rem",
                }}
              >
                ▼
              </span>
            </button>

            {isExpanded && (
              <div style={{ padding: "0", flex: 1, minHeight: 0 }}>
                <WorkflowTextArea
                  label={subsection.label}
                  description={subsection.description}
                  value={subsection.value}
                  onChange={subsection.onChange}
                  placeholder={subsection.placeholder}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Test Conversation section */}
      {(() => {
        const isExpanded = expandedSubsections.has(testConversationSection.id);
        return (
          <div
            key={testConversationSection.id}
            style={{
              borderBottom: "1px solid #2a2b2c",
              display: "flex",
              flexDirection: "column",
              flex: isExpanded ? 1 : "0 0 auto",
            }}
          >
            <button
              type="button"
              onClick={() => toggleSubsection(testConversationSection.id)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: isExpanded ? "#2a2b2c" : "#1a1b1c",
                color: "#fafaff",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background-color 0.2s ease",
                flexShrink: 0,
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
              <span>{testConversationSection.label}</span>
              <span
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  fontSize: "0.7rem",
                }}
              >
                ▼
              </span>
            </button>

            {isExpanded && (
              <div style={{ padding: "0.75rem", flex: 1, minHeight: 0 }}>
                <div
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "0.75rem",
                    color: "#b8b8c0",
                  }}
                >
                  {testConversationSection.description}
                </div>
                <div style={{ height: "calc(100% - 24px)" }}>
                  <TestConversationUI systemPrompt={systemPrompt} />
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
