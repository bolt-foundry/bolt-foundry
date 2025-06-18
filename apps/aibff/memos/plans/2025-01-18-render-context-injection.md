# aibff render Context Injection Implementation Plan

## Overview

The `aibff render` command needs to support context injection using embedded TOML context definitions within deck files. This enables rendering decks with their default context values, showing exactly what prompts would be sent to an LLM as an OpenAI completion request with context Q&A pairs included as messages.

## Goals

| Goal | Description | Success Criteria |
| ---- | ----------- | ---------------- |
| Embedded Context Support | Load and use context definitions from deck TOML embeds | Decks with `[contexts.varName]` blocks render with context Q&A pairs |
| Context Warnings | Show warnings for context variables without values during render | Warning messages displayed for missing values |
| JSON Output | Output complete OpenAI completion request object | Output shows messages array with system prompt and context Q&A pairs |
| Required assistantQuestion | Enforce that all context variables have assistantQuestion field | Command fails if any context is missing assistantQuestion |

## Anti-Goals

| Anti-Goal | Reason |
| --------- | ------ |
| CLI Context Arguments | Keep scope focused - add in future iteration |
| External Context Files | Not needed for initial implementation |
| Multiple Output Formats | JSON only for now |
| Error on Missing Values | Use warnings to keep command forgiving |
| Continue on TOML Parse Errors | Fail fast on malformed TOML to catch errors early |

## Technical Approach

The implementation introduces a `renderDeck` function that processes deck markdown files with embedded TOML context definitions. Context variables are transformed into Q&A message pairs (assistant question followed by user answer) that are included in the final OpenAI completion request object.

### Context Flow

1. Read deck markdown file
2. Call `extractContextFromMarkdown()` to parse external file references (any extension)
3. Resolve file paths relative to the deck file's location
4. Check if files contain valid TOML content
5. Extract context variable definitions from `[contexts.*]` blocks in TOML files (silently ignore other sections)
6. Validate all context variables have required `assistantQuestion` field (fail if missing)
7. Build context object using default values where available
8. Call `renderDeck()` which:
   - Removes embeds from markdown to get system message
   - Creates context Q&A message pairs (assistant/user)
   - Warns for any missing context values
   - Returns complete OpenAI completion request object
9. Output JSON to stdout, warnings to stderr

## Components

| Status | Component | Purpose |
| ------ | --------- | ------- |
| [ ] | extractContextFromMarkdown | Parse markdown for external TOML file references and extract context definitions |
| [ ] | renderDeck | Main function that converts deck markdown + context into OpenAI completion request |
| [ ] | Warning Display | Show detailed warnings for missing context values to stderr |
| [ ] | Render Command Update | Update render command to use new renderDeck function |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| -------- | --------- | ----------------------- |
| Extract external TOML files only | Simpler implementation, matches actual use case | Parse inline TOML blocks |
| Paths relative to deck location | Intuitive for users, keeps TOML references portable | Absolute paths or CWD-relative |
| Export renderDeck function | Clean API, no deck object needed | Create deck builder pattern |
| No string interpolation | Context becomes Q&A messages, not template variables | Template variable replacement |
| Required assistantQuestion field | Ensures all context has proper Q&A format | Make assistantQuestion optional |
| Return OpenAI request object | Complete request ready to send | Return just messages array |
| Empty openAiCompletionOptions | Start simple, spread last for overrides | Require options parameter |
| Inline ui object | Start simple, extract later if needed | Separate utility module now |
| Warnings to stderr | Standard practice for CLI warnings | Include in JSON output |
| Include file info in duplicate warnings | Helps users debug conflicting definitions | Just warn without details |
| Support markdown link syntax | Allows descriptive alt text for TOML references | Empty alt text only |
| Any file extension for TOML | More flexible, check content during parsing | Restrict to .toml extension |
| Fail on missing TOML files | Clear error feedback for broken references | Continue with warnings |
| Fail on missing assistantQuestion | Ensures valid context structure | Use default question |
| No type validation | Keep implementation simple for now | Validate type field matches default |

## Implementation Details

### extractContextFromMarkdown Function

