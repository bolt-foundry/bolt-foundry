import { useState } from "react";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface CalibrationTabProps {
  savedResults: string;
  onSavedResultsChange: (value: string) => void;
  calibration: string;
  onCalibrationChange: (value: string) => void;
  groundTruth: string;
  onGroundTruthChange: (value: string) => void;
}

export function CalibrationTab({
  savedResults,
  onSavedResultsChange,
  calibration,
  onCalibrationChange,
  groundTruth,
  onGroundTruthChange,
}: CalibrationTabProps) {
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(
    new Set(["calibration"]),
  );

  const subsections = [
    {
      id: "calibration",
      label: "Calibration Settings",
      description: "Calibration parameters and configuration.",
      value: calibration,
      onChange: onCalibrationChange,
      placeholder:
        "# Calibration Settings\n\nThreshold: 0.85\nSample size: 100\nMetric: accuracy",
    },
    {
      id: "ground-truth",
      label: "Ground Truth Data",
      description:
        "Define expected outputs or reference standards for evaluation.",
      value: groundTruth,
      onChange: onGroundTruthChange,
      placeholder:
        '[contexts.expectedOutput]\nassistantQuestion = "What is the expected output?"\ndefault = "A clear, accurate, and helpful response"',
    },
    {
      id: "saved-results",
      label: "Performance Metrics",
      description: "Saved calibration results and performance metrics.",
      value: savedResults,
      onChange: onSavedResultsChange,
      placeholder:
        "Saved calibration results and performance metrics will appear here...",
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
