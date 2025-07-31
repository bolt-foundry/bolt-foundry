// Type definitions for eval data structures

export interface BfDeckEdge {
  node: {
    id: string;
    name: string;
    content?: string;
    bfSamples?: {
      edges: Array<BfSampleEdge>;
    };
  };
}

export interface BfSampleEdge {
  node: {
    id: string;
    completionData?: {
      model?: string;
      messages?: Array<unknown>;
      choices?: Array<unknown>;
    };
  };
}

export interface EvalData {
  currentViewer?: {
    id?: string;
    personBfGid?: string;
    orgBfOid?: string;
    organization?: {
      bfDecks?: {
        edges?: Array<BfDeckEdge>;
      };
    };
  };
}

export interface GraderEvaluation {
  graderId: string;
}

export interface ExistingGrade {
  graderId: string;
  score: -3 | 3;
  reason: string;
}
