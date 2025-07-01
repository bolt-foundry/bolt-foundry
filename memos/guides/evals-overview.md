# Bolt Foundry Evals

> "The user said x. Our assistant replied y. Is that actually useful?"

## Overview

Bolt Foundry Evals helps developers create graders to test the outputs of LLMs
across multiple underlying base models.

## Features

- **Custom Graders**: Create specialized graders using a standard DSL to easily
  create and update criteria and output formats.
- **Multi-Model Evaluation**: Grader responses across multiple LLMs
  simultaneously to compare performance and consistency (powered by Open Router)
- **Parallel Execution**: Run evaluations concurrently for faster results across
  multiple models and iterations
- **Meta Grader Analysis**: Calibrate and validate grader quality using ground
  truth scores to ensure consistent and accurate evaluations

## Quickstart

Set your `OPENROUTER_API_KEY` environment variable.

```bash
aibff calibrate --help
```

Run evaluation with sample data:

```bash
npx bff-eval --input examples/json-validator/samples.jsonl \
         --grader examples/json-validator/grader.js
```

## Input data

Provide input data as a file in JSONL format.

```jsonl
{"messages": [{"role": "user", "content": "Extract user info from: 'John Doe, 30, NYC'"}, {"role": "assistant", "content": "{\"name\":\"John Doe\",\"age\":30,\"city\":\"NYC\"}"}]}
{"messages": [{"role": "user", "content": "Parse address: '123 Main St'"}, {"role": "assistant", "content": "{\"street\":\"123 Main St\"}"}]}
```

The types for the input data are:

```typescript
type Sample = {
  messages: Array<{
    role: string;
    content: string;
  }>;
  id?: string;
  score?: number; // Optional: expected score for meta-evaluation (-3 to 3)
  metadata?: Record<string, unknown>; // your custom metadata to forward along to the reporter
};

type InputSampleFile = Array<Sample>;
```

## Create your grader

Graders let you build your eval logic in a structured way. Read more on our
[prompting philosophy](../../docs/guides/improving-inference-philosophy.md), or
the [case studies](case-studies.md) as to why we've done it this way.

1. Structure your grader with an initial spec explaining what your grader will
   do.
2. Add cards to explain evaluation criteria
3. Include any variables as context, INCLUDING OUTPUT FORMAT.

To be clear, you SHOULD NOT BE INTERPOLATING ANY STRINGS IN THE SPECS. Use
`.context` builders to safely include variables.

```typescript
import { makeGraderDeckBuilder } from "@bolt-foundry/bolt-foundry";

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
// - Appends evaluation context (messages array, expected)
// - Adds output format requirements (JSON with score and notes)
// - Handles all the boilerplate for grader evaluation
```

## Model Selection

Specify the model to use for evaluation using the `--model` flag:

```bash
aibff calibrate --input data.jsonl --grader grader.ts --model openai/gpt-4o  # Default
aibff calibrate --input data.jsonl --grader grader.ts --model anthropic/claude-3-opus
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
    score: 3  // If provided in input
  }
}
```

## Meta Grader Analysis

Bolt Foundry Evals supports "grading the grader" by comparing grader scores
against expected scores. This calibration feature helps you:

1. **Validate Grader Quality**: Ensure your graders score consistently and
   accurately
2. **Improve Grader Criteria**: Identify areas where grader instructions need
   refinement
3. **Compare Grader Versions**: Measure improvements when updating graders

### Adding Expected Scores

Include a `score` field in your input samples:

```jsonl
{"messages": [{"role": "user", "content": "Extract: name=John"}, {"role": "assistant", "content": "{\"name\":\"John\"}"}], "score": 3}
{"messages": [{"role": "user", "content": "Parse: color=red"}, {"role": "assistant", "content": "{'color': 'red'}"}], "score": 2}
{"messages": [{"role": "user", "content": "Convert: email=test@test.com"}, {"role": "assistant", "content": "test@test.com"}], "score": -3}
```

### Calibration Metrics

When expected scores are provided, the eval command reports:

- **Exact Match Rate**: Percentage of samples where grader score equals expected
  score
- **Within ±1 Accuracy**: Percentage of samples within 1 point of expected score
- **Average Absolute Error**: Mean difference between grader and expected scores
- **Disagreements**: Specific samples where grader and expected score differ

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
