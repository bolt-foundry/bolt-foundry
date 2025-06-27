# BFF to BFT Rename Implementation Plan

*Last Updated: 2025-06-27 - Added implementation insights from Phase 1 completion and AI deck system*

## Overview

This plan documents the comprehensive rename of the `bff` (Bolt Foundry Friend)
command to `bft` (Bolt Foundry Task) to prevent confusion with the `aibff`
command when working with AI assistants like Claude Code.

## Motivation

- Claude Code frequently confuses `bff` and `aibff` commands
- Clear separation needed between task runner (`bft`) and AI tool (`aibff`)
- `bft` clearly indicates "Bolt Foundry Task" purpose

## Scope

### In Scope

- Rename the `bff` command to `bft`
- Update all file extensions from `.bff.ts` to `.bft.ts`
- Rename the `/infra/bff/` directory to `/infra/bft/`
- Update all code references, imports, and documentation
- Maintain backward compatibility during transition

### Out of Scope

- `aibff` command remains unchanged
- No functional changes to commands
- No changes to command behavior

## Completed Phases

### Phase 1: Core BFT Implementation ✅

Created a cleanroom implementation of BFT with modern architecture:

1. **Directory Structure**:
   - Created `/infra/bft/` with clean separation from BFF
   - Tasks live in `/infra/bft/tasks/` (not "friends")
   - Created `/packages/cli-ui/` for shared output handling

2. **Export-Based Discovery**:
   ```typescript
   // Each task exports its definition
   export const bftDefinition = {
     description: "Task description",
     fn: taskFunction,
     aiSafe?: boolean
   } satisfies TaskDefinition;
   ```

3. **Built-in Tasks**:
   - `help` - Lists all available tasks with AI-safe indicators
   - `run` - Executes .bft.ts files with shebang support
   - `echo` - Simple example task
   - `deck` - AI deck file management

4. **Key Features**:
   - Autodiscovery of both `.bft.ts` and `.bft.deck.md` files
   - Proper stdout/stderr separation via cli-ui package
   - Support for executable scripts with `#!/usr/bin/env -S bft run`

### Phase 2: AI Deck System ✅

Implemented native support for AI-powered deck files:

1. **Deck Format** (`.bft.deck.md`):
   ```markdown
   +++
   [meta]
   version = "1.0"
   purpose = "Deck purpose"
   +++
   
   # System Prompt
   
   Markdown content becomes the system prompt.
   
   ![](./context-file.toml)
   ```

2. **Context Injection**:
   - TOML files define contexts with `assistantQuestion` and `description`
   - Contexts injected as assistant/user message pairs
   - Support for default values and required parameters

3. **Deck Commands**:
   - `bft deck run` - Execute with context parameters
   - `bft deck render` - Convert to OpenAI format
   - `bft deck list` - Find deck files
   - `bft deck validate` - Check syntax

4. **Example Decks**:
   - `commit.bft.deck.md` - Bolt Foundry style commit messages
   - `code-reviewer.bft.deck.md` - Code review assistant
   - `commit-message.bft.deck.md` - Conventional commits

### Phase 3: Claude Integration ✅

Built integration with Claude Code through command generation:

1. **BFT Claudify**:
   - `bft claudify` generates `.claude/commands/bft/`
   - One command file per BFT task
   - Extracts context parameters from TOML files

2. **Command Templates**:
   - Simple format: description + run instruction
   - Parameter hints for deck commands
   - `$ARGUMENTS` placeholder for user input

## Future Phases

### Phase 4: Enhanced Claude Integration

1. **Deck Render Markdown Format**:
   - Add `--format markdown` option to deck render
   - Execute shell commands to inject real context
   - Output ready-to-execute prompts for Claude

2. **Automatic Command Generation**:
   - Integrate claudify into `bff land` workflow
   - Add `.claude/commands/bft/` to `.gitignore`
   - Treat Claude commands as build artifacts

### Phase 5: Migrate Existing BFF Tasks

1. **Task Migration**:
   - Move tasks from `/infra/bff/friends/` to `/infra/bft/tasks/`
   - Convert from `register()` to `export const bftDefinition`
   - Update imports and function names

2. **File Updates**:
   - Rename `.bff.ts` to `.bft.ts`
   - Update shebang lines via lint rule
   - Update all import paths

3. **Compatibility**:
   - Add deprecation warning to `bff` command
   - Both commands work during transition
   - Monitor usage analytics

### Phase 6: Documentation and CI Updates

1. **Documentation**:
   - Update README.md and CLAUDE.md files
   - Update all cards in `/decks/cards/`
   - Update onboarding guides

2. **CI/CD**:
   - Update GitHub Actions workflows
   - Update build scripts
   - Update deployment processes

### Phase 7: Final Cleanup

1. **Remove BFF**:
   - 30-day deprecation period
   - Remove `/infra/bff/` directory
   - Remove `bff` executable

