# Sample Format Migration to OpenAI Messages Array

## Overview

Update the sample format in calibrate from the current `userMessage`/`assistantResponse` structure to match OpenAI's messages array format. This aligns with the render-style migration and makes samples more flexible for multi-turn conversations.

**Note**: The actual implementation uses `userMessage` (not `userInput`) paired with `assistantResponse`.

## Current Format

```toml
[[samples]]
userMessage = "What is 2+2?"
assistantResponse = "The answer is 4"
expected = { score = 1, reason = "Correct answer" }
```

## Proposed Format

```toml
[[samples]]
messages = [
  { role = "user", content = "What is 2+2?" },
  { role = "assistant", content = "The answer is 4" }
]
expected = { score = 1, reason = "Correct answer" }

# Multi-turn example
[[samples]]
messages = [
  { role = "user", content = "Hi, I need help with math" },
  { role = "assistant", content = "I'd be happy to help! What math problem are you working on?" },
  { role = "user", content = "What is 2+2?" },
  { role = "assistant", content = "2+2 equals 4" }
]
expected = { score = 1, reason = "Polite and correct" }
```

## Implementation Strategy

### Clean Break Approach
- Remove all legacy userMessage/assistantResponse support
- Implement only the new messages array format
- No backward compatibility or migration needed
- Update all documentation and examples to new format only

### Files to Update

**Sample Files (TOML):**
- `__tests__/fixtures/test-samples.toml`
- `__tests__/fixtures/test-grader-samples.toml`
- `decks/hello-world/sources.deck.toml`

**Code Files:**
- `commands/calibrate.ts` - Update interfaces and result structures
- `lib/sample-parallel-eval.ts` - Remove old format handling
- `__tests__/fixtures/test-evaluation-results.ts` - Update mock data

## Implementation Details

### Sample Type Definition

```typescript
interface Sample {
  messages: Array<{
    role: string; // No validation - accept any role
    content: string;
  }>;
  expected?: any;
  tags?: string[];
}
```

### Sample Validation

```typescript
function validateSample(data: any): Sample {
  if (!data.messages || !Array.isArray(data.messages)) {
    throw new Error("Sample must have messages array");
  }
  if (data.messages.length === 0) {
    throw new Error("Messages array cannot be empty");
  }
  
  // Validate each message has role and content
  for (const message of data.messages) {
    if (!message.role || typeof message.role !== "string") {
      throw new Error("Each message must have a role string");
    }
    if (!message.content || typeof message.content !== "string") {
      throw new Error("Each message must have a content string");
    }
  }
  
  return data as Sample;
}
```

## Context Mapping for Grading

When passing samples to grading decks, we'll pass the full conversation directly:

```typescript
const context = {
  fullConversation: sample.messages,
  expected: sample.expected
};
```

## Benefits

1. **Flexibility**: Support multi-turn conversations naturally
2. **Alignment**: Matches OpenAI's format exactly
3. **Extensibility**: Easy to add system messages or other roles
4. **Clarity**: More explicit about the conversation structure

## Decisions Made

1. **System messages**: Supported - samples can include system messages
2. **Grading context**: Pass only fullConversation (no extraction needed)
3. **Role validation**: None - accept any role type without validation
4. **Message ordering**: No validation - flexible message ordering allowed
5. **Sample validation**: Skip samples with warnings if no valid messages found

## Next Steps

1. Update all TOML sample files to use messages array format
2. Update TypeScript test fixtures to use new format
3. Remove all legacy userMessage/assistantResponse code
4. Update extractSamplesFromMarkdown to only accept messages array format
5. Update grading deck templates to work with new context structure
6. Update all tests to use new format
7. Update documentation with new examples
8. Remove any references to the old format in codebase