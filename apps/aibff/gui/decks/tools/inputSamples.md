+++
[[tools]]
type = "function"
[tools.function]
name = "getInputSamples"
description = "Get the current input samples content"
[tools.function.parameters]
type = "object"
properties = {}

[[tools]]
type = "function"
[tools.function]
name = "updateInputSamples"
description = "Update the input samples for the evaluation workflow"
[tools.function.parameters]
type = "object"
required = ["content"]
[tools.function.parameters.properties.content]
type = "string"
description = "The input samples content in JSONL format"
+++

# Input Samples Tools

Tools for managing input samples in the evaluation workflow.

## getInputSamples

Returns the current content of the input samples.

**Parameters:** None

**Returns:** The current input samples content in JSONL format

**Usage:** Call this function when you need to read the current input samples to understand what data is being used for evaluation, or to build upon existing samples.

## updateInputSamples

Updates the input samples with new JSONL content for evaluation inputs.

**Parameters:**
- `content` (string, required): The input samples in JSONL format

**Usage:** Call this function when you need to update the input samples that will be used for evaluation. The content should be in JSONL format with one JSON object per line representing each input sample.

**Example:**
```jsonl
{"input": "What is the capital of France?"}
{"input": "Explain photosynthesis in simple terms"}
{"input": "How do you make chocolate chip cookies?"}
```