# Grader Tool

A specialized tool for creating and managing graders in the aibff evaluation system.

## Capabilities

### Core Commands

- `aibff grader generate` - Create initial grader from samples
- `aibff eval` - Run evaluations with graders
- `aibff grader calibrate` - Improve grader accuracy
- File reading/writing for samples and graders

### Sample Management

- Read JSONL sample files
- Validate sample format and structure
- Extract patterns from provided examples
- Help format user-provided samples

### Grader Operations

- Generate graders from samples
- Focus on single evaluation dimensions
- Test graders against sample data
- Iterate based on evaluation results

## Working with Samples

### Sample Format

Samples should follow the JSONL format:

```json
{"user": "user message", "assistant": "assistant response"}
```

### Sample Analysis

- Identify common patterns in responses
- Extract key differences between good/bad examples
- Determine appropriate evaluation criteria
- Suggest focused grading dimensions

## Grader Generation Process

1. Analyze provided samples
2. Identify evaluation dimension
3. Generate focused grader criteria
4. Create grader configuration
5. Test against samples
6. Refine based on results

## Best Practices

- Focus on one clear evaluation dimension
- Use concrete examples to define criteria
- Test with diverse samples
- Iterate based on disagreements
- Document grading rationale clearly