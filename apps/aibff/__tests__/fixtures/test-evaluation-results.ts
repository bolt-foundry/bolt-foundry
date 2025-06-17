export interface GraderResult {
  id: string;
  grader_score: number;
  truth_score?: number;
  notes: string;
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
        },
        {
          id: "off-by-one",
          grader_score: 1,
          truth_score: 2,
          notes: "Close but underscored",
        },
        {
          id: "big-difference",
          grader_score: -1,
          truth_score: 2,
          notes: "Major disagreement",
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
