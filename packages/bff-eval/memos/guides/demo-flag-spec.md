# --demo Flag Specification

## Overview

The `--demo` flag provides a quick way to run pre-configured evaluation examples
without specifying separate input and grader files.

## Usage

```bash
bff-eval --demo $NAME  # Run a specific demo
bff-eval --demo        # Run a random demo
```

Where `$NAME` is the name of a demo folder in `packages/bff-eval/examples/`. If
no name is provided, a random demo will be selected.

## Behavior

- **Location**: Loads demo from `packages/bff-eval/examples/$NAME/` (or random
  if no name provided)
- **Required Files**: Each demo folder must contain:
  - `grader.js` - The grader implementation (CommonJS module export)
  - `samples.jsonl` - Sample data in standard format
- **Exclusivity**: The `--demo` flag is mutually exclusive with `--input` and
  `--grader` flags
- **Other Flags**: Configuration flags like `--model`, `--judges`, and
  `--output` remain customizable
- **Error Handling**: If the specified demo folder doesn't exist, displays an
  error listing available demos
- **Default Behavior**: If no demo name is provided, randomly selects from
  available demos
- **Output**: Shows "Running demo: $NAME" when loading a demo

## Sample Data Format

The `samples.jsonl` file should follow the standard bff-eval format:

```jsonl
{"userMessage": "Extract user info from: 'John Doe, 30, NYC'", "assistantResponse": "{\"name\":\"John Doe\",\"age\":30,\"city\":\"NYC\"}", "id": "sample-001", "score": 3, "category": "extraction"}
{"userMessage": "Parse address: '123 Main St'", "assistantResponse": "{\"street\":\"123 Main St\"}", "id": "sample-002", "score": 2}
```

Fields:

- `userMessage` (required): The user's input
- `assistantResponse` (required): The assistant's response to evaluate
- `id` (optional): Unique identifier for the sample
- `score` (optional): Expected score for meta-evaluation (-3 to 3)
- Any additional fields are captured in `sampleMetadata` for use in reporting

## Example

```bash
# Run a random demo
bff-eval --demo

# Run the json-validator demo specifically
bff-eval --demo json-validator

# Run with a different model
bff-eval --demo json-validator --model anthropic/claude-3-opus

# Run with custom output format
bff-eval --demo json-validator --output csv
```
