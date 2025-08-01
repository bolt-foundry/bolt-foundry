# BFT (Bolt Foundry Team) Product Vision

## Overview

BFT is the primary CLI interface for both humans and AI assistants to interact
with the Bolt Foundry ecosystem. It represents a virtual team member that can
execute tasks, answer questions, and facilitate productive interactions with the
codebase.

## Core Concept

**BFT = Bolt Foundry Team**

Rather than just a task runner, BFT embodies the concept of having a
knowledgeable team member available via CLI who can:

- Execute development tasks
- Answer questions about the codebase
- Guide users through complex workflows
- Provide consistent interfaces for both human developers and AI assistants

## Key Design Principles

### 1. Unified Interface

- Single entry point for all Bolt Foundry interactions
- Commands work identically for humans and AI assistants
- Clear distinction between REPL mode and command mode

### 2. REPL-First for Humans

- Running `bft` without arguments drops into conversational REPL
- Direct command execution with `bft <command>` for traditional CLI usage
- One-shot conversational mode with `bft --message "question or request"`

### 3. Flexible Implementation

- Commands can be implemented as:
  - **Decks**: For behavior-driven, conversational commands
  - **TypeScript files**: For traditional programmatic tasks
- Choose the best tool for each specific use case

### 4. AI-First, Human-Friendly

- Designed to eliminate confusion for AI assistants
- Clear, predictable command structure
- Rich help and discovery mechanisms
- Self-documenting interfaces

## Usage Modes

### Interactive REPL Mode

```bash
# Start the REPL
$ bft
Welcome to BFT (Bolt Foundry Team) v1.0.0
Type 'help' for available commands or 'exit' to quit.

bft> what's the status of our tests?
Running test suite analysis...
✓ All tests passing (247 tests in 12 files)
Last run: 5 minutes ago

bft> build the project
Starting build process...
✓ Build completed successfully in 23.4s

bft> exit
```

### Direct Command Mode

```bash
# Traditional command execution
bft build
bft test apps/aibff
bft deploy staging
```

### One-Shot Conversational Mode

```bash
# Single conversational interaction
bft --message "what's the best way to add a new API endpoint?"
bft -m "help me debug this failing test"
```

## Use Cases

### For Human Developers

- Quick questions in REPL mode
- Traditional commands for CI/CD
- One-shot queries for quick answers

### For AI Assistants

```bash
# Clear, unambiguous commands
bft analyze-codebase
bft implement-feature --name "user authentication"

# Conversational queries
bft --message "explain the bfDb package architecture"
```

## Architecture Implications

### Command Discovery

- Dynamic command loading from both `.bft.ts` files and `.deck.md` files
- Command routing in REPL mode
- Natural language processing for conversational inputs

### REPL Features

- Command history
- Tab completion
- Context preservation across commands
- Graceful error handling and suggestions

### Context Management

- Maintain conversation context within REPL session
- Project-aware responses based on current directory
- Integration with development environment state

## Success Metrics

1. **Adoption**: Both humans and AI consistently use BFT as primary interface
2. **Clarity**: Zero confusion between BFT and other tools (especially AIBFF)
3. **Productivity**: Reduced time to complete common tasks
4. **Discoverability**: Users can find and use commands without documentation
5. **Satisfaction**: Positive feedback on REPL interactions

## Migration Strategy

This vision informs our phased approach:

- Phase 1: Clean architecture with existing command compatibility
- Phase 2: Add basic REPL with command execution
- Phase 3: Implement conversational processing
- Phase 4: Add deck-based commands
- Phase 5: Deprecate legacy interfaces

## Next Steps

1. Design the REPL interface and interaction patterns
2. Define deck format for BFT commands
3. Create examples of both deck and TS implementations
4. Build prototype with basic REPL functionality
