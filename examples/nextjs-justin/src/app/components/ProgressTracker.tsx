"use client";

import { Progress } from "../types/tutor";

interface ProgressTrackerProps {
  progress: Progress;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const completionPercentage = progress.totalQuestions > 0
    ? (progress.questionsCompleted / progress.totalQuestions) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Your Progress
      </h3>

      <div className="space-y-4">
        {/* Completion Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Questions Completed
            </span>
            <span className="text-sm text-gray-600">
              {progress.questionsCompleted} / {progress.totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            >
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {completionPercentage.toFixed(1)}% Complete
          </span>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-center">
            <span className="text-orange-600 mr-2">🔥</span>
            <span className="text-sm font-medium text-gray-700">
              Current Streak
            </span>
          </div>
          <span className="text-lg font-bold text-orange-600">
            {progress.currentStreak}
          </span>
        </div>

        {/* Concepts Learned */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Concepts Learned ({progress.conceptsLearned.length})
          </h4>
          {progress.conceptsLearned.length > 0
            ? (
              <div className="flex flex-wrap gap-2">
                {progress.conceptsLearned.map((concept, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                  >
                    ✓ {concept}
                  </span>
                ))}
              </div>
            )
            : (
              <p className="text-sm text-gray-500">
                Complete your first question to start learning concepts!
              </p>
            )}
        </div>

        {/* Motivational Message */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-sm text-purple-800 text-center">
            {getMotivationalMessage(progress)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getMotivationalMessage(progress: Progress): string {
  if (progress.questionsCompleted === 0) {
    return "🚀 Ready to start your JavaScript journey? Let's code!";
  } else if (progress.currentStreak >= 5) {
    return "🔥 You're on fire! Keep up the amazing work!";
  } else if (progress.questionsCompleted >= progress.totalQuestions / 2) {
    return "🎯 Halfway there! You're doing great!";
  } else if (progress.conceptsLearned.length >= 3) {
    return "🧠 Great job learning new concepts!";
  } else {
    return "💪 Keep coding, you're building real skills!";
  }
}
