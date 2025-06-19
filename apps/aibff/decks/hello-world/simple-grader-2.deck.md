+++
[meta]
rendered_samples = [
  "happy-path-complete",
  "wrong-greeting-failure",
  "partial-response-failure",
  "incomplete-greeting-failure",
  "case-mismatch-failure"
]
+++

# Hello World Grader v2

![grader base deck](../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating a conversation between a user and an AI assistant. Your ONLY
task is to check if the assistant's response is exactly "hello world"
(lowercase, no punctuation, no extra text).

## Scoring Guide

**YOU MUST SCORE BASED ON EXACT STRING MATCHING ONLY:**

- **+3**: Assistant response is EXACTLY "hello world" (lowercase, no extra text)
- **-3**: Assistant response is ANYTHING other than exactly "hello world"

## Specifications

### Exact Match Requirements

- The response must be exactly "hello world" (lowercase)
- No additional text before or after
- No variations in capitalization (e.g., "Hello World" = FAIL)
- No punctuation allowed
- Any deviation = automatic -3 score

### Examples

- "hello world" → +3 ✓
- "Hello World" → -3 ✗ (wrong capitalization)
- "Hello" → -3 ✗ (missing "world")
- "World" → -3 ✗ (missing "hello")
- "I like to move it move it" → -3 ✗ (completely different)

**IGNORE general conversation quality. ONLY check exact string match.**

## Sample Analysis

The following samples demonstrate the grading criteria:

### Successful Cases

- **Sample 1**[^1]: Perfect response with exact match

### Failure Cases

- **Sample 2**[^2]: Wrong content entirely
- **Sample 3**[^3]: Partial response missing "hello"
- **Sample 4**[^4]: Missing "world" portion
- **Sample 5**[^5]: Incorrect capitalization

---

## Footnoted Samples

[^1]: [happy-path-complete](./sources.deck.toml#happy-path-complete)

[^2]: [wrong-greeting-failure](./sources.deck.toml#wrong-greeting-failure)

[^3]: [partial-response-failure](./sources.deck.toml#partial-response-failure)

[^4]: [incomplete-greeting-failure](./sources.deck.toml#incomplete-greeting-failure)

[^5]: [case-mismatch-failure](./sources.deck.toml#case-mismatch-failure)

![ground truth samples](sources.deck.toml)
