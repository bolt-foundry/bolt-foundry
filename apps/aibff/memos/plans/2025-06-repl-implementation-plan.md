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

| Question                  | How to Explore                                    | Answer                                                                                |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Assistant deck structure? | Review existing deck patterns and adapt           | Use deck.md with H2 cards (persona, behavior, tools) + deck.toml for contexts/samples |
| Tool definition format?   | Look at how other tools are exposed in the system | Tools as H2 card - need to design the format                                          |
| State file location?      | Check project conventions for working files       | Create YYYY-MM-DD-next-deck/ folder with progress.md inside                           |
| Error handling approach?  | Test with invalid inputs and command failures     | Save originals in subfolder, transform gracefully, guide fixes                        |
| Conversation UX?          | Study Claude Code interaction patterns            | Simple terminal: input line, white assistant text, dim user text                      |

## Deck Structure Details

Based on exploration of existing decks, the assistant deck should follow this
structure:

### grader-assistant.deck.md

- **H1**: Title and overview (ignored by system)
- **H2**: Main cards defining major aspects:
  - Assistant Role (persona, expertise, communication style)
  - User Context (who they are, what they need)
  - Behavior (how to guide users, priorities)
  - Tools (available commands and capabilities)
  - Workflow (step-by-step process)
  - State Management (what to track)
- **H3**: Nested cards under each H2 for specifics
- **References**: Link to TOML using
  `![description](./grader-assistant.deck.toml#section)`

### grader-assistant.deck.toml

- **[contexts]**: Dynamic variables like current_grader_path, session_id,
  user_goal
- **[samples]**: Example interactions showing good patterns
- **[tools]**: Tool definitions (format TBD - need to explore further)

## Session Folder Structure

Each session creates a folder with a fun fictional teacher name that gets
renamed once the purpose is clear:

```
ms-frizzle-grader/ → customer-support-grader/  # Renamed after understanding the use case
├── progress.md          # State file with TOML frontmatter and conversation history (collaborative)
├── original/           # User's original files (preserved as-is)
├── grader.deck.md      # Generated grader (created by assistant)
├── grader.deck.toml    # Generated grader data
└── samples.jsonl       # Processed samples ready for evaluation
```

Note: The assistant generates creative teacher names on the fly. If there's a
collision, it just generates another one.

## Onboarding & Environment Setup

### First Run Experience

1. Check for `OPENROUTER_API_KEY` environment variable
2. If missing:
   - Explain what the assistant does and why it needs an API key
   - Guide user to create an OpenRouter account and get a key
   - Prompt for the key
   - Offer to save it to `.env.local` for future sessions
3. Show welcome message explaining:
   - What the assistant can help with (creating graders)
   - Basic commands/interaction patterns
   - How to exit and resume sessions

### Environment Variables

- Required: `OPENROUTER_API_KEY` for LLM access
- Optional: Load from `.env.local` if present
- Store API key in memory for current session if entered interactively

## Testing Philosophy - Eating Our Own Dog Food

### Approach

We'll build the assistant using the same workflow it will teach users:

1. Create a session folder for developing the assistant's grader
2. Use `progress.md` to track our implementation steps
3. Build `grader.deck.md` and `grader.deck.toml` for the assistant's behavior
4. Use this grader to evaluate the assistant's responses

### Benefits

- Validates the workflow by using it ourselves
- Creates a real grader we can use for testing
- Demonstrates the pattern for future developers
- Ensures the assistant can handle its own use case

### Initial Setup

Before coding the REPL command, we'll:

1. Manually create a session folder (e.g., `professor-dumbledore-grader/`)
2. Create blank `progress.md`, `grader.deck.md`, and `grader.deck.toml` files
3. Document what we want the assistant to do in `progress.md`
4. Build up the grader iteratively as we understand the requirements
