"use client";

import { useEffect, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  onRun,
  placeholder = "// Write your JavaScript code here...",
  isLoading = false,
}: CodeEditorProps) {
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const runCode = () => {
    setOutput("");
    setError("");

    try {
      // Create a simple console mock to capture output
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        },
      };

      // Create a function with the user's code
      const userFunction = new Function("console", value);
      userFunction(mockConsole);

      setOutput(logs.join("\n") || "Code executed successfully (no output)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }

    onRun();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      runCode();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Code Editor</h3>
        <button
          onClick={runCode}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="mb-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-48 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
        <p className="text-sm text-gray-500 mt-2">
          Press Ctrl+Enter to run your code
        </p>
      </div>

      {(output || error) && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Output:</h4>
          <div
            className={`p-4 rounded-md font-mono text-sm ${
              error
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-gray-50 text-gray-800 border border-gray-200"
            }`}
          >
            {error || output}
          </div>
        </div>
      )}
    </div>
  );
}
