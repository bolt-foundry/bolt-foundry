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

# Hello World Grader v3

![grader base deck](../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating a conversation between a user and an AI assistant. Your ONLY task is to check if the assistant's response is exactly "hello world" (lowercase, no punctuation, no extra text).

## Critical Scoring Rules

**YOU MUST APPLY THESE SCORES WITH ABSOLUTE STRICTNESS:**

- **+3**: Assistant response is EXACTLY "hello world" (lowercase, no extra text, no extra spaces)
- **-3**: Assistant response is ANYTHING other than exactly "hello world"

**THERE ARE NO OTHER SCORES. ONLY +3 OR -3.**

## Exact Match Requirements

The response must be EXACTLY "hello world":
- Lowercase letters only: h-e-l-l-o space w-o-r-l-d
- No capitalization anywhere (Hello, HELLO, World, WORLD = FAIL)
- No additional words before or after
- No punctuation (periods, commas, exclamation marks = FAIL)
- No extra spaces or formatting
- Any deviation whatsoever = automatic -3 score

## Test Cases Reference

### Perfect Match (+3)
- "hello world" → +3 ✓

### All Failures (-3)
- "Hello World" → -3 ✗ (capitalization)
- "Hello world" → -3 ✗ (capitalization)
- "hello World" → -3 ✗ (capitalization)
- "HELLO WORLD" → -3 ✗ (capitalization)
- "Hello" → -3 ✗ (missing word)
- "World" → -3 ✗ (missing word)
- "hello world!" → -3 ✗ (punctuation)
- "hello world." → -3 ✗ (punctuation)
- "Hi, hello world" → -3 ✗ (extra text)
- "hello world there" → -3 ✗ (extra text)
- "I like to move it move it" → -3 ✗ (wrong content)

**REMEMBER: If it's not exactly "hello world", it gets -3. No exceptions.**

## Sample Analysis

The following samples demonstrate the grading criteria:

### Successful Cases
- **Sample 1** [^1]: Perfect response with exact match

### Failure Cases  
- **Sample 2** [^2]: Wrong content entirely
- **Sample 3** [^3]: Partial response missing "hello"
- **Sample 4** [^4]: Missing "world" portion  
- **Sample 5** [^5]: Incorrect capitalization

---

## Footnoted Samples

[^1]: [happy-path-complete](./sources.deck.toml#happy-path-complete)

[^2]: [wrong-greeting-failure](./sources.deck.toml#wrong-greeting-failure)

[^3]: [partial-response-failure](./sources.deck.toml#partial-response-failure)

[^4]: [incomplete-greeting-failure](./sources.deck.toml#incomplete-greeting-failure)

[^5]: [case-mismatch-failure](./sources.deck.toml#case-mismatch-failure)

![ground truth samples](sources.deck.toml)