2. **Verification**:
   - All tasks migrated successfully
   - No remaining BFF references
   - Analytics confirm zero BFF usage

## Key Architectural Differences (BFF vs BFT)

### Task Discovery
- **BFF**: Uses `register()` function calls within task files
- **BFT**: Uses export-based discovery with `export const bftDefinition`

### File Organization
- **BFF**: Tasks in `/infra/bff/friends/` directory
- **BFT**: Tasks in `/infra/bft/tasks/` directory

### Task Types
- **BFF**: Only supports `.bff.ts` executable files
- **BFT**: Supports both `.bft.ts` executables and `.bft.deck.md` AI decks

### Output Handling
- **BFF**: Direct console.log usage throughout
- **BFT**: Centralized CLI UI package for proper stdout/stderr separation

### AI Integration
- **BFF**: No built-in AI support
- **BFT**: Native support for AI deck files with context injection

## Technical Changes

### File Renames

```bash
# Executable
/infra/bin/bff → /infra/bin/bft

# Main directory
/infra/bff/ → /infra/bft/

# Task files (40+ files)
/infra/bff/friends/*.bff.ts → /infra/bft/tasks/*.bft.ts

# New AI deck files
/infra/bft/tasks/*.bft.deck.md

# Core files
/infra/bff/bff.ts → /infra/bft/bft.ts
```

### Code Updates

1. **Shebang Updates** (all .bft.ts files):
   ```typescript
   #! /usr/bin/env -S bft
   ```

2. **Import and Export Updates**:
   ```typescript
   // Before (BFF style)
   import { register } from "@bfmono/infra/bff/bff.ts";
   register("taskname", "description", taskFn);

   // After (BFT style)
   import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
   export const bftDefinition = {
     description: "Task description",
     fn: taskFn,
     aiSafe: true
   } satisfies TaskDefinition;
   ```

3. **Function Renames**:
   ```typescript
   // Before
   trackBffCommand(commandName, args);

   // After
   trackBftCommand(commandName, args);
   ```

### Documentation Updates

Update all references in:

- README.md
- CLAUDE.md files
- All card files in /decks/cards/
- GitHub Actions workflow files
- Shell scripts

Example changes:

```bash
# Before
bff build
bff test
bff ai <command>

# After
bft build
bft test
bft ai <command>
```

## Migration Guide for Developers

### Immediate Actions

1. Start using `bft` instead of `bff` for new work
2. Update local aliases and scripts
3. Update documentation as you work

### Transition Period

- Both `bff` and `bft` will work for 30 days
- `bff` will show deprecation warning
- CI will be updated to use `bft`

### Final Migration

- After 30 days, `bff` command will be removed
- Ensure all local scripts are updated

## Risk Mitigation

1. **Backward Compatibility**: Keep `bff` as alias during transition
2. **CI/CD Impact**: Update CI first with both commands supported
3. **Developer Impact**: Clear communication and migration guide
4. **Documentation**: Update incrementally as changes are made

## Success Criteria

### Completed ✅
- [x] Core BFT implementation with export-based task discovery
- [x] Support for both `.bft.ts` and `.bft.deck.md` files
- [x] AI deck system with context injection
- [x] CLI UI package for proper output handling
- [x] BFT claudify command for Claude integration
- [x] Clear separation between `bft` and `aibff` in design

### Remaining
- [ ] Deck render --format markdown for Claude
- [ ] Integration with `bff land` for auto-generating Claude commands
- [ ] All existing BFF tasks migrated to BFT format
- [ ] CI/CD pipelines updated to use `bft`
- [ ] All documentation updated
- [ ] Clean removal of `bff` after transition period

## Timeline Summary

### Completed (2025-06-27)
- ✅ Phase 1: Core BFT Implementation
- ✅ Phase 2: AI Deck System
- ✅ Phase 3: Claude Integration (claudify command)

### In Progress
- 🔄 Phase 4: Enhanced Claude Integration (markdown format)

### Upcoming
- ⏳ Phase 5: Migrate Existing BFF Tasks
- ⏳ Phase 6: Documentation and CI Updates
- ⏳ Phase 7: Final Cleanup

## Notes

### Original Planning Notes
- Lint rule in Phase 4 automates shebang updates, avoiding manual errors
- Consider additional lint rules for import path updates
- Monitor PostHog analytics for `bff` usage during transition
- Coordinate with teams using automated tooling
- Update onboarding documentation immediately

### Implementation Insights (Added 2025-06-27)
- Export-based task discovery proved cleaner than register() pattern
- AI deck system enables powerful LLM integration without complex code
- CLI UI separation essential for proper command piping
- Claude integration through generated commands avoids tight coupling
- Treating Claude commands as build artifacts (gitignored) simplifies maintenance
- "Tasks" terminology more intuitive than "friends" for CLI commands
