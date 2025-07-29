import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { SampleDisplay } from "./SampleDisplay.tsx";
import type { GradingSample } from "@bfmono//home/runner/workspace/apps/boltfoundry-com/types/grading.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface GradingInboxProps {
  deckId: string;
  deckName: string;
  samples: Array<GradingSample>;
  onClose: () => void;
}

export function GradingInbox({
  deckId,
  deckName,
  samples,
  onClose,
}: GradingInboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [humanRatings, setHumanRatings] = useState<
    Record<string, Record<string, { rating: -3 | 3 | null; comment: string }>>
  >({});

  const currentSample = samples[currentIndex];
  const totalSamples = samples.length;
  const remainingSamples = totalSamples - completedCount;

  const handleHumanRatingChange = (
    graderId: string,
    rating: -3 | 3 | null,
    comment: string,
  ) => {
    setHumanRatings((prev) => ({
      ...prev,
      [currentSample.id]: {
        ...prev[currentSample.id],
        [graderId]: { rating, comment },
      },
    }));
  };

  const currentSampleRatings = humanRatings[currentSample?.id] || {};
  const graderIds = currentSample?.graderEvaluations?.map((e) => e.graderId) ||
    [];
  const allGradersRated = graderIds.length > 0 &&
    graderIds.every((id) =>
      currentSampleRatings[id]?.rating !== null &&
      currentSampleRatings[id]?.rating !== undefined
    );

  const handleNext = () => {
    logger.info("Sample grading complete", {
      sampleId: currentSample.id,
      ratings: currentSampleRatings,
    });

    // TODO: Submit grades via GraphQL mutation

    setCompletedCount((prev) => prev + 1);

    // Move to next sample
    if (currentIndex < samples.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All samples graded
      logger.info("All samples graded", {
        deckId,
        completedCount: completedCount + 1,
      });
    }
  };

  const handleSkip = () => {
    if (currentIndex < samples.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentSample) {
    return (
      <div className="grading-inbox grading-complete">
        <div className="grading-header">
          <h2>Grading Complete</h2>
          <BfDsButton
            variant="ghost"
            size="small"
            icon="x"
            onClick={onClose}
            aria-label="Close grading"
          />
        </div>
        <div className="grading-complete-message">
          <BfDsIcon name="checkCircle" size="xlarge" />
          <h3>All samples have been graded!</h3>
          <p>You've graded {completedCount} samples from "{deckName}"</p>
          <BfDsButton
            variant="primary"
            onClick={onClose}
          >
            Return to Decks
          </BfDsButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grading-inbox">
      <div className="grading-header">
        <div className="grading-header-info">
          <h2>Grading: {deckName}</h2>
          <div className="grading-progress">
            <span className="progress-text">
              Sample {currentIndex + 1} of {totalSamples}
            </span>
            <span className="progress-completed">
              {completedCount} completed
            </span>
            {remainingSamples > 0 && (
              <span className="progress-remaining">
                {remainingSamples} remaining
              </span>
            )}
          </div>
        </div>
        <div className="grading-header-actions">
          <BfDsButton
            variant="ghost"
            size="small"
            onClick={handleSkip}
            disabled={currentIndex >= samples.length - 1}
          >
            Skip
          </BfDsButton>
          <BfDsButton
            variant="ghost"
            size="small"
            icon="x"
            onClick={onClose}
            aria-label="Close grading"
          />
        </div>
      </div>

      <div className="grading-content">
        <SampleDisplay
          sample={currentSample}
          onHumanRatingChange={handleHumanRatingChange}
        />

        <div className="grading-controls-section">
          <div className="grading-next-section">
            <div className="grading-status">
              {graderIds.length > 0 && (
                <p className="rating-progress">
                  {Object.values(currentSampleRatings).filter((r) =>
                    r?.rating !== null && r?.rating !== undefined
                  ).length} of {graderIds.length} graders rated
                </p>
              )}
            </div>
            <BfDsButton
              variant="primary"
              size="large"
              onClick={handleNext}
              disabled={!allGradersRated}
            >
              {currentIndex === samples.length - 1
                ? "Complete Grading"
                : "Next Sample"}
              <BfDsIcon name="arrowRight" size="small" />
            </BfDsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
