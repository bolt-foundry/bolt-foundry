import { useEffect, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { BfDsTextArea } from "@bfmono/apps/bfDs/components/BfDsTextArea.tsx";

interface GraderHumanRatingProps {
  graderId: string;
  graderName: string;
  initialRating?: -3 | 3 | null;
  initialComment?: string;
  onRatingChange: (
    graderId: string,
    rating: -3 | 3 | null,
    comment: string,
  ) => void;
}

export function GraderHumanRating({
  graderId,
  graderName,
  initialRating = null,
  initialComment = "",
  onRatingChange,
}: GraderHumanRatingProps) {
  const [selectedScore, setSelectedScore] = useState<-3 | 3 | null>(
    initialRating,
  );
  const [comment, setComment] = useState(initialComment);

  // Reset state when initial values change (i.e., when moving to a new sample)
  useEffect(() => {
    setSelectedScore(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment, graderId]);

  const handleScoreSelect = (score: -3 | 3) => {
    const newScore = selectedScore === score ? null : score;
    setSelectedScore(newScore);
    onRatingChange(graderId, newScore, comment);
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    onRatingChange(graderId, selectedScore, newComment);
  };

  return (
    <div className="grader-human-rating">
      <div className="human-rating-header">
        <h4>Your rating of {graderName}:</h4>
      </div>

      <div className="human-rating-buttons">
        <BfDsButton
          variant={selectedScore === -3 ? "error" : "outline"}
          size="small"
          onClick={() => handleScoreSelect(-3)}
          className="human-rating-button negative"
        >
          <BfDsIcon name="thumbDown" size="small" />
          <span>-3</span>
        </BfDsButton>

        <BfDsButton
          variant={selectedScore === 3 ? "success" : "outline"}
          size="small"
          onClick={() => handleScoreSelect(3)}
          className="human-rating-button positive"
        >
          <BfDsIcon name="thumbUp" size="small" />
          <span>+3</span>
        </BfDsButton>
      </div>

      <div className="human-rating-comment">
        <label htmlFor={`comment-${graderId}`}>
          Reason (optional)
        </label>
        <BfDsTextArea
          id={`comment-${graderId}`}
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder={`Why do you rate ${graderName} this way?`}
          rows={2}
        />
      </div>
    </div>
  );
}
