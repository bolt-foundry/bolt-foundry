# aibff Command Structure Implementation Plan

## Overview

Restructure aibff from a single-command tool to a multi-command CLI architecture
while maintaining perfect backward compatibility with the existing `aibff eval`
functionality. This creates a foundation for future commands like `deck`,
`grader`, and `samples` without implementing them yet.

The default command when running `aibff` without arguments will be `repl`, which
provides an interactive Claude-code-like experience for building and updating
evals.

## Goals

| Goal                   | Description                          | Success Criteria                                    |
| ---------------------- | ------------------------------------ | --------------------------------------------------- |
| Command structure      | Implement extensible command pattern | `commands/` folder with modular command files       |
| Backward compatibility | Existing eval behavior unchanged     | `aibff eval grader.deck.md` works exactly as before |
| Default REPL           | Interactive mode as default          | `aibff` with no args launches REPL                  |
| Help system            | Clear command discovery              | `aibff --help` shows list of commands               |
| Error handling         | Graceful invalid command handling    | Invalid commands show error + help                  |
| Future-ready           | Support for subcommands              | Structure allows `aibff deck create` pattern        |

## Anti-Goals

| Anti-Goal             | Reason                                 |
| --------------------- | -------------------------------------- |
| New commands          | This phase only creates the structure  |
| Breaking changes      | Must maintain exact eval compatibility |
| Complex routing       | Keep command dispatch simple           |
| External dependencies | Use Deno built-ins only                |

## Technical Approach

The implementation uses a simple command dispatcher pattern:

1. **Command Router**: `main.ts` becomes a router that:
   - Parses the first argument as command name
   - Launches REPL if no command provided (default behavior)
   - Shows help if `--help` flag is provided
   - Delegates to appropriate command module
   - Handles errors with help display

2. **Command Modules**: Each command lives in `commands/` as a standalone
   module:
   - Exports a standard interface (name, description, run function)
   - Handles its own argument parsing
   - Can support subcommands internally

3. **REPL Command**: New interactive mode in `commands/repl.ts`:
   - Provides Claude-code-like experience
   - Guides users through eval creation and refinement
   - Integrates with other commands programmatically

4. **Eval Migration**: Move existing eval logic to `commands/eval.ts` unchanged

## Components

| Status | Component         | Purpose                             |
| ------ | ----------------- | ----------------------------------- |
| [ ]    | main.ts           | Command router and help display     |
| [ ]    | commands/repl.ts  | Interactive REPL mode (default)     |
| [ ]    | commands/eval.ts  | Existing eval functionality (moved) |
| [ ]    | commands/types.ts | Shared command interface            |
| [ ]    | commands/index.ts | Command registry                    |

## Technical Decisions

| Decision                 | Reasoning                      | Alternatives Considered          |
| ------------------------ | ------------------------------ | -------------------------------- |
| Simple command pattern   | Easy to understand and extend  | Complex framework (overkill)     |
| Module per command       | Clear separation of concerns   | Single file with switch (messy)  |
| Commands self-register   | Each command owns its metadata | Central configuration (coupling) |
| Deno native args parsing | No dependencies needed         | External CLI libraries           |

## Implementation Details

### Command Interface

```typescript
interface Command {
  name: string;
  description: string;
  run: (args: string[]) => Promise<void>;
}
```

### Directory Structure

```
apps/aibff/
├── main.ts              # Router and help
├── commands/
│   ├── index.ts        # Command registry
│   ├── types.ts        # Shared interfaces
│   ├── repl.ts         # Interactive REPL (default)
│   └── eval.ts         # Eval command (moved from ../eval.ts)
├── eval.ts             # (deleted after move)
└── types.ts            # (keep if has non-eval types)
```

### Usage Examples

```bash
# Launch REPL (default)
aibff

# Launch REPL explicitly
aibff repl

# Show help
aibff --help

# Run eval (unchanged behavior)
aibff eval grader.deck.md
aibff eval grader.deck.md samples.toml

# Invalid command
aibff invalid
# Output: Error: Unknown command 'invalid'
# [followed by help]
```

## Next Steps

| Question            | How to Explore                                       |
| ------------------- | ---------------------------------------------------- |
| Subcommand routing? | Test nested command parsing when implementing `deck` |
| Global flags?       | Consider where `--help`, `--version` fit             |
| Command aliases?    | Determine if `aibff e` should work for `eval`        |
