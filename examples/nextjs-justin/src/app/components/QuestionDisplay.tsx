"use client";

import { Question } from "../types/tutor";

interface QuestionDisplayProps {
  question: Question;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{question.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            getDifficultyColor(question.difficulty)
          }`}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {question.description}
      </p>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Concepts:</h3>
        <div className="flex flex-wrap gap-2">
          {question.concepts.map((concept, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
