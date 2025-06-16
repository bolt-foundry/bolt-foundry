# aibff repl Implementation Plan

## Overview

Create an interactive AI assistant (similar to Claude Code) that helps users
build graders through a conversational interface.

## Related Documents

- [Product Plan](../../guides/product-plan.md) - Version roadmap and feature
  breakdown
- [Main Implementation Plan](./implementation-plan.md) - Overall aibff
  architecture

The assistant will guide users through gathering samples, creating graders,
running evaluations, and iterating until they have a working grader. This serves
as both a demonstration of the Bolt Foundry system and a practical tool for
grader creation.

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

| Decision                        | Reasoning                           | Alternatives Considered    |
| ------------------------------- | ----------------------------------- | -------------------------- |
| Markdown with TOML frontmatter  | Simple, human-readable state format | JSON state file, SQLite    |
| Deck-based assistant            | Consistent with system architecture | Hardcoded assistant logic  |
| Tool calls for commands         | Clean integration with existing CLI | Direct function calls      |
| Separate state and conversation | Clear separation of concerns        | Single file for everything |
| File access restricted to CWD   | Security by default                 | Full filesystem access     |
| .env.local for API keys         | Simple, standard approach           | OS-specific secure storage |

## Next Steps

| Question                  | How to Explore                                    | Answer                                                                                |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Assistant deck structure? | Review existing deck patterns and adapt           | Use deck.md with H2 cards (persona, behavior, tools) + deck.toml for contexts/samples |
| Tool definition format?   | Look at how other tools are exposed in the system | OpenAI function calling format translated to TOML                                     |
| State file location?      | Check project conventions for working files       | Create folder with creative teacher name in CWD                                       |
| Error handling approach?  | Test with invalid inputs and command failures     | Save attachments in subfolder, transform gracefully, guide fixes                      |
| Conversation UX?          | Study Claude Code interaction patterns            | Simple terminal: input line, white assistant text, dim user text                      |
| Session name collisions?  | Generate teacher names and check for existence    | Generate new creative name if collision occurs                                        |

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
- **[[tools]]**: Tool definitions using OpenAI function calling format in TOML

## Session Folder Structure

Each session creates a folder with a fun fictional teacher name that gets
renamed once the purpose is clear:

```
ms-frizzle-grader/ → customer-support-grader/  # Renamed after understanding the use case
├── progress.md          # State file with TOML frontmatter tracking workflow progress
├── conversation.md      # Full conversation history with H2 dates, H3 speakers, TOML code blocks
├── attachments/        # User's original files (preserved as-is)
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
2. Use `progress.md` to track our implementation steps and `conversation.md` for
   history
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
2. Create blank `progress.md`, `conversation.md`, `grader.deck.md`, and
   `grader.deck.toml` files
3. Document what we want the assistant to do in `progress.md`
4. Build up the grader iteratively as we understand the requirements

## Conversation History Format

The `conversation.md` file tracks all interactions between the user and
assistant:

### Structure

- **H2 headers**: Sessions (e.g., `## Session 1: 2025-06-16`,
  `## Session 2: 2025-06-17`)
- **H3 headers**: Speaker labels (`### User`, `### Assistant`,
  `### Tool: [command]`)
- **Code blocks**: Rich data in TOML format for tool executions and outputs

### Example

```markdown
## Session 1: 2025-06-16

### User

I want to create a grader for customer support responses

### Assistant

I'll help you create a grader for customer support responses. Let me start by
gathering your samples.

### Tool: aibff gather

\`\`\`toml command = "aibff gather samples.jsonl" status = "success" output =
""" Gathered 25 samples from samples.jsonl Found 3 unique categories: billing,
technical, general """ \`\`\`

### Assistant

I've successfully gathered 25 samples from your file...
```

## Security & Implementation Notes

### File System Access

- **Restriction**: Assistant can only read/write within the current working
  directory
- **Rationale**: Security by default, prevents accidental access to sensitive
  files

### API Key Management

- **Storage**: Uses `.env.local` file for persistence
- **First run**: Prompts user if not found, offers to save for future sessions
- **Flexibility**: Users can modify storage location as needed

### Deferred Decisions

Several implementation details are marked as "TBD" for future iterations:

- Tool execution confirmation requirements
- Large file handling strategies (token limit management)
- Crash recovery mechanisms
- Specific error handling for malformed inputs

These will be addressed as we gain experience with real usage patterns.
