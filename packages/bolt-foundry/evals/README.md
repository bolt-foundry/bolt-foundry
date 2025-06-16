# Bolt Foundry Evals

> "The user said x. Our assistant replied y. Is that actually useful?"

## Overview

Bolt Foundry Evals helps developers create graders to test the outputs of LLMs
across multiple underlying base models.

## Features

- **Interactive REPL**: Build and refine graders interactively with immediate
  feedback
- **Custom Graders**: Create specialized graders using a standard DSL to easily
  create and update criteria and output formats
- **Multi-Model Evaluation**: Grader responses across multiple LLMs
  simultaneously to compare performance and consistency (powered by Open Router)
- **Parallel Execution**: Run evaluations concurrently for faster results across
  multiple models and iterations
- **Meta Grader Analysis**: Calibrate and validate grader quality using ground
  truth scores to ensure consistent and accurate evaluations

## Getting Started

### Interactive Mode (Recommended)

The easiest way to get started is with the interactive REPL:

```bash
aibff
```

This launches an interactive experience that guides you through:

- Creating graders from examples
- Testing graders against sample data
- Refining evaluation criteria
- Exporting production-ready code

### Programmatic Usage

Set your `OPENROUTER_API_KEY` environment variable.

For automation and CI/CD workflows, you can use the command line interface:

```bash
# Using aibff directly
aibff eval --input packages/bolt-foundry/evals/examples/sample-data.jsonl \
           --grader packages/bolt-foundry/evals/examples/json-validator.ts

# Or using the npm wrapper
npx bff-eval --input packages/bolt-foundry/evals/examples/sample-data.jsonl \
             --grader packages/bolt-foundry/evals/examples/json-validator.ts
```

## Input data

Provide input data as a file in JSONL format.

```jsonl
{"userMessage": "Extract user info from: 'John Doe, 30, NYC'", "assistantResponse": "{\"name\":\"John Doe\",\"age\":30,\"city\":\"NYC\"}"}
{"userMessage": "Parse address: '123 Main St'", "assistantResponse": "{\"street\":\"123 Main St\"}"}
```

The types for the input data are:

```typescript
type Sample = {
  userMessage: string;
  assistantResponse: string;
  id?: string;
  score?: number; // Optional: expected score for meta-evaluation (-3 to 3)
  metadata?: Record<string, unknown>; // your custom metadata to forward along to the reporter
};

type InputSampleFile = Array<Sample>;
```

## Create your grader

Graders let you build your eval logic in a structured way. Read more on our
[prompting philosophy], or the [case studies] as to why we've done it this way.

1. Structure your grader with an initial spec explaining what your grader will
   do.
2. Add cards to explain evaluation criteria
3. Include any variables as context, INCLUDING OUTPUT FORMAT.

To be clear, you SHOULD NOT BE INTERPOLATING ANY STRINGS IN THE SPECS. Use
`.context` builders to safely include variables. [See why].

```typescript
import { makeGraderDeckBuilder } from "../makeGraderDeckBuilder.ts";

// Create a grader that evaluates JSON outputs
export default makeGraderDeckBuilder("json-validator")
  .spec(
    "You are an expert at evaluating JSON outputs for correctness and completeness.",
  )
  .card(
    "evaluation criteria",
    (c) =>
      c.spec("Check if the output is valid JSON syntax")
        .spec("Verify all required fields are present")
        .spec("Ensure data types match expected schema"),
  )
  .card(
    "scoring guidelines",
    (c) =>
      c.spec(
        "Score 3: Perfect - Strict valid JSON that exactly matches the expected schema",
      )
        .spec(
          "Score 2: Good - Valid JSON but uses relaxed syntax (single quotes, trailing commas, etc)",
        )
        .spec(
          "Score 1: Acceptable - Valid JSON but has missing optional fields",
        )
        .spec(
          "Score -1: Poor - Valid JSON but has hallucinated/extra keys not in the input",
        )
        .spec(
          "Score -3: Failure - Not JSON at all, plain text, or doesn't parse",
        ),
  );

// Note: The makeGraderDeckBuilder automatically:
// - Appends evaluation context (userMessage, assistantResponse, expected)
// - Adds output format requirements (JSON with score and notes)
// - Handles all the boilerplate for grader evaluation
```

## Working with Evals

### Interactive Workflow

When using `aibff` in interactive mode:

1. **Start with examples**: Provide examples of good and bad outputs with scores
2. **Generate grader**: The system creates a grader based on your examples
3. **Test immediately**: Run the grader against your samples
4. **Refine iteratively**: Adjust criteria and re-test until satisfied
5. **Export**: Save your grader and samples for production use

### Command Line Workflow

#### Model Selection

Specify the model to use for evaluation using the `--model` flag:

```bash
aibff eval --input data.jsonl --grader grader.ts --model openai/gpt-4o  # Default
aibff eval --input data.jsonl --grader grader.ts --model anthropic/claude-3-opus
```

The evaluation uses OpenRouter API, so any model available on OpenRouter can be
used.

## Output Formats

Evaluations produce results that look like this:

```typescript
export interface GradingResult {
  model: string;
  id?: string;
  iteration: number;
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  latencyInMs: number;
  rawOutput: string;
  output: {
    score: number;
    notes?: string;
  };
  sampleMetadata?: Record<string, unknown>;
}

// Example result:
{
  model: "openai/gpt-4o",
  id: "sample-001",
  iteration: 1,
  score: 3,
  latencyInMs: 1234,
  rawOutput: "{\"score\": 3, \"notes\": \"Perfect JSON with correct schema\"}",
  output: {
    score: 3,
    notes: "Perfect JSON with correct schema"
  },
  sampleMetadata: {
    groundTruthScore: 3  // If provided in input
  }
}
```

## Meta Grader Analysis

Bolt Foundry Evals supports "grading the grader" by comparing grader scores
against ground truth scores. This calibration feature helps you:

1. **Validate Grader Quality**: Ensure your graders score consistently and
   accurately
2. **Improve Grader Criteria**: Identify areas where grader instructions need
   refinement
3. **Compare Grader Versions**: Measure improvements when updating graders

### Adding Ground Truth Scores

Include a `score` field in your input samples:

```jsonl
{"userMessage": "Extract: name=John", "assistantResponse": "{\"name\":\"John\"}", "score": 3}
{"userMessage": "Parse: color=red", "assistantResponse": "{'color': 'red'}", "score": 2}
{"userMessage": "Convert: email=test@test.com", "assistantResponse": "test@test.com", "score": -3}
```

### Calibration Metrics

When ground truth scores are provided, the eval command reports:

- **Exact Match Rate**: Percentage of samples where grader score equals ground
  truth
- **Within ±1 Accuracy**: Percentage of samples within 1 point of ground truth
- **Average Absolute Error**: Mean difference between grader and ground truth
  scores
- **Disagreements**: Specific samples where grader and ground truth differ

### Example: Improving a JSON Validator

Using calibration data, we improved our JSON validator from 60% to 90% accuracy:

**Version 1** (vague criteria):

```
Exact Match Rate: 60% (6/10)
Average Error: 0.80
```

**Version 2** (precise criteria):

```
Exact Match Rate: 90% (9/10)
Average Error: 0.30
```

The key improvements:

- Clearly distinguished between strict JSON (double quotes) and relaxed syntax
  (single quotes)
- Specified exact scoring for different failure modes (-1 for extra keys, -3 for
  non-JSON)
- Added precise handling of edge cases (e.g., empty JSON when data expected)
