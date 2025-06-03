# Bolt Foundry evaluation CLI

A command-line tool for running LLM evaluations using the Bolt Foundry deck
system.

## Installation

```bash
# Ensure dependencies are installed
deno install jsr:@std/flags

# Make the CLI executable
chmod +x ./cli.ts
```

## Basic usage

```bash
# Run with specific models
./cli.ts --deck ./examples/judges/json-validator.ts \
         --context ./examples/test-cases.jsonl \
         --models gpt-4,claude-3-opus-20240229 \
         --iterations 3

# Run with random models and save as JSON
./cli.ts --deck ./examples/judges/json-validator.ts \
         --context ./examples/test-cases.jsonl \
         --output results.json \
         --format json

# Use a post-processor for validations
./cli.ts --deck ./examples/judges/json-validator.ts \
         --context ./examples/test-cases.jsonl \
         --post-process ./examples/post-processors/json-post-processor.ts
```

## Command-line options

### Required arguments

- `--deck <file>` - Path to TypeScript file exporting a judge deck
- `--context <file>` - Path to JSONL file with evaluation contexts

### Optional arguments

- `--models <list>` - Comma-separated list of models (default: 3 random models)
- `--iterations <n>` - Number of iterations per model (default: 1)
- `--output <file>` - Output file path (default: stdout)
- `--format <type>` - Output format: `human`, `json`, `jsonl` (default: human)
- `--post-process <file>` - TypeScript file exporting postProcess function

### Flags

- `-h, --help` - Show help message
- `-v, --verbose` - Show detailed progress
- `--list-models` - List available models and exit
- `--include-instruct` - Include instruct models in random selection

## File formats

### Context file (JSONL)

Each line should be a JSON object that will be passed as context to the deck:

```jsonl
{"prompt": "...", "response": "...", "expected": "..."}
{"prompt": "...", "response": "...", "expected": "..."}
```

### Judge deck file

Must export a default function that returns a DeckBuilder:

```typescript
import { makeDeckBuilder } from "../builders/builders.ts";

export default function createJudge() {
  return makeDeckBuilder("judge-name")
    .spec("You are a judge...")
    .context((c) =>
      c.string("prompt", "What was the prompt?")
        .string("response", "What was the response?")
    );
}
```

### Post-processor file

Must export a default function that processes evaluation results:

```typescript
import type { EvalResult } from "./scratchpad.ts";

export default function postProcess(result: EvalResult): EvalResult {
  // Add validations, parse output, etc.
  result.validations = {
    someCheck: {
      passed: true,
      message: "Check passed",
    },
  };
  return result;
}
```

## Output formats

### Human-readable (default)

```
=== EVALUATION RESULTS ===

Context #1:
──────────────────────────────────────────────────

Model: gpt-4 (Iteration 1)
Status: ✅ Success
Latency: 1234ms
Output: {
  "valid": true,
  "issues": [],
  "score": 95
}
Validations:
  validJson: ✅ Output is valid JSON
  requiredFields: ✅ All required fields present
```

### JSON format

```json
[
  {
    "model": "gpt-4",
    "iteration": 1,
    "success": true,
    "output": "...",
    "latency": 1234,
    "parsed": {...},
    "validations": {...}
  }
]
```

### JSONL format

```jsonl
{"model":"gpt-4","iteration":1,"success":true,...}
{"model":"claude-3-opus","iteration":1,"success":true,...}
```

## Environment variables

- `OPENROUTER_API_KEY` - Required API key for OpenRouter

## Examples

### Running a comprehensive evaluation

```bash
# Set up
export OPENROUTER_API_KEY=your-key-here

# Run evaluation on 3 test cases with 3 models, 5 iterations each
./cli.ts --deck ./judges/accuracy.ts \
         --context ./test-data.jsonl \
         --models gpt-4,claude-3-opus,mistral-large \
         --iterations 5 \
         --post-process ./validators/accuracy-validator.ts \
         --output ./results/accuracy-eval.json \
         --format json \
         --verbose
```

### Listing available models

```bash
# List all models
./cli.ts --list-models

# Include instruct models
./cli.ts --list-models --include-instruct
```

### Quick evaluation with random models

```bash
# Uses 3 random models with default settings
./cli.ts --deck ./judges/simple.ts --context ./data.jsonl
```
