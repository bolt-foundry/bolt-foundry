export interface GraderResult {
  id: string;
  grader_score: number;
  truth_score?: number;
  notes: string;
  userMessage?: string;
  assistantResponse?: string;
  graderMetadata?: Record<string, unknown>;
  rawOutput?: string;
}

export interface GraderSection {
  grader: string;
  model: string;
  timestamp: string;
  samples: number;
  average_distance: number;
  results: Array<GraderResult>;
}

export interface EvaluationData {
  graderResults: Record<string, GraderSection>;
}

export const mockSingleGraderData: EvaluationData = {
  graderResults: {
    "test-grader": {
      grader: "test.deck.md",
      model: "claude-3.5-sonnet",
      timestamp: "2025-06-17T14:00:00.000Z",
      samples: 3,
      average_distance: 1.33,
      results: [
        {
          id: "exact-match",
          grader_score: 2,
          truth_score: 2,
          notes: "Perfect agreement",
          userMessage: "What is JavaScript?",
          assistantResponse:
            "JavaScript is a programming language commonly used for web development.",
        },
        {
          id: "off-by-one",
          grader_score: 1,
          truth_score: 2,
          notes: "Close but underscored",
          userMessage: "How do I center a div?",
          assistantResponse:
            "You can use CSS flexbox: display: flex; justify-content: center; align-items: center;",
        },
        {
          id: "big-difference",
          grader_score: -1,
          truth_score: 2,
          notes: "Major disagreement",
          userMessage: "What's the capital of France?",
          assistantResponse: "Paris is the capital of France.",
        },
      ],
    },
  },
};

export const mockMultiGraderData: EvaluationData = {
  graderResults: {
    "grader-a": {
      grader: "grader-a.deck.md",
      model: "claude-3.5-sonnet",
      timestamp: "2025-06-17T14:00:00.000Z",
      samples: 2,
      average_distance: 0.5,
      results: [
        {
          id: "sample-1",
          grader_score: 1,
          truth_score: 1,
          notes: "Agreed",
        },
        {
          id: "sample-2",
          grader_score: 2,
          truth_score: 3,
          notes: "Underscored",
        },
      ],
    },
    "grader-b": {
      grader: "grader-b.deck.md",
      model: "gpt-4",
      timestamp: "2025-06-17T14:30:00.000Z",
      samples: 2,
      average_distance: 2.0,
      results: [
        {
          id: "sample-1",
          grader_score: 3,
          truth_score: 1,
          notes: "Overscored",
        },
        {
          id: "sample-2",
          grader_score: 0,
          truth_score: 2,
          notes: "Underscored",
        },
      ],
    },
  },
};

// New fixtures for multiple models support

export interface GraderModelResult {
  model: string;
  timestamp: string;
  samples: number;
  average_distance: number;
  results: Array<GraderResult>;
}

export interface NestedGraderSection {
  grader: string;
  models: Record<string, GraderModelResult>;
}

export interface NestedEvaluationData {
  graderResults: Record<string, NestedGraderSection>;
}

export const mockSingleGraderMultiModelData: NestedEvaluationData = {
  graderResults: {
    "test-grader": {
      grader: "test.deck.md",
      models: {
        "claude-3.5": {
          model: "claude-3.5-sonnet",
          timestamp: "2025-06-17T14:00:00.000Z",
          samples: 2,
          average_distance: 0.5,
          results: [
            {
              id: "test1",
              grader_score: 2,
              truth_score: 2,
              notes: "Perfect match",
              userMessage: "What is JavaScript?",
              assistantResponse: "JavaScript is a programming language.",
            },
            {
              id: "test2",
              grader_score: 1,
              truth_score: 2,
              notes: "Slightly underscored",
              userMessage: "Explain closures",
              assistantResponse:
                "Closures allow functions to access outer variables.",
            },
          ],
        },
        "gpt-4": {
          model: "gpt-4",
          timestamp: "2025-06-17T14:05:00.000Z",
          samples: 2,
          average_distance: 1.0,
          results: [
            {
              id: "test1",
              grader_score: 3,
              truth_score: 2,
              notes: "Overscored",
              userMessage: "What is JavaScript?",
              assistantResponse: "JavaScript is a programming language.",
            },
            {
              id: "test2",
              grader_score: 2,
              truth_score: 2,
              notes: "Perfect match",
              userMessage: "Explain closures",
              assistantResponse:
                "Closures allow functions to access outer variables.",
            },
          ],
        },
      },
    },
  },
};

export const mockMultiGraderMultiModelData: NestedEvaluationData = {
  graderResults: {
    "tone-grader": {
      grader: "tone-grader.deck.md",
      models: {
        "claude-3.5": {
          model: "claude-3.5-sonnet",
          timestamp: "2025-06-17T14:00:00.000Z",
          samples: 1,
          average_distance: 0,
          results: [
            {
              id: "sample1",
              grader_score: 2,
              truth_score: 2,
              notes: "Good tone",
            },
          ],
        },
        "gpt-3.5": {
          model: "gpt-3.5-turbo",
          timestamp: "2025-06-17T14:01:00.000Z",
          samples: 1,
          average_distance: 1,
          results: [
            {
              id: "sample1",
              grader_score: 1,
              truth_score: 2,
              notes: "Slightly harsh",
            },
          ],
        },
      },
    },
    "accuracy-grader": {
      grader: "accuracy-grader.deck.md",
      models: {
        "claude-3.5": {
          model: "claude-3.5-sonnet",
          timestamp: "2025-06-17T14:02:00.000Z",
          samples: 1,
          average_distance: 0,
          results: [
            {
              id: "sample1",
              grader_score: 3,
              truth_score: 3,
              notes: "Highly accurate",
            },
          ],
        },
        "gpt-3.5": {
          model: "gpt-3.5-turbo",
          timestamp: "2025-06-17T14:03:00.000Z",
          samples: 1,
          average_distance: 2,
          results: [
            {
              id: "sample1",
              grader_score: 1,
              truth_score: 3,
              notes: "Missing details",
            },
          ],
        },
      },
    },
  },
};
