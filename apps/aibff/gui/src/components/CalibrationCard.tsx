import { useState } from "react";

interface CalibrationCardProps {
  item: {
    id: string;
    input: string;
    output: string;
    timestamp?: string;
  };
  onScore: (id: string, score: number) => void;
}

export function CalibrationCard({ item, onScore }: CalibrationCardProps) {
  const [isScoring, setIsScoring] = useState(false);

  const handleScore = async (score: number) => {
    setIsScoring(true);
    try {
      await onScore(item.id, score);
    } finally {
      setIsScoring(false);
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
        opacity: isScoring ? 0.7 : 1,
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
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#fafaff",
          }}
        >
          Example #{item.id.slice(-6)}
        </span>
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

      {/* Scoring Section */}
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
          Score this response
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
              key={score}
              type="button"
              onClick={() => handleScore(score)}
              disabled={isScoring}
              style={{
                backgroundColor: getScoreColor(score),
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.75rem 0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: isScoring ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: isScoring ? 0.5 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
              onMouseEnter={(e) => {
                if (!isScoring) {
                  (e.target as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
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
    </div>
  );
}
