import { useState } from "react";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface EvalTabProps {
  evalPrompt: string;
  onEvalPromptChange: (value: string) => void;
  runEval: string;
  onRunEvalChange: (value: string) => void;
  inputSamples: string;
  onInputSamplesChange: (value: string) => void;
}

export function EvalTab({
  evalPrompt,
  onEvalPromptChange,
  runEval,
  onRunEvalChange,
  inputSamples,
  onInputSamplesChange,
}: EvalTabProps) {
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(
    new Set(["eval-prompt"]),
  );

  const subsections = [
    {
      id: "eval-prompt",
      label: "Eval Prompt Configuration",
      description: "Define the evaluation prompt and grading criteria.",
      value: evalPrompt,
      onChange: onEvalPromptChange,
      placeholder:
        "# Grader Instructions\n\n## Evaluation Criteria\n- **Helpfulness**: Does the response address the question?\n- **Accuracy**: Is the information correct?\n- **Clarity**: Is the response easy to understand?\n\n## Grading Scale\n- +3: Excellent\n- +2: Good\n- +1: Adequate\n- 0: Neutral\n- -1: Poor\n- -2: Bad\n- -3: Harmful",
    },
    {
      id: "input-samples",
      label: "Input Samples",
      description:
        "Define the input samples for evaluation. Each line should be a JSON object.",
      value: inputSamples,
      onChange: onInputSamplesChange,
      placeholder:
        '{"input": "What is the capital of France?"}\n{"input": "Explain photosynthesis in simple terms"}',
    },
    {
      id: "run-eval",
      label: "Run Evaluation",
      description: "Execute evaluations and view results.",
      value: runEval,
      onChange: onRunEvalChange,
      placeholder: "Evaluation execution and results will appear here...",
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
