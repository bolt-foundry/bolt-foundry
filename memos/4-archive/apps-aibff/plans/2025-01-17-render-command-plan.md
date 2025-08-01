# aibff render Command Implementation Plan

## Overview

The `aibff render` command will provide a way to render a deck file and display
the exact output that would be sent to an LLM. This is essential for debugging,
testing, and understanding how decks are processed.

## Command Specification

### Usage

```bash
aibff render <deck-file> [options]
```

### Description

Renders a deck file (.deck.md) and displays the formatted messages that would be
sent to an LLM, without actually making any API calls.

## Implementation Details

### 1. Command Structure

Create a new command file at `commands/render.ts` following the existing command
pattern:

```typescript
export const renderCommand: Command = {
  name: "render",
  description: "Render a deck file and show the LLM-ready output",
  run: async (args: Array<string>) => {
    // Implementation
  },
};
```

### 2. Core Functionality

The command will:

1. **Parse Arguments**: Handle deck file path and options
2. **Load Deck**: Use `parseMarkdownToDeck()` to load the deck file
3. **Process Context**: Parse context variables from CLI or file
4. **Render Deck**: Call `deck.render()` with provided options
5. **Format Output**: Display the rendered content in the requested format

### 3. Command Options

#### Context Variables

- `--context <key=value>`: Set individual context variables
  - Example:
    `--context userMessage="Hello" --context assistantResponse="Hi there"`
- `--context-file <file.json>`: Load context from a JSON file
  - Example: `--context-file context.json`

#### Sample Selection

- `--samples <id1,id2,...>`: Specify which samples to render
  - Example: `--samples sample1,sample2`
- If not specified, follows default sample rendering rules

#### Output Format

- `--format <text|json>`: Control output format
  - `text` (default): Human-readable format
  - `json`: Raw OpenAI chat completion format

#### Model Selection

- `--model <model-name>`: Specify the target model
  - Default: `anthropic/claude-3.5-sonnet`

#### Additional Options

- `--no-color`: Disable colored output
- `--verbose`: Show additional metadata

### 4. Output Formats

#### Text Format (Default)

```
=== DECK: Hello World Grader ===
Model: anthropic/claude-3.5-sonnet
Temperature: 0

--- SYSTEM MESSAGE ---
You are evaluating a conversation between a user and an AI assistant.
Your task is to grade if the assistant replied "hello world".

<scoring-guide>
- +3: Said hello world
- -3: Didn't say hello world
</scoring-guide>

--- CONTEXT MESSAGES ---
[Assistant]: What was the user's message?
[User]: "Say hello"

[Assistant]: What was the assistant's response?
[User]: "Hello world!"

[Assistant]: What is the expected output format?
[User]: {
  "score": "<number from -3 to 3>",
  "reason": "<brief explanation>"
}
```

#### JSON Format

```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "You are evaluating a conversation..."
    },
    {
      "role": "assistant",
      "content": "What was the user's message?"
    },
    {
      "role": "user",
      "content": "\"Say hello\""
    }
  ],
  "temperature": 0
}
```

### 5. Error Handling

- **File not found**: Clear error message with file path
- **Invalid deck format**: Show parsing errors with line numbers
- **Missing context**: List required context variables
- **Invalid options**: Show usage help

### 6. Integration Points

- **Reuse existing utilities**:
  - `parseMarkdownToDeck()` for deck loading
  - `DeckBuilder.render()` for message generation
  - Logger for consistent output formatting

- **Follow patterns from existing commands**:
  - Help flag handling (`--help`)
  - Error reporting to stderr
  - Exit codes for different error types

## Benefits

1. **Development**: Quickly test deck changes without API calls
2. **Debugging**: See exactly what gets sent to the LLM
3. **Documentation**: Generate examples of deck outputs
4. **Testing**: Validate deck rendering logic
5. **Learning**: Understand how decks are processed

## Future Enhancements

1. **Interactive Mode**: Allow editing context variables interactively
2. **Diff Mode**: Compare renders with different contexts
3. **Template Support**: Save/load common context configurations
4. **Validation**: Check for common deck issues before rendering
5. **Export**: Save rendered output to file

## Implementation Priority

1. Basic rendering with text output
2. Context variable support (CLI and file)
3. JSON output format
4. Sample selection
5. Enhanced formatting and colors
6. Verbose mode with metadata

## Success Criteria

- Command successfully renders any valid deck file
- Output clearly shows what would be sent to LLM
- Context variables can be easily provided
- Error messages are helpful and actionable
- Command integrates seamlessly with existing aibff tools

## Timeline

- Implementation: 2-3 hours
- Testing: 1 hour
- Documentation: 30 minutes
- Total: ~4 hours
