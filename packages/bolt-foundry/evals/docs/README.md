# Bolt Foundry Evaluation Framework

## Overview

The Bolt Foundry evaluation framework extends the deck system to enable
systematic evaluation of LLM outputs across multiple models. Built on
OpenRouter's multi-model API, it provides a flexible platform for creating
custom judges and running parallel evaluations.

## Key Features

- **Multi-Model Evaluation**: Test prompts across dozens of LLMs simultaneously
  to compare performance and consistency
- **Custom Judge Decks**: Create specialized evaluators using the familiar
  deck/card system for any evaluation criteria
- **Parallel Execution**: Run evaluations concurrently for faster results across
  multiple models and iterations
- **Smart Model Selection**: Automatically filter models based on capabilities,
  pricing, and compatibility
- **Flexible Output Processing**: Extract and validate structured outputs with
  built-in handling for various response formats
- **Comprehensive Results**: Detailed metrics including success rates,
  latencies, and custom validation results

## Architecture

The evaluation framework consists of three main components:

### 1. Judge Decks

Judges are specialized decks that evaluate LLM outputs against specific
criteria. They define:

- The evaluation persona and values
- Input context (what to evaluate)
- Output format (how to structure results)
- Validation criteria

### 2. Evaluation Runner

The runner orchestrates evaluations by:

- Rendering judge decks with evaluation contexts
- Distributing work across multiple models
- Managing parallel execution
- Collecting and aggregating results

## Creating Judge Decks

psuedocode sample

```typescript
import { makeDeckBuilder } from "@bolt-foundry/bolt-foundry";

// Create a judge that evaluates JSON outputs
export default function createJsonJudge() {
  return makeDeckBuilder("json-validator")
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
    .context((c) =>
      c.string("prompt", "What was the original prompt?")
        .string("response", "What was the LLM response to evaluate?")
        .object("expectedSchema", "What is the expected JSON schema?")
        .string(
          "outputFormat",
          "Return evaluation as: {valid: boolean, issues: string[], score: number, explanation: string}",
        )
    );
}
```

## Writing Evaluation Contexts

Evaluation contexts provide the data that judges will evaluate. Use JSONL format
where each line contains a context object:

```jsonl
{"userMessage": "Extract user info from: 'John Doe, 30, NYC'", "assistantResponse": "{\"name\":\"John Doe\",\"age\":30,\"city\":\"NYC\"}"}
{"userMessage": "Parse address: '123 Main St'", "assistantResponse": "{\"street\":\"123 Main St\"}"}
```

## Model Selection

you can pick models, or we can pick random ones for you. You can filter the
random ones by criteria you'd like. Our default filter skips free models,
because they're the most likely to fail w/ tos stuff on open router.

## Running Evaluations

The evaluation process follows these steps:

1. **Load Judge Deck**: Import the TypeScript file defining evaluation criteria
2. **Load Contexts**: Read JSONL file with test cases
3. **Select Models**: Choose specific models or let the system select randomly
4. **Run Evaluations**: Execute in parallel across models and iterations
5. **Process Results**: Apply post-processing to clean and validate outputs
6. **Generate Report**: Summarize results with success rates and metrics

## Output Formats

Evaluations produce detailed results including:

```typescript
{
  model: "gpt-4",
  sampleId: "sample-001",
  iteration: 1,
  score: 3, // +3 to -3
  latency: 1234,  // milliseconds
  output: "raw model response",
  parsed: { /* parsed JSON if applicable */ },
}
```
