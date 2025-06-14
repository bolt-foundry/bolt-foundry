"use client";

import { Hint } from "../types/tutor";

interface HintSystemProps {
  hints: Hint[];
  onRequestHint: () => void;
  isLoading?: boolean;
}

export default function HintSystem(
  { hints, onRequestHint, isLoading = false }: HintSystemProps,
) {
  const sortedHints = hints.sort((a, b) => a.level - b.level);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">💡 Hints</h3>
        <button
          onClick={onRequestHint}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Getting Hint..." : "Get Hint"}
        </button>
      </div>

      {hints.length === 0
        ? (
          <p className="text-gray-500 text-center py-8">
            Click "Get Hint" when you need help with the current problem.
          </p>
        )
        : (
          <div className="space-y-3">
            {sortedHints.map((hint, index) => (
              <div
                key={hint.id}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-md"
              >
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white text-sm font-bold rounded-full mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-800 leading-relaxed">{hint.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      {hints.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong>{" "}
            Try to solve as much as you can before asking for more hints.
            Learning happens when you struggle a bit!
          </p>
        </div>
      )}
    </div>
  );
}
