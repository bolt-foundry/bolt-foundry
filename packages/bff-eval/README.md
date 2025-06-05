# bff-eval

Node.js CLI for running LLM evaluations with graders.

## Installation

```bash
npm install -g bff-eval
# or use directly with npx
npx bff-eval --help
```

## Usage

```bash
# Basic usage
bff-eval --input samples.jsonl --grader grader.js

# With specific model
bff-eval --input samples.jsonl --grader grader.js --model openai/gpt-4

# Save results to file
bff-eval --input samples.jsonl --grader grader.js --output results.json

# Verbose output
bff-eval --input samples.jsonl --grader grader.js --verbose
```

## Environment Variables

- `OPENROUTER_API_KEY` - Required. Your OpenRouter API key for LLM access.

## Input Format

The input file should be JSONL (JSON Lines) format with the following structure:

```jsonl
{"id": "1", "userMessage": "What is 2+2?", "assistantResponse": "4", "score": 3}
{"id": "2", "userMessage": "What is the capital of France?", "assistantResponse": "London", "score": -2}
```

Fields:

- `id` (optional) - Unique identifier for the sample
- `userMessage` or `prompt` - The user's input
- `assistantResponse` or `completion` - The AI's response
- `score` (optional) - Expected score for calibration metrics

## Grader Format

Graders should be CommonJS modules that export a DeckBuilder:

```javascript
const { makeGraderDeckBuilder } = require("@bolt-foundry/evals");

const grader = makeGraderDeckBuilder("accuracy-grader")
  .card(
    "criteria",
    (c) =>
      c.spec("Evaluate the accuracy of the assistant response")
        .spec("Score from -3 (completely wrong) to 3 (perfectly accurate)"),
  );

module.exports = grader;
```

## Output

The CLI displays results in a table format and optionally saves detailed JSON
output.

Metrics (when expected scores are provided):

- Exact match rate
- Within ±1 accuracy
- Average error

## License

MIT
