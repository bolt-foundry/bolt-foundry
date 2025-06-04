# Bolt Foundry Evals

> "The user said x. Our assistant replied y. Is that actually useful?"

## Overview

Bolt Foundry Evals helps developers create judges to test the outputs of LLMs
across multiple underlying base models.

## Features

- **Custom Judge Decks**: Create specialized judges using a standard DSL to
  easily create and update criteria and output formats.
- **Multi-Model Evaluation**: Judge responses across multiple LLMs
  simultaneously to compare performance and consistency (powered by Open Router)
- **Parallel Execution**: Run evaluations concurrently for faster results across
  multiple models and iterations
- **Meta Judge Analysis**: Calibrate and validate judge quality using ground
  truth scores to ensure consistent and accurate evaluations

## Quickstart

Set your `OPENROUTER_API_KEY` environment variable.

```bash
npx bff-eval --help
```

Run our simple json sample:

```bash
npm bff-eval --DEMO
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
  groundTruthScore?: number; // Optional: expected score for meta-evaluation (-3 to 3)
  sampleMetadata?: Record<string, unknown>; // your custom metadata to forward along to the reporter
};

type InputSampleFile = Array<Sample>;
```

## Create your judge using judge decks

Judge decks let you build your eval logic in a structured way. Read more on our
[prompting philosophy], or the [case studies] as to why we've done it this way.

1. Structure your deck with an initial spec explaining what your judge will do.
2. Add cards to explain evaluation criteria
3. Include any variables as context, INCLUDING OUTPUT FORMAT.

To be clear, you SHOULD NOT BE INTERPOLATING ANY STRINGS IN THE SPECS. Use
`.context` builders to safely include variables. [See why].

```typescript
import { makeJudgeDeck } from "@bolt-foundry/bolt-foundry";

// Create a judge that evaluates JSON outputs

// outputFormat should be a json string right now, we'll try to make it zod soon.
export default function createJsonJudge(outputFormat: string) {
  return makeJudgeDeck("json-validator")
    .spec(
      "You are an expert at evaluating JSON outputs for correctness and completeness.",
    )
    .card(
      "evaluation criteria",
      (c) =>
        c.spec("Check if the output is valid JSON syntax")
          .spec("Verify all required fields are present")
          .spec("Ensure data types match expected schema"),
    );
  // automatically included from the makeJudgeDeck builder
  // .card(
  //   "Scoring instructions",
  //   (c) =>
  //     c.spec("something we figure out soon")
  // )
  // .context(
  //   "Judge input",
  //   (c) =>
  //     c.string("userMessage", "What was the original prompt?")
  //       .string("assistantResponse", "What was the LLM response to evaluate?")
  //       .object("expectedSchema", "What is the expected JSON schema?"),
  // );
  // .context("Output format", (c) => {
  //   c.string("outputFormat", "How would you like to output the result?", "")
  // })
}
```

## Model Selection

You can pick models to judge against, or we can pick random ones for you. You
can filter the random ones by criteria you'd like. Our default filter skips free
models, because they're the most likely to fail w/ tos stuff on open router.

## Output Formats

Evaluations produce results that look like this:

```typescript
type JudgementResult<TOutputType = Record<string, unknown>, TSampleMetadata = Record<string, never>> = {
  model: string,
  id?: string,
  iteration: number,
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3,
  latencyInMs: number,
  rawOutput: string,
  output: TOutputType,
  sampleMetadata: TSampleMetadata,
}

{
  model: "gpt-4",
  sampleId: "sample-001",
  iteration: 1,
  score: 3, // +3 to -3
  latency: 1234,  // milliseconds
  output: "raw model response",
  parsed: { /* parsed JSON if applicable */ },
  sampleMetadata: {
    your: "keys and values"
  }
}
```

## Meta Judge Analysis

Bolt Foundry Evals supports "judging the judge" by comparing judge scores
against ground truth scores. This calibration feature helps you:

1. **Validate Judge Quality**: Ensure your judges score consistently and
   accurately
2. **Improve Judge Criteria**: Identify areas where judge instructions need
   refinement
3. **Compare Judge Versions**: Measure improvements when updating judge decks

### Adding Ground Truth Scores

Include a `groundTruthScore` field in your input samples:

```jsonl
{"userMessage": "Extract: name=John", "assistantResponse": "{\"name\":\"John\"}", "groundTruthScore": 3}
{"userMessage": "Parse: color=red", "assistantResponse": "{'color': 'red'}", "groundTruthScore": 2}
{"userMessage": "Convert: email=test@test.com", "assistantResponse": "test@test.com", "groundTruthScore": -3}
```

### Calibration Metrics

When ground truth scores are provided, the eval command reports:

- **Exact Match Rate**: Percentage of samples where judge score equals ground
  truth
- **Within ±1 Accuracy**: Percentage of samples within 1 point of ground truth
- **Average Absolute Error**: Mean difference between judge and ground truth
  scores
- **Disagreements**: Specific samples where judge and ground truth differ

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
