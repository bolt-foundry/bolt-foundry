import { generateEvaluationHtml } from "./utils/toml-to-html.ts";

const testData = {
  graderResults: {
    "test-grader": {
      grader: "test.deck.md",
      model: "test-model",
      timestamp: "2025-06-17T14:00:00.000Z",
      samples: 1,
      average_distance: 0,
      results: [{
        id: "test",
        grader_score: 2,
        truth_score: 2,
        notes: "Test reasoning",
        userMessage: "Test user message",
        assistantResponse: "Test assistant response",
        rawOutput: '{"score": 2, "reason": "This is a very long reasoning text that could potentially be hundreds of characters long and cause horizontal scrolling issues in the HTML output when displayed in a pre tag without proper word wrapping or formatting applied to handle long strings gracefully"}',
        graderMetadata: {
          verbosePrompt: "Test prompt"
        }
      }]
    }
  }
};

const html = generateEvaluationHtml(testData);
await Deno.writeTextFile("test-output.html", html);
console.log("HTML written to test-output.html");