```typescript
interface ContextDefinition {
  assistantQuestion: string;  // Required field
  default?: unknown;
  description?: string;
  type?: string;
  // Additional metadata from TOML
  [key: string]: unknown;
}

interface ExtractedContext {
  [variableName: string]: ContextDefinition & { sourceFile?: string };
}

function extractContextFromMarkdown(markdown: string, deckPath: string): ExtractedContext {
  // 1. Find external file references using regex: ![alt text](file.ext)
  // 2. For each reference, resolve path relative to deck file location
  // 3. Read each file (fail immediately if file doesn't exist)
  // 4. Try to parse as TOML (fail immediately if invalid TOML)
  // 5. Look for [contexts.*] sections (silently ignore other sections)
  // 6. Validate each context has required assistantQuestion field (fail if missing)
  // 7. Extract all context information (assistantQuestion, defaults, descriptions, types, etc.)
  // 8. Track source file for each context variable
  // 9. Merge contexts from all files (warn on duplicates with file info, last wins based on order in markdown)
  // 10. Return structured context data for render phase to use
}
```

### renderDeck Function

```typescript
interface OpenAIMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

interface OpenAICompletionRequest {
  messages: OpenAIMessage[];
  [key: string]: unknown;  // Additional OpenAI parameters
}

function renderDeck(
  deckMarkdown: string, 
  context: Record<string, unknown>,
  extractedContext: ExtractedContext,
  openAiCompletionOptions: Record<string, unknown> = {}
): OpenAICompletionRequest {
  // 1. Remove all ![alt](file) embeds from markdown to get clean system message
  const systemContent = deckMarkdown.replace(/!\[.*?\]\(.*?\)/g, '').trim();
  
  // 2. Build messages array starting with system message
  const messages: OpenAIMessage[] = [
    { role: "system", content: systemContent }
  ];
  
  // 3. Add context Q&A pairs
  for (const [key, value] of Object.entries(context)) {
    const definition = extractedContext[key];
    if (definition && definition.assistantQuestion) {
      messages.push(
        { role: "assistant", content: definition.assistantQuestion },
        { role: "user", content: String(value) }
      );
    }
  }
  
  // 4. Return complete OpenAI request with options spread last
  return {
    messages,
    ...openAiCompletionOptions
  };
}
```

### Updated Render Command Flow

```typescript
// UI helper (to be extracted later)
// deno-lint-ignore no-console
const ui = {
  printLn: (msg: string) => console.log(msg),
  printWarn: (msg: string) => console.warn(msg),
  printErr: (msg: string) => console.error(msg),
};

const deckContent = await Deno.readTextFile(deckPath);
const extractedContext = extractContextFromMarkdown(deckContent, deckPath);

// Build context values and warn for missing defaults
const contextValues: Record<string, unknown> = {};
for (const [key, definition] of Object.entries(extractedContext)) {
  if (definition.default !== undefined) {
    contextValues[key] = definition.default;
  } else {
    ui.printWarn(`Warning: Context variable '${key}' has no default value`);
    if (definition.description) {
      ui.printWarn(`  Description: ${definition.description}`);
    }
    if (definition.type) {
      ui.printWarn(`  Type: ${definition.type}`);
    }
  }
}

// Note: renderDeck needs to be updated to accept extractedContext
// to access assistantQuestion fields for building Q&A pairs
const openAiRequest = renderDeck(deckContent, contextValues, extractedContext, {});

ui.printLn(JSON.stringify(openAiRequest, null, 2));
```

## Clarified Requirements

Based on discussion, the following decisions were made:

