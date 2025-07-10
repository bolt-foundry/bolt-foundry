export interface Question {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  expectedOutputExample?: string;
}

export interface Hint {
  id: string;
  text: string;
  level: number;
}

export interface AnswerEvaluation {
  correct: boolean;
  feedback: string;
  suggestions?: string[];
}

export interface Progress {
  questionsCompleted: number;
  totalQuestions: number;
  currentStreak: number;
  conceptsLearned: string[];
}

export interface AttemptHistory {
  questionId: string;
  code: string;
  timestamp: number;
  wasSuccessful: boolean;
  hintsUsed: number;
  attempts: number;
  timeToComplete: number; // in seconds
}

export interface UserPerformanceMetrics {
  avgHintsUsed: number;
  avgAttempts: number;
  avgTimeToComplete: number;
}

export interface QuestionAttempt {
  code: string;
  timestamp: number;
  wasSuccessful: boolean;
}

export interface TutorState {
  currentQuestion: Question | null;
  userCode: string;
  hints: Hint[];
  showingHint: boolean;
  progress: Progress;
  isLoading: boolean;
  evaluation: AnswerEvaluation | null;
  
  // Enhanced state for LLM integration
  attemptHistory: AttemptHistory[];
  currentAttempts: QuestionAttempt[];
  questionStartTime: number | null;
  isGeneratingQuestion: boolean;
  isGeneratingHint: boolean;
  lastQuestionData: {
    id: string;
    concepts: string[];
    difficulty: string;
    wasCorrect: boolean;
    hintsUsed: number;
    attempts: number;
  } | null;
  llmProvider: 'claude' | 'openai';
  encouragementMessage?: string;
}