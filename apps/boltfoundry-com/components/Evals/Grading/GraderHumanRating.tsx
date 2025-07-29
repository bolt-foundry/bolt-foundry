import { useState } from "react";
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
        <h4>Your evaluation of {graderName}:</h4>
      </div>

      <div className="human-rating-buttons">
        <BfDsButton
          variant={selectedScore === -3 ? "outline" : "outline"}
          size="small"
          onClick={() => handleScoreSelect(-3)}
          className="human-rating-button disagree"
        >
          <BfDsIcon name="thumbDown" size="small" />
          <span>Disagree</span>
        </BfDsButton>

        <BfDsButton
          variant={selectedScore === 3 ? "primary" : "outline"}
          size="small"
          onClick={() => handleScoreSelect(3)}
          className="human-rating-button agree"
        >
          <BfDsIcon name="thumbUp" size="small" />
          <span>Agree</span>
        </BfDsButton>
      </div>

      <div className="human-rating-comment">
        <label htmlFor={`comment-${graderId}`}>
          Comment (optional)
        </label>
        <BfDsTextArea
          id={`comment-${graderId}`}
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder={`Add your thoughts about ${graderName}'s evaluation...`}
          rows={2}
        />
      </div>
    </div>
  );
}
