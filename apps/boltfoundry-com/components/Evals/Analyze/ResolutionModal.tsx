import { useState } from "react";
import { BfDsModal } from "@bfmono/apps/bfDs/components/BfDsModal.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsTextArea } from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";
import { BfDsRadio } from "@bfmono/apps/bfDs/components/BfDsRadio.tsx";
import { BfDsRange } from "@bfmono/apps/bfDs/components/BfDsRange.tsx";
import { BfDsTabs } from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { BfDsCard } from "@bfmono/apps/bfDs/components/BfDsCard.tsx";

interface GraderScore {
  grader1: number;
  grader2: number;
  grader3: number;
}

interface Disagreement {
  id: string;
  sampleId: string;
  prompt: string;
  response: string;
  graderScores: Record<string, GraderScore>;
  avgDisagreement: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

interface Resolution {
  method: "majority" | "average" | "expert";
  scores: Record<string, number>;
  notes?: string;
}

interface ResolutionModalProps {
  disagreement: Disagreement;
  onClose: () => void;
  onSubmit: (resolution: Resolution) => void;
}

export function ResolutionModal(
  { disagreement, onClose, onSubmit }: ResolutionModalProps,
) {
  const [activeTab, setActiveTab] = useState("review");
  const [resolutionType, setResolutionType] = useState<
    "consensus" | "expert" | "dismiss"
  >("consensus");
  const [expertScores, setExpertScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [consensusMethod, setConsensusMethod] = useState<
    "average" | "median" | "majority"
  >("average");

  const handleExpertScoreChange = (category: string, score: number) => {
    setExpertScores((prev) => ({
      ...prev,
      [category]: score,
    }));
  };

  const calculateConsensusScore = (scores: GraderScore, method: string) => {
    const values = [scores.grader1, scores.grader2, scores.grader3];

    switch (method) {
      case "average":
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      case "median":
        return values.sort((a, b) => a - b)[1];
      case "majority": {
        // Find the most common score, or average if all different
        const counts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const maxCount = Math.max(...Object.values(counts));
        const majority = Object.keys(counts).find((key) =>
          counts[Number(key)] === maxCount
        );

        return majority
          ? Number(majority)
          : Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      }
      default:
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }
  };

  const handleSubmit = () => {
    const resolution = {
      type: resolutionType,
      method: resolutionType === "consensus" ? consensusMethod : undefined,
      expertScores: resolutionType === "expert" ? expertScores : undefined,
      notes,
      resolvedAt: new Date().toISOString(),
      finalScores: resolutionType === "consensus"
        ? Object.fromEntries(
          Object.entries(disagreement.graderScores).map((
            [category, scores],
          ) => [
            category,
            calculateConsensusScore(scores, consensusMethod),
          ]),
        )
        : resolutionType === "expert"
        ? expertScores
        : undefined,
    };

    onSubmit(resolution);
  };

  const isValid = () => {
    if (resolutionType === "expert") {
      const categories = Object.keys(disagreement.graderScores);
      return categories.every((category) =>
        expertScores[category] !== undefined
      );
    }
    return true;
  };

  const tabs = [
    {
      id: "review",
      label: "Review",
      content: (
        <div className="review-content">
          <div className="disagreement-summary">
            <h3>Sample #{disagreement.sampleId}</h3>
            <div className="prompt-response-review">
              <BfDsCard>
                <h4>Prompt</h4>
                <p>{disagreement.prompt}</p>
              </BfDsCard>
              <BfDsCard>
                <h4>Response</h4>
                <p>{disagreement.response}</p>
              </BfDsCard>
            </div>
          </div>

          <div className="scores-review">
            <h4>Current Grader Scores</h4>
            <div className="scores-table">
              <div className="scores-header">
                <span>Category</span>
                <span>Grader 1</span>
                <span>Grader 2</span>
                <span>Grader 3</span>
                <span>Range</span>
              </div>
              {Object.entries(disagreement.graderScores).map(
                ([category, scores]) => {
                  const values = [
                    scores.grader1,
                    scores.grader2,
                    scores.grader3,
                  ];
                  const range = Math.max(...values) - Math.min(...values);

                  return (
                    <div key={category} className="scores-row">
                      <span className="category-name">{category}</span>
                      <span className="score">{scores.grader1}</span>
                      <span className="score">{scores.grader2}</span>
                      <span className="score">{scores.grader3}</span>
                      <span
                        className={`range ${
                          range >= 10 ? "high" : range >= 7 ? "medium" : "low"
                        }`}
                      >
                        ±{range}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "resolve",
      label: "Resolve",
      content: (
        <div className="resolution-content">
          <div className="resolution-method">
            <h4>Resolution Method</h4>
            <BfDsRadio
              options={[
                {
                  value: "consensus",
                  label: "Use Consensus",
                  description: "Apply statistical method to existing scores",
                },
                {
                  value: "expert",
                  label: "Expert Review",
                  description: "Provide authoritative scores for each category",
                },
                {
                  value: "dismiss",
                  label: "Dismiss Disagreement",
                  description: "Mark as resolved without changing scores",
                },
              ]}
              value={resolutionType}
              onChange={setResolutionType}
            />
          </div>

          {resolutionType === "consensus" && (
            <div className="consensus-options">
              <h4>Consensus Method</h4>
              <BfDsRadio
                options={[
                  {
                    value: "average",
                    label: "Average",
                    description: "Use mathematical average",
                  },
                  {
                    value: "median",
                    label: "Median",
                    description: "Use middle value",
                  },
                  {
                    value: "majority",
                    label: "Majority",
                    description: "Use most common score",
                  },
                ]}
                value={consensusMethod}
                onChange={setConsensusMethod}
              />

              <div className="consensus-preview">
                <h5>Consensus Scores Preview</h5>
                <div className="preview-scores">
                  {Object.entries(disagreement.graderScores).map((
                    [category, scores],
                  ) => (
                    <div key={category} className="preview-score">
                      <span>{category}</span>
                      <span className="consensus-score">
                        {calculateConsensusScore(scores, consensusMethod)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {resolutionType === "expert" && (
            <div className="expert-scoring">
              <h4>Expert Scores</h4>
              <p>Provide authoritative scores for each category (1-100):</p>

              <div className="expert-scores-form">
                {Object.keys(disagreement.graderScores).map((category) => (
                  <div key={category} className="expert-score-input">
                    <label>{category}</label>
                    <BfDsRange
                      min={1}
                      max={100}
                      step={1}
                      value={expertScores[category] || 50}
                      onChange={(value) =>
                        handleExpertScoreChange(category, value)}
                      formatValue={(val) =>
                        `${val}/100`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="resolution-notes">
            <h4>Resolution Notes</h4>
            <BfDsTextArea
              placeholder="Add notes about this resolution decision..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <BfDsModal
      size="large"
      onClose={onClose}
      header={
        <div className="resolution-modal-header">
          <h2>Resolve Disagreement</h2>
          <p>
            Sample #{disagreement.sampleId} •{" "}
            {disagreement.avgDisagreement}% avg disagreement
          </p>
        </div>
      }
      footer={
        <div className="resolution-modal-footer">
          <BfDsButton variant="outline" onClick={onClose}>
            Cancel
          </BfDsButton>
          <BfDsButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!isValid()}
          >
            {resolutionType === "dismiss" ? "Dismiss" : "Apply Resolution"}
          </BfDsButton>
        </div>
      }
    >
      <BfDsTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </BfDsModal>
  );
}