1. **Markdown link syntax** - Parse references with alt text like `![Config](file.toml)`, alt text is descriptive only
2. **Any file extension** - Check if content is valid TOML during parsing, not restricted to .toml files
3. **Relative path resolution** - File paths are resolved relative to the deck file's location
4. **Export renderDeck function** - No deck object needed, direct function export from apps/aibff
5. **Required assistantQuestion** - All context variables must have assistantQuestion field, fail if missing
6. **Context as Q&A messages** - Context becomes assistant/user message pairs, no string interpolation
7. **Return OpenAI request** - Complete request object with messages array and any additional options
8. **Empty openAiCompletionOptions** - Pass empty object for now, spread last to allow overrides
9. **System message extraction** - Remove all embeds from markdown to get clean system prompt
10. **Detailed warnings** - Include variable name, description, type when warning about missing values
11. **Duplicate handling** - Warn with source file info, last wins based on order in markdown (top to bottom)
12. **Missing file handling** - Fail immediately with error if referenced file doesn't exist
13. **TOML parsing** - Fail immediately on malformed TOML, silently ignore non-context sections
14. **No type validation** - Pass through type metadata as-is, add validation as future work
15. **JSON output to stdout** - Complete OpenAI request as JSON, warnings to stderr
16. **Test location** - Place tests in `__tests__/` folders next to source files per testing card

## Test Requirements

### New Test File
Create `apps/aibff/src/commands/__tests__/render_context_injection.test.ts` with:
- Test extractContextFromMarkdown with markdown link syntax (with alt text)
- Test files with any extension can contain TOML (e.g., .txt, .config)
- Test relative path resolution for files
- Test missing assistantQuestion field causes failure
- Test warning output for missing context values (with variable details)
- Verify JSON output includes context Q&A messages in correct format
- Test system message has embeds removed
- Test with decks that have no file references
- Test with multiple context variables from different files
- Test duplicate context variable handling (warning with file info + last wins)
- Test malformed TOML causes immediate command failure
- Test missing file references cause immediate errors
- Test TOML files with non-context sections are handled (silently ignored)
- Test renderDeck function returns complete OpenAI request object
- Test openAiCompletionOptions are spread last (can override messages)

### Tests to Remove/Ignore
In existing render test files:
- Remove or ignore tests for `--context` flag (not implementing CLI args yet)
- Remove or ignore tests for `--output` flag (JSON only for now)
- Keep any basic render tests that don't involve context injection

## Example TOML Context Structure

```toml
[contexts.userName]
assistantQuestion = "What is the user's name?"
default = "Alice"
description = "The name of the user"
type = "string"

[contexts.apiKey]
assistantQuestion = "What is your API key?"
default = "sk-test-123"
description = "API key for the service"
type = "string"

[contexts.temperature]
assistantQuestion = "What temperature setting would you like?"
default = 0.7
description = "LLM temperature parameter"
type = "number"
```

## Implementation Clarifications from Q&A

Based on discussion with the user, the following implementation details were clarified:

1. **TOML Section Handling** - External TOML files may contain other configuration sections beyond `[contexts.*]`. The implementation should silently ignore all non-context sections without warnings or errors.

2. **Q&A Message Order** - Context Q&A pairs should be added to the messages array in the same order that the external file references appear in the markdown file (top to bottom).

3. **Duplicate Variable Resolution** - When the same context variable is defined in multiple TOML files, the last definition wins based on the order of file references in the markdown. For example, if `config1.toml` and `config2.toml` both define `contexts.userName`, and `config2.toml` appears after `config1.toml` in the markdown, then `config2.toml`'s definition takes precedence.

4. **Error Handling Strategy** - Missing files and invalid TOML should throw exceptions that stop the render command entirely, rather than being caught and displayed as error messages. This ensures fail-fast behavior.

5. **Context Validation in renderDeck** - The `renderDeck` function should silently skip any context values that don't have corresponding definitions in `extractedContext`. No validation or warnings needed for this case.

6. **Warning Format** - Warnings for missing default values should only include the variable name, description, and type fields. The `assistantQuestion` should not be included in warning output.

7. **Code Organization** - Both `extractContextFromMarkdown` and `renderDeck` functions should be implemented inline in the existing render command file rather than as separate modules.

## Future Work

- **Type validation** - Validate that the `type` field matches the actual type of `default` values
- **CLI context arguments** - Add support for `--context` flag to override values from command line
- **Multiple output formats** - Support formats beyond JSON (e.g., plain text, YAML)
- **External context files** - Support loading context from standalone TOML files via CLI
- **Error recovery** - Option to continue on missing values instead of just warning
- **Extract ui object** - Move console wrapper to separate utility module
- **OpenAI options from CLI** - Accept model, temperature, etc. as command flags