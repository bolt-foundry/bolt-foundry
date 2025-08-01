# Content File Setup Implementation Plan

**Date**: 2025-06-22 (Updated from 2025-06-21 original)\
**Author**: Implementation Planning\
**Status**: Proposed\
**Related**: aibff grader system\
**Feature**: Add `content_file` and `content_url` support for sample messages

## Executive Summary

This memo outlines the implementation plan for updating the aibff grader system
to use external content files referenced by paths or URLs in TOML configuration
files, replacing the current approach of embedding content directly within TOML
files. This change aligns with OpenAI's completions format and improves
maintainability.

## Background

Currently, the aibff grader system embeds content (such as CSV data) directly
within TOML configuration files. Sample messages in TOML files require inline
content:

```toml
[[samples.example.messages]]
role = "user"
content = """
ID,Title,Source...
[hundreds of lines of CSV data]
"""

[[samples.example.messages]]
role = "assistant"
content = "JavaScript is a programming language..."
```

This approach:

- Makes TOML files large and difficult to read
- Complicates content management and updates
- Differs from industry standards like OpenAI's approach
- Limits the ability to organize test data effectively

## Proposed Solution

### 1. TOML Structure Changes

Allow messages to reference external files while maintaining backward
compatibility:

```toml
# Option 1: Local file reference
[[samples.example.messages]]
role = "user"
content_file = "./samples/user-question.txt"

# Option 2: URL reference
[[samples.example.messages]]
role = "assistant"
content_url = "https://example.com/data/response.json"

# Option 3: Inline content (still supported)
[[samples.example.messages]]
role = "system"
content = "You are a helpful assistant."
```

**Note**: We'll use `content_file` for local paths (matching the June memo) and
`content_url` for remote resources.

### 2. Content Loading Implementation

The aibff system will be updated to:

1. **Detect Reference Type**: Check for `content`, `content_file`, or
   `content_url` fields in message definitions
2. **Priority Order**: If multiple are present, use: `content_file` >
   `content_url` > `content`
3. **Load Content**:
   - For `content_file`: Use Deno's file system APIs to read local files
   - For `content_url`: Use fetch API to retrieve remote content
   - For `content`: Use inline content as-is
4. **Path Resolution**: Resolve `content_file` paths relative to the TOML file's
   directory
5. **Error Handling**: Log warnings and skip samples when referenced content is
   unavailable
6. **Freshness**: Always fetch fresh content without caching

### 3. Supported Content Formats

- **JSON**: For structured data
- **JSONL**: For line-delimited JSON (useful for streaming/large datasets)
- **Plain text**: For simple content (detected by file extension)

## Implementation Details

### File Organization

```
apps/aibff/decks/fastpitch/
├── sources.deck.toml          # References external content
├── syntheticSamples.deck.toml # References external content
├── data/                      # Local content files
│   ├── sample1_input.json
│   ├── sample1_output.json
│   └── synthetic/
│       ├── batch1.jsonl
│       └── batch2.jsonl
└── remote-sources.json        # Optional manifest of remote URLs
```

### Code Changes Required

1. **Update SampleMessage Interface** (`/apps/aibff/commands/render.ts`, line
   37-40):
   ```typescript
   interface SampleMessage {
     role: string;
     content?: string;
     content_file?: string;
     content_url?: string;
   }
   ```

2. **Modify Message Processing Logic** (`/apps/aibff/commands/render.ts`, lines
   263-268):
   ```typescript
   for (const message of sample.messages) {
     let messageContent = message.content || "";

     // Priority: content_file > content_url > content
     if (message.content_file) {
       const filePath = path.resolve(tomlDir, message.content_file);
       try {
         messageContent = await Deno.readTextFile(filePath);
       } catch (error) {
         ui.printWarn(
           `Failed to read content_file: ${message.content_file} - ${error.message}`,
         );
         continue;
       }
     } else if (message.content_url) {
       try {
         const response = await fetch(message.content_url);
         if (!response.ok) {
           throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }
         messageContent = await response.text();
       } catch (error) {
         ui.printWarn(
           `Failed to fetch content_url: ${message.content_url} - ${error.message}`,
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

3. **Error Handling Strategy**:
   - Log warnings for unavailable content
   - Continue processing other samples to avoid breaking the entire calibration
   - Provide summary of skipped samples at the end

## Testing Plan

1. Create test samples with `content_file` and `content_url` references
2. Test with various file types (.txt, .md, .json, .csv)
3. Test error cases:
   - Non-existent files
   - Invalid paths
   - Permission errors
   - Network failures for URLs
   - Invalid URLs
4. Verify calibration still works correctly
5. Test priority order when multiple content sources are specified

## Migration Plan

1. **Phase 1**: Implement content loading logic with backward compatibility
   - Existing samples with inline `content` continue to work unchanged
   - No breaking changes to current functionality
2. **Phase 2**: Create example content files and test with new format
3. **Phase 3**: Gradually migrate existing TOML files to use external references
   - Teams can adopt `content_file` or `content_url` as needed
4. **Phase 4**: Update documentation and examples

## Benefits

1. **Maintainability**: Easier to update content without modifying TOML
   structure
2. **Scalability**: Support for large datasets without bloating configuration
   files
3. **Flexibility**: Mix of local and remote content sources
4. **Standards Alignment**: Matches OpenAI's approach for consistency
5. **Version Control**: Better diff visibility for content changes
6. **Organization**: Better structure for test data and samples
7. **Reusability**: Content files can be shared across multiple samples

## Risks and Mitigations

| Risk                             | Mitigation                                         |
| -------------------------------- | -------------------------------------------------- |
| Network failures for URL content | Implement retry logic and graceful degradation     |
| File path resolution issues      | Use absolute paths or well-defined base paths      |
| Content format inconsistencies   | Add validation layer for loaded content            |
| Performance impact of fetching   | Consider parallel fetching for multiple references |

## Success Criteria

1. All existing TOML files can be migrated without loss of functionality
2. Content loading is transparent to downstream consumers
3. Error handling provides clear feedback about missing content
4. Performance remains acceptable even with remote content

## Next Steps

1. Review and approve this implementation plan
2. Create detailed technical design document
3. Implement proof of concept with one TOML file
4. Gather feedback and iterate
5. Full implementation and migration

## Future Enhancements

1. Support for binary files (base64 encoding)
2. Template variable expansion in file content
3. Content caching for frequently used files (with cache invalidation)
4. Authentication support for private URL content
5. Content validation schemas for different sample types
6. Parallel fetching for multiple URL references
7. Content preview/summary generation in TOML comments

## Questions for Consideration

1. Should we support content caching for development/testing scenarios?
2. Do we need a content validation schema for each sample type?
3. Should we implement a content preview/summary in TOML comments?
4. How should we handle authentication for private URL content?
5. Should we support glob patterns for loading multiple files?
6. Do we need compression support for large content files?

## Implementation Priority

Based on the June 2025 memo, the initial implementation should focus on:

1. Local file support via `content_file`
2. Basic error handling and logging
3. Maintaining backward compatibility

The URL support and other enhancements can be added in subsequent iterations.

---

_This memo merges the plans from 2025-06-21 and 2025-01-23, providing a
comprehensive approach to implementing content file support in aibff._
