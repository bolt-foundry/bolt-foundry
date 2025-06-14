import { Hint, Progress, Question } from "../types/tutor";

export type LLMProvider = "claude" | "openai";

export interface UserPerformanceMetrics {
  avgHintsUsed: number;
  avgAttempts: number;
  avgTimeToComplete: number; // in seconds
}

export interface QuestionGenerationRequest {
  userProgress: {
    questionsCompleted: number;
    currentStreak: number;
    conceptsLearned: string[];
    recentPerformance: UserPerformanceMetrics;
  };
  lastQuestion?: {
    id: string;
    concepts: string[];
    difficulty: string;
    wasCorrect: boolean;
    hintsUsed: number;
    attempts: number;
  };
  preferredProvider?: LLMProvider;
}

export interface HintGenerationRequest {
  question: Question;
  userCode: string;
  previousHints: Hint[];
  userProgress: {
    questionsCompleted: number;
    currentStreak: number;
    conceptsLearned: string[];
  };
  attemptHistory: {
    code: string;
    timestamp: number;
    wasSuccessful: boolean;
  }[];
  preferredProvider?: LLMProvider;
}

export interface HintResponse {
  hints: Hint[];
  shouldShowSolution: boolean;
  encouragement?: string;
}

export class LLMService {
  private static instance: LLMService;
  private defaultProvider: LLMProvider = "claude";

  private constructor() {}

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  public setDefaultProvider(provider: LLMProvider): void {
    this.defaultProvider = provider;
  }

  public getDefaultProvider(): LLMProvider {
    return this.defaultProvider;
  }

  /**
   * Generate a new question based on user progress and performance
   */
  public async generateQuestion(
    request: QuestionGenerationRequest,
  ): Promise<Question> {
    const provider = request.preferredProvider || this.defaultProvider;

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          preferredProvider: provider,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Question generation failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.question;
    } catch (error) {
      console.error("Error generating question:", error);
      throw new Error(
        `Failed to generate question: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Generate contextual hints based on user's current attempt
   */
  public async generateHint(
    request: HintGenerationRequest,
  ): Promise<HintResponse> {
    const provider = request.preferredProvider || this.defaultProvider;

    try {
      const response = await fetch("/api/generate-hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: request.question,
          userCode: request.userCode,
          previousHints: request.previousHints.map((hint) => ({
            text: hint.text,
            level: hint.level,
          })),
          userProgress: request.userProgress,
          attemptHistory: request.attemptHistory,
          preferredProvider: provider,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Hint generation failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Convert response to our internal format
      const hints: Hint[] = data.hints.map((hint: any, index: number) => ({
        id: `hint-${Date.now()}-${index}`,
        text: hint.text,
        level: hint.level,
      }));

      return {
        hints,
        shouldShowSolution: data.shouldShowSolution,
        encouragement: data.encouragement,
      };
    } catch (error) {
      console.error("Error generating hint:", error);
      throw new Error(
        `Failed to generate hint: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Calculate user performance metrics from their attempt history
   */
  public calculatePerformanceMetrics(attemptHistory: {
    questionId: string;
    hintsUsed: number;
    attempts: number;
    timeToComplete: number;
    wasSuccessful: boolean;
  }[]): UserPerformanceMetrics {
    if (attemptHistory.length === 0) {
      return {
        avgHintsUsed: 0,
        avgAttempts: 0,
        avgTimeToComplete: 0,
      };
    }

    // Only consider recent attempts (last 5 questions)
    const recentAttempts = attemptHistory.slice(-5);
    const successfulAttempts = recentAttempts.filter((attempt) =>
      attempt.wasSuccessful
    );

    if (successfulAttempts.length === 0) {
      return {
        avgHintsUsed: recentAttempts.reduce((sum, attempt) =>
          sum + attempt.hintsUsed, 0) / recentAttempts.length,
        avgAttempts: recentAttempts.reduce((sum, attempt) =>
          sum + attempt.attempts, 0) / recentAttempts.length,
        avgTimeToComplete: 0, // No successful completions
      };
    }

    return {
      avgHintsUsed: successfulAttempts.reduce(
        (sum, attempt) => sum + attempt.hintsUsed,
        0,
      ) / successfulAttempts.length,
      avgAttempts:
        successfulAttempts.reduce((sum, attempt) => sum + attempt.attempts, 0) /
        successfulAttempts.length,
      avgTimeToComplete: successfulAttempts.reduce(
        (sum, attempt) => sum + attempt.timeToComplete,
        0,
      ) / successfulAttempts.length,
    };
  }

  /**
   * Determine if user should advance to next difficulty level
   */
  public shouldAdvanceDifficulty(
    currentDifficulty: "beginner" | "intermediate" | "advanced",
    performance: UserPerformanceMetrics,
    currentStreak: number,
  ): boolean {
    // Don't advance from advanced
    if (currentDifficulty === "advanced") {
      return false;
    }

    // Advance if user is performing well consistently
    return (
      currentStreak >= 3 &&
      performance.avgHintsUsed < 1.5 &&
      performance.avgAttempts < 2.5 &&
      performance.avgTimeToComplete > 0 // Has successful completions
    );
  }

  /**
   * Determine if user should go to easier difficulty
   */
  public shouldReduceDifficulty(
    currentDifficulty: "beginner" | "intermediate" | "advanced",
    performance: UserPerformanceMetrics,
    recentFailures: number,
  ): boolean {
    // Don't reduce from beginner
    if (currentDifficulty === "beginner") {
      return false;
    }

    // Reduce if user is struggling consistently
    return (
      recentFailures >= 2 ||
      performance.avgHintsUsed > 3 ||
      performance.avgAttempts > 4
    );
  }

  /**
   * Get next concepts to focus on based on curriculum progression
   */
  public getNextConcepts(
    conceptsLearned: string[],
    difficulty: "beginner" | "intermediate" | "advanced",
  ): string[] {
    const conceptCurriculum = {
      beginner: [
        "variables",
        "functions",
        "console.log",
        "basic syntax",
        "parameters",
        "return values",
        "string manipulation",
        "numbers and math",
      ],
      intermediate: [
        "if statements",
        "comparison operators",
        "logical operators",
        "arrays",
        "loops",
        "objects",
        "array methods",
        "string methods",
      ],
      advanced: [
        "arrow functions",
        "destructuring",
        "template literals",
        "async/await",
        "promises",
        "error handling",
        "modules",
        "classes",
      ],
    };

    const availableConcepts = conceptCurriculum[difficulty];
    const unlearnedConcepts = availableConcepts.filter(
      (concept) => !conceptsLearned.includes(concept),
    );

    if (unlearnedConcepts.length === 0) {
      // All concepts learned at this level, return random mix
      return availableConcepts.slice(0, 2);
    }

    // Return 1-2 unlearned concepts
    return unlearnedConcepts.slice(0, Math.random() < 0.6 ? 1 : 2);
  }
}

// Export singleton instance
export const llmService = LLMService.getInstance();
