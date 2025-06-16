# aibff repl Implementation Plan

## Overview

Create an interactive AI assistant (similar to Claude Code) that helps users
build graders through a conversational interface. The assistant will guide users
through gathering samples, creating graders, running evaluations, and iterating
until they have a working grader. This serves as both a demonstration of the
Bolt Foundry system and a practical tool for grader creation.

The assistant uses the existing deck system for its behavior definition and has
access to execute aibff commands through tool calls, maintaining session state
in a markdown file with TOML frontmatter.

## Goals

| Goal                      | Description                                                                     | Success Criteria                                |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| Interactive assistant     | Claude Code-style conversational interface                                      | Users can have natural language conversations   |
| Grader creation workflow  | Guide users through sample gathering → grader creation → evaluation → iteration | Complete grader created through conversation    |
| Tool integration          | Assistant can execute aibff commands                                            | All relevant commands accessible via tool calls |
| State management          | Track progress in markdown with TOML frontmatter                                | Session state persisted and resumable           |
| Deck-based implementation | Use existing deck system for assistant                                          | Assistant behavior defined in deck files        |

## Anti-Goals

| Anti-Goal                  | Reason                                            |
| -------------------------- | ------------------------------------------------- |
| Traditional REPL commands  | Want conversational interface, not command syntax |
| Separate LLM configuration | Should demonstrate the system using itself        |
| Complex state management   | Keep it simple with markdown/TOML                 |
| Hardcoded assistant logic  | Leverage deck system for flexibility              |

## Technical Approach

Build a conversational interface that uses the deck system to define the
assistant's behavior and available tools. The assistant will have access to
execute aibff commands through tool calls, guide users through the grader
creation workflow, and maintain session state in a markdown file with TOML
frontmatter.

The implementation follows the existing command pattern in aibff, integrating
seamlessly with the CLI consolidation effort. The assistant's personality and
capabilities are defined in deck files, making it easy to iterate on the
experience.

## Components

| Status | Component         | Purpose                                        |
| ------ | ----------------- | ---------------------------------------------- |
| [ ]    | repl command      | Entry point for the interactive assistant      |
| [ ]    | Assistant deck    | Defines assistant personality and capabilities |
| [ ]    | Tool definitions  | Wraps aibff commands as callable tools         |
| [ ]    | State manager     | Handles markdown/TOML session persistence      |
| [ ]    | Conversation loop | Manages user input and assistant responses     |

## Technical Decisions

| Decision                       | Reasoning                           | Alternatives Considered   |
| ------------------------------ | ----------------------------------- | ------------------------- |
| Markdown with TOML frontmatter | Simple, human-readable state format | JSON state file, SQLite   |
| Deck-based assistant           | Consistent with system architecture | Hardcoded assistant logic |
| Tool calls for commands        | Clean integration with existing CLI | Direct function calls     |
| Single session file            | Simple to understand and debug      | Multiple state files      |

## Next Steps

| Question                  | How to Explore                                    |
| ------------------------- | ------------------------------------------------- |
| Assistant deck structure? | Review existing deck patterns and adapt           |
| Tool definition format?   | Look at how other tools are exposed in the system |
| State file location?      | Check project conventions for working files       |
| Error handling approach?  | Test with invalid inputs and command failures     |
| Conversation UX?          | Study Claude Code interaction patterns            |
