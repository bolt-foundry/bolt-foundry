"use client";

import { useEffect, useState } from "react";
import {
  AnswerEvaluation,
  AttemptHistory,
  Hint,
  Progress,
  Question,
  QuestionAttempt,
  TutorState,
} from "../types/tutor";
import { llmService } from "../services/llmService";
import QuestionDisplay from "./QuestionDisplay";
import CodeEditor from "./CodeEditor";
import HintSystem from "./HintSystem";
import ProgressTracker from "./ProgressTracker";
import LoadingSpinner from "./LoadingSpinner";

// Fallback questions if LLM is unavailable
const fallbackQuestions: Question[] = [
  {
    id: "fallback-1",
    title: "Hello World",
    description: 'Write a function that logs "Hello, World!" to the console.',
    starterCode: "function sayHello() {\n  // Your code here\n}\n\nsayHello();",
    solution:
      'function sayHello() {\n  console.log("Hello, World!");\n}\n\nsayHello();',
    difficulty: "beginner",
    concepts: ["functions", "console.log", "basic syntax"],
  },
];

export default function JavaScriptTutor() {
  const [state, setState] = useState<TutorState>({
    currentQuestion: null,
    userCode: "",
    hints: [],
    showingHint: false,
    progress: {
      questionsCompleted: 0,
      totalQuestions: 0, // Dynamic based on curriculum
      currentStreak: 0,
      conceptsLearned: [],
    },
    isLoading: false,
    evaluation: null,

    // Enhanced state for LLM integration
    attemptHistory: [],
    currentAttempts: [],
    questionStartTime: null,
    isGeneratingQuestion: false,
    isGeneratingHint: false,
    lastQuestionData: null,
    llmProvider: "claude",
    encouragementMessage: undefined,
  });

  // Initialize with first LLM-generated question
  useEffect(() => {
    generateFirstQuestion();
  }, []);

  const generateFirstQuestion = async () => {
    setState((prev) => ({ ...prev, isGeneratingQuestion: true }));

    try {
      const question = await llmService.generateQuestion({
        userProgress: {
          questionsCompleted: 0,
          currentStreak: 0,
          conceptsLearned: [],
          recentPerformance: {
            avgHintsUsed: 0,
            avgAttempts: 0,
            avgTimeToComplete: 0,
          },
        },
        preferredProvider: state.llmProvider,
      });

      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        userCode: question.starterCode,
        questionStartTime: Date.now(),
        isGeneratingQuestion: false,
      }));
    } catch (error) {
      console.error("Failed to generate first question:", error);
      // Fallback to static question
      const fallbackQuestion = fallbackQuestions[0];
      setState((prev) => ({
        ...prev,
        currentQuestion: fallbackQuestion,
        userCode: fallbackQuestion.starterCode,
        questionStartTime: Date.now(),
        isGeneratingQuestion: false,
      }));
    }
  };

  const handleRequestHint = async () => {
    if (!state.currentQuestion) return;

    setState((prev) => ({
      ...prev,
      isGeneratingHint: true,
    }));

    try {
      const hintResponse = await llmService.generateHint({
        question: state.currentQuestion,
        userCode: state.userCode,
        previousHints: state.hints,
        userProgress: {
          questionsCompleted: state.progress.questionsCompleted,
          currentStreak: state.progress.currentStreak,
          conceptsLearned: state.progress.conceptsLearned,
        },
        attemptHistory: state.currentAttempts,
        preferredProvider: state.llmProvider,
      });

      setState((prev) => ({
        ...prev,
        hints: [...prev.hints, ...hintResponse.hints],
        encouragementMessage: hintResponse.encouragement,
        isGeneratingHint: false,
      }));

      // If solution should be shown, add it to evaluation
      if (hintResponse.shouldShowSolution) {
        setState((prev) => ({
          ...prev,
          evaluation: {
            correct: false,
            feedback: "Here's the solution to help you learn:",
            suggestions: [state.currentQuestion!.solution],
          },
        }));
      }
    } catch (error) {
      console.error("Failed to generate hint:", error);
      // Fallback hint
      const fallbackHint: Hint = {
        id: `hint-${Date.now()}`,
        text:
          "Try thinking about what the function should do step by step. What's the first thing you need to do?",
        level: state.hints.length + 1,
      };

      setState((prev) => ({
        ...prev,
        hints: [...prev.hints, fallbackHint],
        isGeneratingHint: false,
      }));
    }
  };

  const evaluateAnswer = (code: string): AnswerEvaluation => {
    if (!state.currentQuestion) {
      return { correct: false, feedback: "No question selected" };
    }

    // Record this attempt
    const attempt: QuestionAttempt = {
      code,
      timestamp: Date.now(),
      wasSuccessful: false, // Will be updated below
    };

    // Simple evaluation - check if code has meaningful content and try to run it
    const hasContent =
      code.trim().length > state.currentQuestion.starterCode.trim().length;
    const hasFunction = code.includes("function") || code.includes("=>");

    let isCorrect = false;
    let feedback = "";

    try {
      // Try to execute the code to see if it runs without errors
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        },
      };

      const userFunction = new Function("console", code);
      userFunction(mockConsole);

      // If it executes and produces output, consider it correct
      if (logs.length > 0 && hasContent && hasFunction) {
        isCorrect = true;
        feedback =
          "Excellent! Your code runs successfully and produces output.";
      } else if (hasContent && hasFunction) {
        feedback =
          "Your code runs without errors, but make sure it produces the expected output.";
      } else {
        feedback =
          "Your code needs more work. Make sure you implement the function properly.";
      }
    } catch (error) {
      feedback =
        "There's a syntax error in your code. Check your syntax and try again.";
    }

    attempt.wasSuccessful = isCorrect;

    setState((prev) => ({
      ...prev,
      currentAttempts: [...prev.currentAttempts, attempt],
    }));

    return { correct: isCorrect, feedback };
  };

  const handleRunCode = () => {
    const evaluation = evaluateAnswer(state.userCode);
    setState((prev) => ({
      ...prev,
      evaluation,
    }));

    if (evaluation.correct) {
      // Update progress and record successful completion
      const newConcepts = state.currentQuestion?.concepts || [];
      const timeToComplete = state.questionStartTime
        ? (Date.now() - state.questionStartTime) / 1000
        : 0;

      // Record this question in attempt history
      const attemptRecord: AttemptHistory = {
        questionId: state.currentQuestion!.id,
        code: state.userCode,
        timestamp: Date.now(),
        wasSuccessful: true,
        hintsUsed: state.hints.length,
        attempts: state.currentAttempts.length + 1,
        timeToComplete,
      };

      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          questionsCompleted: prev.progress.questionsCompleted + 1,
          currentStreak: prev.progress.currentStreak + 1,
          conceptsLearned: [
            ...new Set([...prev.progress.conceptsLearned, ...newConcepts]),
          ],
        },
        attemptHistory: [...prev.attemptHistory, attemptRecord],
        lastQuestionData: {
          id: state.currentQuestion!.id,
          concepts: state.currentQuestion!.concepts,
          difficulty: state.currentQuestion!.difficulty,
          wasCorrect: true,
          hintsUsed: state.hints.length,
          attempts: state.currentAttempts.length + 1,
        },
      }));
    }
  };

  const handleNextQuestion = async () => {
    if (!state.currentQuestion) return;

    setState((prev) => ({ ...prev, isGeneratingQuestion: true }));

    try {
      // Calculate performance metrics
      const recentPerformance = llmService.calculatePerformanceMetrics(
        state.attemptHistory,
      );

      const question = await llmService.generateQuestion({
        userProgress: {
          questionsCompleted: state.progress.questionsCompleted,
          currentStreak: state.progress.currentStreak,
          conceptsLearned: state.progress.conceptsLearned,
          recentPerformance,
        },
        lastQuestion: state.lastQuestionData || undefined,
        preferredProvider: state.llmProvider,
      });

      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        userCode: question.starterCode,
        hints: [],
        evaluation: null,
        currentAttempts: [],
        questionStartTime: Date.now(),
        isGeneratingQuestion: false,
        encouragementMessage: undefined,
      }));
    } catch (error) {
      console.error("Failed to generate next question:", error);
      setState((prev) => ({ ...prev, isGeneratingQuestion: false }));
      // Could show error message to user here
    }
  };

  if (!state.currentQuestion && state.isGeneratingQuestion) {
    return <LoadingSpinner message="Generating your first question..." />;
  }

  if (!state.currentQuestion) {
    return <LoadingSpinner message="Loading JavaScript Tutor..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⚡ JavaScript Tutor
          </h1>
          <p className="text-lg text-gray-600">
            Learn JavaScript through AI-powered, adaptive challenges
          </p>

          {/* LLM Provider Selector */}
          <div className="mt-4">
            <label className="text-sm text-gray-600 mr-2">AI Provider:</label>
            <select
              value={state.llmProvider}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  llmProvider: e.target.value as "claude" | "openai",
                }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="openai">GPT (OpenAI)</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Question and Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            <QuestionDisplay question={state.currentQuestion} />
            <CodeEditor
              value={state.userCode}
              onChange={(value) =>
                setState((prev) => ({ ...prev, userCode: value }))}
              onRun={handleRunCode}
              isLoading={state.isLoading || state.isGeneratingQuestion}
            />

            {/* Encouragement Message */}
            {state.encouragementMessage && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-purple-800 text-center">
                  💪 {state.encouragementMessage}
                </p>
              </div>
            )}

            {/* Answer Evaluation */}
            {state.evaluation && (
              <div
                className={`p-4 rounded-lg ${
                  state.evaluation.correct
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h4
                  className={`font-semibold mb-2 ${
                    state.evaluation.correct ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {state.evaluation.correct
                    ? "✅ Correct!"
                    : "❌ Not Quite Right"}
                </h4>
                <p
                  className={state.evaluation.correct
                    ? "text-green-700"
                    : "text-red-700"}
                >
                  {state.evaluation.feedback}
                </p>
                {state.evaluation.suggestions && (
                  <div className="mt-2">
                    {state.evaluation.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="mt-2 p-2 bg-gray-100 rounded text-gray-800 font-mono text-sm"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                {state.evaluation.correct && (
                  <button
                    onClick={handleNextQuestion}
                    disabled={state.isGeneratingQuestion}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {state.isGeneratingQuestion
                      ? "Generating Next Question..."
                      : "Next Question →"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Hints and Progress */}
          <div className="space-y-6">
            <ProgressTracker progress={state.progress} />
            <HintSystem
              hints={state.hints}
              onRequestHint={handleRequestHint}
              isLoading={state.isGeneratingHint}
            />

            {/* Performance Insights */}
            {state.attemptHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  📈 Your Performance
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Questions completed: {state.attemptHistory.length}</p>
                  <p>
                    Average hints used: {(state.attemptHistory.reduce(
                      (sum, h) => sum + h.hintsUsed,
                      0,
                    ) / state.attemptHistory.length).toFixed(1)}
                  </p>
                  <p>
                    Average attempts: {(state.attemptHistory.reduce(
                      (sum, h) => sum + h.attempts,
                      0,
                    ) / state.attemptHistory.length).toFixed(1)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
