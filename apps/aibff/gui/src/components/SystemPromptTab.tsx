import { useState } from "react";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface SystemPromptTabProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  inputVariables: string;
  onInputVariablesChange: (value: string) => void;
  testConversation: string;
  onTestConversationChange: (value: string) => void;
}

export function SystemPromptTab({
  systemPrompt,
  onSystemPromptChange,
  inputVariables,
  onInputVariablesChange,
  testConversation,
  onTestConversationChange,
}: SystemPromptTabProps) {
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(
    new Set(["system-prompt"]),
  );

  const subsections = [
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
    {
      id: "test-conversation",
      label: "Test Conversation",
      description: "Test your system prompt in an ephemeral conversation.",
      value: testConversation,
      onChange: onTestConversationChange,
      placeholder: "Test conversation will appear here...",
    },
  ];

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
      {subsections.map((subsection) => {
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
    </div>
  );
}
