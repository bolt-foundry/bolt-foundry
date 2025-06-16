# AIBFF REPL Product Plan

## Overview

The AIBFF REPL is an interactive environment for creating and refining graders
that evaluate samples against Bolt Foundry deck specifications.

## Related Documents

- [REPL Implementation Plan](../plans/2025-06-repl-implementation-plan.md) -
  Detailed technical implementation approach
- [Main Implementation Plan](../plans/implementation-plan.md) - Overall aibff
  architecture and design decisions

## Implementation Principles

- **Clean Room Implementation**: Self-contained in apps/aibff with minimal
  dependencies
- **Deck-Based Architecture**: Leverages existing Bolt Foundry deck system
- **TOML-First**: Human-readable format for configuration and output
- **Security by Default**: File access restricted to current working directory
- **Simple Operations**: Clear, predictable behavior with no destructive
  operations

## Version Roadmap

| Version    | Goal                       | Key Features                                                                                                                                                                                                                                         |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v0.1.0** | Basic REPL Entry & Session | • `aibff repl` command entry point<br>• Basic conversation loop (input/output)<br>• Simple terminal UI (white assistant text, dim user text)<br>• `conversation.md` history logging<br>• `progress.md` state tracking<br>• Exit/resume functionality |
| **v0.2.0** | Session Management         | • Session folder creation with creative teacher names<br>• TOML frontmatter for state metadata<br>• Basic folder structure setup<br>• Session persistence and resumption                                                                             |
| **v0.3.0** | Assistant Foundation       | • `grader-assistant.deck.md` implementation<br>• `grader-assistant.deck.toml` with contexts and samples<br>• Basic assistant personality and role<br>• Simple conversational responses                                                               |
| **v0.4.0** | Tool Integration           | • Tool definitions in deck TOML<br>• Command execution through tool calls<br>• Basic error handling and output display<br>• Integration with existing `eval` command                                                                                 |
| **v0.5.0** | Sample Processing          | • Accept pasted samples in conversation<br>• Store attachments in session folder<br>• Basic sample parsing and validation<br>• Convert samples to workable format                                                                                    |
| **v0.6.0** | Grader Generation          | • Generate `grader.deck.md` from samples<br>• Generate `grader.deck.toml` with initial rules<br>• Basic TOML generation from refined samples<br>• Save grader files in session folder                                                                |
| **v0.7.0** | Interactive Refinement     | • Discussion and refinement workflow<br>• Update grader based on feedback<br>• LLM-assisted evaluation of samples<br>• Iterative improvement loop                                                                                                    |
| **v0.8.0** | Editor Integration         | • xdg-open integration for $EDITOR<br>• Open workspace folder functionality<br>• File watching for external changes<br>• Session folder renaming after purpose is clear                                                                              |
| **v0.9.0** | Polish & Stability         | • Comprehensive error handling<br>• API key management (`.env.local`)<br>• First-run onboarding experience<br>• Performance optimizations<br>• Bug fixes from testing                                                                                |

## Version 1.0 - Core Grader Functionality

### Purpose

Enable users to create and maintain graders through an interactive REPL that:

- Accepts various sample inputs through conversation
- Refines samples with user collaboration
- Generates TOML configurations
- Manages grader workspaces integrated with the user's editor

### Core Features

#### 1. Workspace Management

- Initialize grader folders according to specification
- Manage grader deck files (.card.md format)
- Open workspace and files in user's $EDITOR using xdg-open
- Maintain grader file organization

#### 2. Sample Processing

- Accept pasted samples in conversation (any format)
- Interactive discussion and refinement with user
- Convert refined samples to TOML format
- Support iterative refinement process

#### 3. Grader Operations

- **Create New Graders**: Initialize from samples, generate initial deck
- **Update Existing Graders**: Load existing grader, add/modify based on new
  samples
- Automatic deck file updates based on LLM evaluation
- Preserve user customizations while applying updates

#### 4. Workflow Support

**New Grader Creation Flow:**

1. Start REPL
2. Initialize grader folder
3. Paste initial samples
4. Discuss and refine with user
5. Generate TOML configuration
6. Create initial grader deck
7. Open in editor for review

**Existing Grader Update Flow:**

1. Start REPL with existing grader
2. Load current grader configuration
3. Add new samples
4. Evaluate against current deck
5. Generate update recommendations
6. Apply updates automatically
7. Open in editor for review

### Technical Requirements

- Integration with existing Bolt Foundry deck/card system
- TOML generation and parsing
- File system operations for workspace management
- Editor integration via xdg-open
- Conversational UI for sample refinement

## Future Versions

Future versions (v1.1, v1.2, v2.0, etc.) will be defined based on:

- User feedback from v1.0
- Emerging use cases
- Integration needs with other Bolt Foundry tools

Potential areas for future development:

- Batch sample processing
- Advanced grading logic
- Evaluation system integration
- Collaboration features
- Template systems

## Technical Notes

### Binary Distribution

The REPL will be distributed as part of the aibff binary, compiled using
`deno compile` for:

- Linux x64
- macOS arm64

### Dependencies

- Leverages existing Bolt Foundry packages:
  - `packages/bolt-foundry/builders/markdown/` for deck parsing
  - `packages/bolt-foundry/evals/` for evaluation logic
- Uses OpenRouter API for LLM access (requires `OPENROUTER_API_KEY`)
