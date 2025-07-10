# aibff Implementation Plan

## Overview

aibff is a public binary that provides tools for working with Bolt Foundry's
deck evaluation system.

## Related Documents

- [Product Plan](../../guides/product-plan.md) - Version roadmap and feature
  breakdown
- [REPL Implementation Plan](./2025-06-repl-implementation-plan.md) -
  Interactive assistant details

Starting with `aibff eval`, it will run evaluations on markdown deck files
(.deck.md) with support for TOML/JSONL sample inputs and produce structured TOML
output.

## Goals

| Goal                      | Description                                                  | Success Criteria                                       |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Public eval tool          | Ship a standalone binary for deck evaluation                 | Can run `aibff eval deck.deck.md` and get TOML results |
| Simple operations         | All commands have clear, predictable behavior                | No file overwrites, no deletions, clear output         |
| Clean room implementation | Rebuild eval functionality without coupling to bff internals | Self-contained in apps/aibff with minimal dependencies |
| Multiple input modes      | Support deck calibration, file input, and stdin streaming    | Can handle no input, TOML/JSONL files, and piped JSONL |

## Anti-Goals

| Anti-Goal                         | Reason                                              |
| --------------------------------- | --------------------------------------------------- |
| Full bff parity                   | aibff is focused on AI-safe subset of functionality |
| Complex dependency management     | Keep it simple with Deno's built-in capabilities    |
| Multiple output formats initially | Start with TOML only, add formats later if needed   |
| Over-engineering file structure   | Keep it flat and simple - just a few files          |

## Technical Approach

The implementation leverages existing Bolt Foundry packages and keeps things
simple:

1. **Markdown Deck Parser**: Import existing `parseMarkdownToDeck` from
   `packages/bolt-foundry/builders/markdown/`

2. **Input Handling**: Three modes of operation:
   - Calibration mode (no input): Use samples embedded in the deck
   - File mode: Read TOML or JSONL files specified via CLI args
   - Stream mode: Process JSONL from stdin for pipeline integration

3. **Evaluation Engine**: Import and adapt existing eval logic from
   `packages/bolt-foundry/evals/`

4. **Binary Distribution**: Use `deno compile` to create standalone executables
   for different platforms.

## Components

| Status | Component | Purpose                                              |
| ------ | --------- | ---------------------------------------------------- |
| [ ]    | main.ts   | CLI entry point and command routing                  |
| [ ]    | eval.ts   | All eval logic - parsing, running, formatting output |
| [ ]    | types.ts  | Shared types if needed                               |

## Technical Decisions

| Decision             | Reasoning                                                            | Alternatives Considered                                        |
| -------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Deno runtime         | Built-in TypeScript, easy binary compilation, secure by default      | Node.js (more complex bundling), Rust (steeper learning curve) |
| TOML-first output    | Human-readable, supports complex structures, aligns with deck format | JSON (less readable), YAML (parsing ambiguities)               |
| Import existing code | Reuse battle-tested deck parser and eval logic                       | Writing from scratch (unnecessary work)                        |
| Markdown AST parsing | Robust, handles edge cases, extensible                               | Regex parsing (brittle), custom parser (complex)               |

## Next Steps

| Question                     | How to Explore                                                     |
| ---------------------------- | ------------------------------------------------------------------ |
| How to handle deck embeds?   | Test with sample decks that use the embed syntax                   |
| Error handling strategy?     | Design graceful failures for missing files, bad inputs, LLM errors |
| Platform targets for binary? | Identify which OS/arch combinations to compile for                 |

## Implementation Details

### Environment Variables

- `OPENROUTER_API_KEY` - Required for LLM access

### CLI Usage

```bash
# Calibration mode (uses deck's internal samples)
aibff eval grader.deck.md

# File input mode
aibff eval grader.deck.md samples.toml
aibff eval grader.deck.md samples.jsonl

# Stdin mode
echo '{"userMessage": "test", "assistantResponse": "response"}' | aibff eval grader.deck.md
```
