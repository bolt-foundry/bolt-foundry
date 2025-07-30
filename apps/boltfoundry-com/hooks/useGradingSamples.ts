import { useEffect, useState } from "react";
import type { GradingSample } from "@bfmono/apps/boltfoundry-com/types/grading.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

interface UseGradingSamplesResult {
  samples: GradingSample[] | null;
  loading: boolean;
  error: string | null;
  saveGrade: (
    sampleId: string,
    grades: Array<{ graderId: string; score: -3 | 3; reason: string }>,
  ) => Promise<void>;
  saving: boolean;
}

export function useGradingSamples(deckId: string): UseGradingSamplesResult {
  const [samples, setSamples] = useState<GradingSample[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) return;

    logger.info("Fetching samples for deck", { deckId });
    setLoading(true);
    setError(null);

    // In a real implementation, this would use Isograph to fetch from GraphQL
    // For now, we'll simulate the GraphQL response structure
    setTimeout(async () => {
      try {
        const { mockGradingSamples } = await import(
          "@bfmono/apps/boltfoundry-com/mocks/gradingSamples.ts"
        );

        // Simulate some samples having existing human grades
        const samplesWithGrades = mockGradingSamples.map((sample, index) => {
          if (index === 0) {
            // First sample already has grades
            return {
              ...sample,
              humanGrade: {
                grades: [
                  {
                    graderId: "grader-1",
                    score: 3 as const,
                    reason: "Accurate JSON conversion",
                  },
                  {
                    graderId: "grader-2",
                    score: 3 as const,
                    reason: "All data preserved correctly",
                  },
                ],
                gradedBy: "user-123",
                gradedAt: new Date().toISOString(),
              },
            };
          }
          return sample;
        });

        setSamples(samplesWithGrades);
        setLoading(false);
      } catch (err) {
        logger.error("Failed to fetch samples", err);
        setError("Failed to load samples");
        setLoading(false);
      }
    }, 500); // Simulate network delay
  }, [deckId]);

  const saveGrade = async (
    sampleId: string,
    grades: Array<{ graderId: string; score: -3 | 3; reason: string }>,
  ) => {
    logger.info("Saving grade", { sampleId, grades });
    setSaving(true);
    setError(null);

    try {
      // Simulate GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update local state optimistically
      setSamples((prev) => {
        if (!prev) return prev;

        return prev.map((sample) => {
          if (sample.id === sampleId) {
            return {
              ...sample,
              humanGrade: {
                grades,
                gradedBy: "current-user", // TODO: Get from auth context
                gradedAt: new Date().toISOString(),
              },
            };
          }
          return sample;
        });
      });

      logger.info("Grade saved successfully", { sampleId });
    } catch (err) {
      logger.error("Failed to save grade", err);
      setError("Failed to save grade");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    samples,
    loading,
    error,
    saveGrade,
    saving,
  };
}
