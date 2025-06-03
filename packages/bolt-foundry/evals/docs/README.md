# Bolt Foundry Evaluation Framework

## Overview

The Bolt Foundry evaluation framework extends the deck system to enable
systematic evaluation of LLM outputs across multiple models. Built on
OpenRouter's multi-model API, it provides a flexible platform for creating
custom judges and running parallel evaluations.

## Features

- **Multi-Model Evaluation**: Judge responses across multiple LLMs
  simultaneously to compare performance and consistency
- **Parallel Execution**: Run evaluations concurrently for faster results across
  multiple models and iterations
- **Custom Judge Decks**: Create specialized judges using a standard DSL to
  easily create and update criteria and output formats.

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
.context builders to safely include variables. [See why].

```typescript
import { makeJudgeDeck } from "@bolt-foundry/bolt-foundry";

// Create a judge that evaluates JSON outputs
export default function createJsonJudge() {
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
    )
    // automatically included from the makeJudgeDeck builder
    // .card(
    //   "Scoring instructions",
    //   (c) => 
    //     c.spec("something we figure out soon")
    // )
    .context("Judge input", (c) =>
      c.string("userMessage", "What was the original prompt?")
        .string("assistantResponse", "What was the LLM response to evaluate?")
        .object("expectedSchema", "What is the expected JSON schema?")
    )
    // automatically included from makeJudgeDeck builder
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
