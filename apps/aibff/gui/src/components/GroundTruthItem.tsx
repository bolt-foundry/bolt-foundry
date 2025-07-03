import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

interface GroundTruthItemProps {
  item: {
    id: string;
    input: string;
    output: string;
    score: number;
    timestamp?: string;
  };
  onEditScore: (id: string, newScore: number) => void;
  onRemove: (id: string) => void;
}

export function GroundTruthItem(
  { item, onEditScore, onRemove }: GroundTruthItemProps,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleEditScore = async (newScore: number) => {
    try {
      await onEditScore(item.id, newScore);
      setIsEditing(false);
    } catch {
      // Handle error if needed
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  const scoreButtons = [-3, -2, -1, 1, 2, 3];

  const getScoreColor = (score: number) => {
    if (score > 0) {
      return score === 3 ? "#059669" : score === 2 ? "#10b981" : "#34d399";
    } else {
      return score === -3 ? "#dc2626" : score === -2 ? "#ef4444" : "#f87171";
    }
  };

  const getScoreLabel = (score: number) => {
    const labels = {
      3: "Excellent",
      2: "Good",
      1: "Acceptable",
      "-1": "Poor",
      "-2": "Bad",
      "-3": "Terrible",
    };
    return labels[score as keyof typeof labels];
  };

  return (
    <div
      style={{
        backgroundColor: "#2a2b2c",
        border: "1px solid #3a3b3c",
        borderRadius: "8px",
        padding: "1rem",
        margin: "0.5rem 0",
        opacity: isRemoving ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
          borderBottom: "1px solid #3a3b3c",
          paddingBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#fafaff",
            }}
          >
            Example #{item.id.slice(-6)}
          </span>
          <div
            style={{
              backgroundColor: getScoreColor(item.score),
              color: "#ffffff",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {item.score > 0 ? `+${item.score}` : item.score} -{" "}
            {getScoreLabel(item.score)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {item.timestamp && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
              }}
            >
              {new Date(item.timestamp).toLocaleString()}
            </span>
          )}
          <BfDsButton
            variant="primary"
            size="small"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </BfDsButton>
          <BfDsButton
            variant="danger"
            size="small"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? "..." : "Remove"}
          </BfDsButton>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "0.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Input
        </div>
        <div
          style={{
            backgroundColor: "#1a1b1c",
            border: "1px solid #3a3b3c",
            borderRadius: "4px",
            padding: "0.75rem",
            fontSize: "0.875rem",
            color: "#fafaff",
            lineHeight: "1.5",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          {item.input}
        </div>
      </div>

      {/* Output Section */}
      <div style={{ marginBottom: isEditing ? "1rem" : "0" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "0.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          AI Response
        </div>
        <div
          style={{
            backgroundColor: "#1a1b1c",
            border: "1px solid #3a3b3c",
            borderRadius: "4px",
            padding: "0.75rem",
            fontSize: "0.875rem",
            color: "#fafaff",
            lineHeight: "1.5",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {item.output}
        </div>
      </div>

      {/* Edit Score Section */}
      {isEditing && (
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#9ca3af",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Change score
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.5rem",
            }}
          >
            {scoreButtons.map((score) => (
              <button
                type="button"
                key={score}
                onClick={() => handleEditScore(score)}
                style={{
                  backgroundColor: score === item.score
                    ? getScoreColor(score)
                    : "#4b5563",
                  color: "#ffffff",
                  border: score === item.score
                    ? "2px solid #ffffff"
                    : "2px solid transparent",
                  borderRadius: "6px",
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                onMouseEnter={(e) => {
                  if (score !== item.score) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      getScoreColor(score);
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (score !== item.score) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#4b5563";
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }
                }}
              >
                <span style={{ fontSize: "1rem" }}>
                  {score > 0 ? `+${score}` : score}
                </span>
                <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                  {getScoreLabel(score)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
