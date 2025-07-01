+++
[meta]
version = "1.0"
purpose = "Evaluate JSON validity in line item extraction responses"
default_model = "openai/gpt-4.1"
+++

# Line Item JSON Grader

![](./grader-base/grader-base.deck.md)

## Evaluation Criteria

You are evaluating whether the assistant's response contains valid JSON output
for line item extraction from restaurant supplier invoices.

**Scoring Guidelines:**

- **+3**: Perfect valid JSON that parses without errors
- **+2**: Valid JSON with minor formatting issues but still parseable
- **0**: Unable to determine if JSON is valid or response doesn't contain JSON
- **-3**: No JSON present or completely unparseable content

**What to look for:**

1. **Valid JSON syntax**: Proper brackets, quotes, commas, and structure
2. **Parseable content**: JSON that would successfully parse with JSON.parse()
3. **Response contains JSON**: The assistant actually provided JSON output (not
   just text)

**Important notes:**

- Don't worry about the actual data content or accuracy - only focus on JSON
  validity
- Code blocks containing JSON are invalid.

![grader contexts](./line-item-json-grader.deck.toml)
