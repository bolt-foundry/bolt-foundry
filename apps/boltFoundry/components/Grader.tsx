import { useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsLiteButton } from "apps/bfDsLite/components/BfDsLiteButton.tsx";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

type GraderResult = {
  id: string;
  text: string;
  rating: "thumbs-up" | "thumbs-down" | null;
};

type GraderPromptForm = {
  prompt: string;
};

export const Grader = iso(`
field Query.Grader @component {
  __typename
  }
`)(function Grader() {
  const [prompt, setPrompt] = useState<string>("");
  const [results, setResults] = useState<Array<GraderResult>>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunGrader = () => {
    if (!prompt.trim()) return;

    setIsRunning(true);
    logger.info("Running grader with prompt:", prompt);

    // Simulate running the grader and generating results
    // In a real implementation, this would call an API
    setTimeout(() => {
      const mockResults: Array<GraderResult> = [
        {
          id: "1",
          text: "You're dumb, water is liquid",
          rating: null,
        },
        {
          id: "2",
          text: "Nice try, water is a liquid. You'll get it.",
          rating: null,
        },
        {
          id: "3",
          text:
            "Water is indeed a liquid at room temperature and atmospheric pressure.",
          rating: null,
        },
      ];
      setResults(mockResults);
      setIsRunning(false);
    }, 1500);
  };

  const handleRating = (
    resultId: string,
    rating: "thumbs-up" | "thumbs-down",
  ) => {
    setResults((prev) =>
      prev.map((result) =>
        result.id === resultId ? { ...result, rating } : result
      )
    );
    logger.info(`Rated result ${resultId} as ${rating}`);
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "var(--bfds-lite-text, #000)",
          }}
        >
          Grader
        </h1>
        <p
          style={{
            color: "var(--bfds-lite-text-secondary, #666)",
            fontSize: "1rem",
          }}
        >
          Enter a prompt and rate the generated responses
        </p>
      </div>

      {/* Prompt Input Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="grader-prompt"
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              color: "var(--bfds-lite-text, #000)",
            }}
          >
            Prompt
          </label>
          <textarea
            id="grader-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid var(--bfds-lite-border, #ddd)",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              minHeight: "120px",
            }}
          />
        </div>

        <BfDsLiteButton
          variant="primary"
          onClick={handleRunGrader}
          disabled={!prompt.trim() || isRunning}
        >
          {isRunning ? "Running..." : "Go"}
        </BfDsLiteButton>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--bfds-lite-text, #000)",
            }}
          >
            Results
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "0",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {results.map((result) => (
              <li
                key={result.id}
                style={{
                  padding: "16px",
                  border: "1px solid var(--bfds-lite-border, #ddd)",
                  borderRadius: "8px",
                  backgroundColor: "var(--bfds-lite-background, #000)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "var(--bfds-lite-text, #000)",
                    }}
                  >
                    {result.text}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <BfDsLiteButton
                    variant={result.rating === "thumbs-up"
                      ? "primary"
                      : "ghost"}
                    size="small"
                    icon="thumbUp"
                    iconOnly
                    onClick={() => handleRating(result.id, "thumbs-up")}
                    title="Good response"
                  />
                  <BfDsLiteButton
                    variant={result.rating === "thumbs-down"
                      ? "primary"
                      : "ghost"}
                    size="small"
                    icon="thumbDown"
                    iconOnly
                    onClick={() => handleRating(result.id, "thumbs-down")}
                    title="Bad response"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isRunning && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--bfds-lite-text-secondary, #666)",
          }}
        >
          Enter a prompt above and click "Go" to see results
        </div>
      )}

      {/* Loading State */}
      {isRunning && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--bfds-lite-text-secondary, #666)",
          }}
        >
          Generating results...
        </div>
      )}
    </div>
  );
});
