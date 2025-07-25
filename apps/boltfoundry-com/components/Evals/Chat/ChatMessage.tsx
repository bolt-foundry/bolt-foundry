import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { BfDsBadge } from "@bfmono/apps/bfDs/components/BfDsBadge.tsx";
import { MessageContent } from "./MessageContent.tsx";

interface MessageContentBlock {
  type: "text" | "choices" | "code" | "status";
  content: string;
  choices?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  language?: string;
  status?: {
    type: "building" | "success" | "error";
    message: string;
  };
}

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string | MessageContentBlock[];
  timestamp: string;
  metadata?: {
    model?: string;
    temperature?: number;
    evaluationScores?: Record<string, number>;
    flagged?: boolean;
    notes?: string;
  };
}

interface ChatMessageProps {
  message: Message;
  showEvaluation?: boolean;
  onAction?: (action: string) => void;
  onChoiceClick?: (choiceId: string) => void;
}

export function ChatMessage(
  { message, showEvaluation = false, onAction, onChoiceClick }: ChatMessageProps,
) {
  const isUser = message.type === "user";
  const isSystem = message.type === "system";

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getAverageScore = (scores?: Record<string, number>) => {
    if (!scores) return null;
    const values = Object.values(scores);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  if (isSystem) {
    return (
      <div className="chat-message system-message">
        <div className="system-content">
          <BfDsIcon name="info" size="small" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`chat-message ${
        isUser ? "user-message" : "assistant-message"
      }`}
    >
      <div className="message-avatar">
        {isUser
          ? <div className="user-avatar">You</div>
          : <div className="assistant-avatar">AI</div>}
      </div>

      <div className="message-content">
        <div className="message-header">
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
            {message.metadata?.model && (
              <span className="message-model">{message.metadata.model}</span>
            )}
            {message.metadata?.flagged && (
              <BfDsBadge variant="warning" size="small">
                <BfDsIcon name="flag" size="small" />
                Flagged
              </BfDsBadge>
            )}
          </div>

          {!isUser && onAction && (
            <div className="message-actions">
              <BfDsButton
                variant="ghost"
                size="small"
                iconOnly
                icon="copy"
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                }}
                title="Copy message"
              />
              <BfDsButton
                variant="ghost"
                size="small"
                iconOnly
                icon={message.metadata?.flagged ? "flag" : "flagOutline"}
                onClick={() => onAction("flag")}
                title={message.metadata?.flagged
                  ? "Unflag message"
                  : "Flag message"}
              />
              {showEvaluation && (
                <BfDsButton
                  variant="ghost"
                  size="small"
                  iconOnly
                  icon="star"
                  onClick={() => onAction("evaluate")}
                  title="Evaluate message"
                />
              )}
            </div>
          )}
        </div>

        <div className="message-text">
          {typeof message.content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          ) : (
            <MessageContent 
              blocks={message.content.map((block) => ({
                ...block,
                choices: block.choices?.map((choice) => ({
                  ...choice,
                  onClick: (id: string) => onChoiceClick?.(id)
                }))
              }))}
            />
          )}
        </div>

        {message.metadata?.evaluationScores && showEvaluation && (
          <div className="message-evaluation">
            <div className="evaluation-header">
              <BfDsIcon name="chartBar" size="small" />
              <span>Evaluation Scores</span>
            </div>

            <div className="evaluation-scores">
              {Object.entries(message.metadata.evaluationScores).map((
                [category, score],
              ) => (
                <div key={category} className="score-item">
                  <span className="score-category">{category}</span>
                  <BfDsBadge variant={getScoreVariant(score)} size="small">
                    {score}%
                  </BfDsBadge>
                </div>
              ))}

              <div className="average-score">
                <span className="score-category">Average</span>
                <BfDsBadge
                  variant={getScoreVariant(
                    getAverageScore(message.metadata.evaluationScores) || 0,
                  )}
                  size="small"
                >
                  {getAverageScore(message.metadata.evaluationScores)}%
                </BfDsBadge>
              </div>
            </div>
          </div>
        )}

        {message.metadata?.notes && (
          <div className="message-notes">
            <BfDsIcon name="note" size="small" />
            <span>{message.metadata.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
