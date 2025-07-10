# aibff render Command Enhancements Implementation Plan

## Overview

The `aibff render` command currently provides basic deck rendering functionality
but lacks many of the planned features for context injection, formatting
options, and advanced output control. This plan outlines the enhancements needed
to make the render command fully functional according to the original
specification, enabling developers to effectively debug, test, and understand
deck processing with dynamic context injection.

## Goals

| Goal                    | Description                                                   | Success Criteria                                               |
| ----------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| Context Injection       | Support dynamic context variables via CLI args and JSON files | Can render decks with context provided via --context and files |
| Flexible Output Formats | Provide both human-readable text and raw JSON formats         | --format text\|json produces appropriate output                |
| File Output             | Allow saving rendered output to files                         | --output writes to specified file with success message         |
| Sample Selection        | Enable rendering specific samples from decks                  | --samples filters which samples are rendered                   |
| Enhanced CLI UX         | Add proper help, error handling, and colored output           | --help shows all options, errors are clear and actionable      |
| Model Configuration     | Allow specifying target model for rendering                   | --model changes the model field in rendered output             |

## Anti-Goals

| Anti-Goal                  | Reason                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| Interactive Context Editor | Keep implementation focused on CLI args for now                    |
| Template Management System | Avoid complexity - users can manage JSON files themselves          |
| Deck Validation Framework  | Separate concern - focus on rendering what's provided              |
| API Call Execution         | Render command should only show what would be sent, not execute it |

## Technical Approach

The enhancements will build upon the existing simple implementation by adding a
proper argument parser, context handling system, and multiple output formatters.
The approach preserves the core rendering logic while adding layers of
functionality around it.

### Argument Parsing Strategy

Instead of manual argument parsing, we'll implement a structured approach that:

1. Parses flags and options before positional arguments
2. Validates option combinations
3. Provides clear help documentation
4. Handles both short and long flag formats where appropriate

### Context Handling

Context injection will support two mechanisms:

1. **Direct CLI arguments**: Parse `--context key=value` pairs into a context
   object
2. **JSON file loading**: Read and validate JSON files specified with
   `--context-file`

Both mechanisms will merge into a single context object passed to
`deck.render()`.

### Output Formatting

The render output will support multiple formats:

1. **Text format**: Human-readable with clear sections, optional colors
2. **JSON format**: Raw OpenAI-compatible format for integration
3. **File output**: Both formats can be written to files

## Components

| Status | Component      | Purpose                                                     |
| ------ | -------------- | ----------------------------------------------------------- |
| [ ]    | ArgumentParser | Parse and validate CLI arguments with proper flag handling  |
| [ ]    | ContextLoader  | Load and merge context from CLI args and JSON files         |
| [ ]    | TextFormatter  | Format rendered deck as human-readable text with sections   |
| [ ]    | JsonFormatter  | Format rendered deck as clean JSON output                   |
| [ ]    | OutputWriter   | Handle writing to stdout or files with appropriate messages |
| [ ]    | HelpDisplay    | Generate comprehensive help text for all options            |
| [ ]    | ColorSupport   | Add optional colored output for better readability          |
| [ ]    | ErrorHandler   | Provide clear, actionable error messages for common issues  |

## Technical Decisions

| Decision                   | Reasoning                                             | Alternatives Considered               |
| -------------------------- | ----------------------------------------------------- | ------------------------------------- |
| Custom argument parser     | Need specific handling for repeated --context flags   | Using a library (too heavy for needs) |
| Merge context sources      | Allow both CLI and file contexts to be used together  | Only one context source at a time     |
| Default to text format     | More user-friendly for debugging and development      | Default to JSON (less readable)       |
| Use Deno's built-in colors | Lightweight, no dependencies, works well in terminals | Chalk or other color libraries        |
| Validate context as JSON   | Ensures consistent handling and clear error messages  | Allow arbitrary string values         |

## Implementation Steps

### Phase 1: Argument Parsing Infrastructure

1. Create ArgumentParser to handle all CLI options
2. Implement help display with --help flag
3. Add validation for required arguments and option combinations

### Phase 2: Context Handling

1. Implement --context key=value parsing with JSON validation
2. Add --context-file loading with error handling
3. Create context merging logic for multiple sources

### Phase 3: Output Formatting

1. Implement TextFormatter with section headers and structure
2. Add JsonFormatter for raw output
3. Create OutputWriter for file handling with --output

### Phase 4: Enhanced Features

1. Add --samples filtering for specific sample rendering
2. Implement --model option to override default model
3. Add --no-color flag and color support for text output
4. Implement --verbose mode with additional metadata

### Phase 5: Testing and Polish

1. Update existing tests to cover new functionality
2. Add integration tests for complex scenarios
3. Ensure error messages are helpful and consistent

## Next Steps

| Question                                      | How to Explore                                        |
| --------------------------------------------- | ----------------------------------------------------- |
| What color scheme works best for text output? | Review other CLI tools, test in different terminals   |
| Should --verbose show token counts?           | Check if deck.render() provides this metadata         |
| How to handle invalid context variable names? | Test with deck builder to see validation requirements |
| Should we support YAML context files too?     | Assess user needs and implementation complexity       |

## Test Requirements

Following TDD practices, we need tests for:

1. **Argument parsing**: All flag combinations and validation
2. **Context loading**: Valid/invalid JSON, file errors, merging
3. **Output formats**: Text and JSON formatting correctness
4. **File operations**: Writing to files, permission errors
5. **Error scenarios**: Missing files, invalid options, bad context
6. **Integration**: Full command execution with various options

## Success Metrics

- All planned CLI options are implemented and documented
- Context injection works seamlessly with both CLI args and files
- Output formats are clear and useful for their intended purposes
- Error messages guide users to successful command usage
- Tests cover all major code paths and edge cases
- Command integrates smoothly with other aibff tools
