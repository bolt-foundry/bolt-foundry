# Add Message Distinction to aibff repl Command

## Overview

This plan outlines adding visual distinction between user and assistant messages
in the simplified repl command. The goal is to make conversations easier to
follow while maintaining the minimal implementation philosophy.

## Goals

| Goal                   | Description                                         | Success Criteria        |
| ---------------------- | --------------------------------------------------- | ----------------------- |
| Visual distinction     | Different formatting for user vs assistant messages | Clear visual separation |
| Maintain simplicity    | Keep implementation minimal                         | Under 150 lines total   |
| Preserve functionality | Don't break existing features                       | All tests pass          |
| Consistent experience  | Smooth reading experience                           | No jarring transitions  |

## Anti-Goals

| Anti-Goal                  | Reason                          |
| -------------------------- | ------------------------------- |
| Complex formatting library | Keep dependencies minimal       |
| Configurable colors/styles | Hardcode for simplicity         |
| Rich UI components         | Terminal-only, basic formatting |
| Message timestamps         | Not needed for basic chat       |

## Technical Approach

Add simple prefixes and dim styling to distinguish messages:

1. User input prompt: Show dim `>` when waiting for input
2. User messages: Display with dim `>` prefix after submission
3. Assistant messages: Prefix with `🤖>` in normal brightness
4. Keep streaming output for assistant responses

## Components

| Status | Component        | Purpose                                           |
| ------ | ---------------- | ------------------------------------------------- |
| [ ]    | Message Prefixes | Add ">" for user and "🤖>" for assistant          |
| [ ]    | Dim Styling      | Use gray() from @std/fmt/colors for user messages |
| [ ]    | Input Prompt     | Show dim ">" when waiting for user input          |
| [ ]    | Update Tests     | Ensure tests handle new output format             |

## Technical Decisions

| Decision             | Reasoning                              | Alternatives Considered          |
| -------------------- | -------------------------------------- | -------------------------------- |
| Simple prefixes      | Works in all terminals                 | Markdown formatting, boxes       |
| @std/fmt/colors      | Standard library, auto-detects support | Raw ANSI codes, third-party libs |
| Inline formatting    | Maintains streaming                    | Buffer and format after          |
| Minimal dependencies | Only standard library imports          | External color libraries         |

## Implementation Details

### 1. Add Import

Add the gray import at the top of the file:

```typescript
import { gray } from "@std/fmt/colors";
```

### 2. Message Formatting

Show input prompt and format messages:

```typescript
// Show dim > when waiting for input
await Deno.stdout.write(new TextEncoder().encode(gray("> ")));

// After user submits, clear the line and redraw with dim styling
// Move cursor to beginning of line and clear it
await Deno.stdout.write(new TextEncoder().encode("\r\x1b[K"));
// Redraw the user's message with dim styling
await Deno.stdout.write(new TextEncoder().encode(gray(`> ${userInput}\n`)));

// Before assistant response, show robot emoji
await Deno.stdout.write(new TextEncoder().encode("🤖> "));
```

Note: The @std/fmt/colors module automatically handles color support detection.
It respects NO_COLOR and Deno.noColor environment variables, and checks if
stdout is a TTY.

### 3. Streaming with Prefix

Ensure assistant prefix appears before streaming:

```typescript
// Before streaming response
await Deno.stdout.write(new TextEncoder().encode("🤖> "));

// Then stream content as before
for (const line of lines) {
  // ... existing streaming logic
}
```

### 4. Clear Input Prompt

Show when ready for input:

```typescript
// After assistant response
await Deno.stdout.write(new TextEncoder().encode("\n"));
// Then show the dim > prompt for next input
await Deno.stdout.write(new TextEncoder().encode(gray("> ")));
```

## Expected Changes

### Current Output

```
Chat started. Type 'exit' to quit.

Hello, how can I help you today?

What is TypeScript?
TypeScript is a statically typed superset of JavaScript...
```

### New Output

```
Chat started. Type 'exit' to quit.

> Hello, how can I help you today?
🤖> I'm here to help! What would you like to know about or discuss today?

> What is TypeScript?
🤖> TypeScript is a statically typed superset of JavaScript...
```

Note: User messages (lines starting with just `>`) are displayed in dim gray.

## Implementation Order

| Step | Action                  | Details                                         |
| ---- | ----------------------- | ----------------------------------------------- |
| 1    | Add gray import         | Import gray from @std/fmt/colors                |
| 2    | Update input prompt     | Show dim ">" before reading input               |
| 3    | Format user display     | Show user message with dim ">" after submission |
| 4    | Update assistant prefix | Show "🤖>" before streaming response            |
| 5    | Update tests            | Adjust test expectations for new format         |

## Testing Strategy

1. Manual testing with and without color support
2. Verify streaming still works smoothly
3. Ensure tests handle the new output format
4. Test with NO_COLOR environment variable

## Code Impact

The changes should add approximately 10-20 lines to the existing ~105 line
implementation, keeping us well under the 150 line target.
