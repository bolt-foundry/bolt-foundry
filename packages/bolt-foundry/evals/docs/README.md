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

### 3. Post-Processing Pipeline

Post-processors transform and validate model outputs:

- Strip thinking/reasoning artifacts from responses
- Extract structured data from various formats
- Validate outputs against expected schemas
- Generate detailed validation reports

## Creating Judge Decks

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
{"prompt": "Extract user info from: 'John Doe, 30, NYC'", "response": "{\"name\":\"John Doe\",\"age\":30,\"city\":\"NYC\"}", "expectedSchema": {...}}
{"prompt": "Parse address: '123 Main St'", "response": "{\"street\":\"123 Main St\"}", "expectedSchema": {...}}
```

## Creating Post-Processors

Post-processors clean and validate model outputs. They handle common issues like
thinking artifacts and response formatting:

```typescript
import { stripThinkingOutputs } from "@bolt-foundry/bolt-foundry/evals";

export default function postProcessJsonEval(result) {
  // Remove thinking tags and extract clean JSON
  const cleanedOutput = stripThinkingOutputs(result.output);

  try {
    result.parsed = JSON.parse(cleanedOutput);
    result.validations = {
      validJson: { passed: true, message: "Valid JSON" },
    };
  } catch (e) {
    result.validations = {
      validJson: { passed: false, message: e.message },
    };
  }

  return result;
}
```

## Model Selection

The framework intelligently selects models based on:

- **Compatibility**: Automatically excludes models requiring special
  configurations
- **Pricing**: Filters based on cost constraints (free models excluded by
  default)
- **Capabilities**: Considers context length and feature support
- **Reliability**: Skips models known to have compatibility issues

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
  iteration: 1,
  success: true,
  latency: 1234,  // milliseconds
  output: "raw model response",
  parsed: { /* parsed JSON if applicable */ },
  validations: {
    validJson: { passed: true, message: "Valid JSON" },
    requiredFields: { passed: true, message: "All fields present" },
    // ... custom validations
  }
}
```

## Best Practices

1. **Design Clear Judge Criteria**: Be specific about what constitutes success
   or failure
2. **Use Representative Test Cases**: Include edge cases and typical scenarios
3. **Handle Response Variations**: Models format outputs differently;
   post-processors should be robust
4. **Set Appropriate Iterations**: More iterations provide statistical
   confidence but increase cost
5. **Monitor Costs**: Use pricing filters to control evaluation expenses
6. **Version Your Judges**: Track changes to evaluation criteria over time

## Troubleshooting

Common issues and solutions:

- **Model Compatibility**: Some models require specific data policies or
  configurations. The framework automatically excludes problematic models.
- **Response Parsing**: Models may include reasoning or formatting that breaks
  parsers. Use the `stripThinkingOutputs` utility.
- **Rate Limiting**: When running many evaluations, you may hit API limits.
  Reduce parallelism or add delays.
- **Inconsistent Results**: Some models are non-deterministic. Run multiple
  iterations for reliable metrics.

## Future Enhancements

The evaluation framework is designed for extensibility:

- Additional judge templates for common evaluation scenarios
- Integration with more model providers beyond OpenRouter
- Advanced statistical analysis of evaluation results
- Automated regression testing for prompt changes
- Visual dashboards for result exploration
