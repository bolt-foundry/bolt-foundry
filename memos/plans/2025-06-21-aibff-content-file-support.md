# AIBFF Content File Support Implementation Plan

**Date**: 2025-06-21\
**Feature**: Add `content_file` support for sample messages in aibff

## Overview

Enable aibff samples to reference external files for message content instead of
inline content. This allows for larger sample content and better organization of
test data.

## Current State

Sample messages in TOML files currently require inline content:

```toml
[[samples.example.messages]]
role = "user"
content = "What is JavaScript?"

[[samples.example.messages]]
role = "assistant"
content = "JavaScript is a programming language..."
```

## Proposed Change

Allow messages to reference external files:

```toml
[[samples.example.messages]]
role = "user"
content_file = "./samples/user-question.txt"

[[samples.example.messages]]
role = "assistant"
content_file = "./samples/assistant-response.md"
```

## Implementation Details

### 1. Code Changes Location

**File**: `/apps/aibff/commands/render.ts`

**Specific Changes**:

1. Update `SampleMessage` interface (line 37-40):
   ```typescript
   interface SampleMessage {
     role: string;
     content?: string;
     content_file?: string;
   }
   ```

2. Modify message processing logic (lines 263-268):
   ```typescript
   for (const message of sample.messages) {
     let messageContent = message.content || "";

     // If content_file is specified, read from file
     if (message.content_file) {
       const filePath = path.resolve(tomlDir, message.content_file);
       try {
         messageContent = Deno.readTextFileSync(filePath);
       } catch (error) {
         ui.printWarn(
           `Failed to read content_file: ${message.content_file} - ${error.message}`,
         );
         continue;
       }
     }

     if (message.role === "user") {
       lastUserMessage = messageContent;
     } else if (message.role === "assistant") {
       lastAssistantMessage = messageContent;
     }
   }
   ```

### 2. Path Resolution

- Paths in `content_file` are resolved relative to the TOML file's directory
- Use `path.resolve(tomlDir, message.content_file)` where `tomlDir` is already
  available in the extraction context

### 3. Error Handling

- If file read fails, log warning and skip the message
- Continue processing other samples to avoid breaking the entire calibration

### 4. Validation Rules

- Either `content` or `content_file` must be present (not both)
- If both are present, `content_file` takes precedence
- Empty files are valid (treated as empty content)

## Testing Plan

1. Create test samples with content_file references
2. Test with various file types (.txt, .md, .json)
3. Test error cases:
   - Non-existent files
   - Invalid paths
   - Permission errors
4. Verify calibration still works correctly

## Future Enhancements

1. Support for binary files (base64 encoding)
2. URL support for remote content
3. Template variable expansion in file content
4. Caching for frequently used files

## Migration

- Existing samples with inline `content` continue to work unchanged
- No breaking changes to current functionality
- Teams can gradually adopt `content_file` as needed
