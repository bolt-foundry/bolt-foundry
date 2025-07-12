# Agent Infrastructure Redesign

**Date**: 2025-07-12\
**Status**: Planning\
**Goal**: Redesign agent command generation to use `.agents/` as source of truth

## Current State

- `bft claudify` generates Claude commands in `.claude/commands/bft/`
- `.claude/commands/bft/` is gitignored
- `AGENTS.md` and `CLAUDE.md` are separate files in repo root
- Agent configuration scattered across multiple locations

## Proposed Architecture

### Directory Structure

```
.agents/
  commands/
    bft/
      AGENTS.md        # Source of truth for agent instructions
      {command}.md     # Generated command files for each BFT task
.claude/
  commands/
    bft/              # Symlink to .agents/commands/bft/
AGENTS.md             # Symlink to .agents/commands/bft/AGENTS.md
CLAUDE.md             # Symlink to .agents/commands/bft/AGENTS.md
```

### Key Changes

1. **Source of Truth**: `.agents/commands/bft/` becomes the canonical location
2. **Symlink Architecture**: Other tools access via symlinks
3. **Generated Files**: Check in all generated files (remove from .gitignore)
4. **Single Command**: Replace `claudify` with `agentify`

## Implementation Plan

### Phase 1: Command Migration

1. **Remove old infrastructure**:
   - Delete existing `.claude/commands/bft/` and `.claude/commands/bft-tasks/`
   - Remove `claudify.bft.ts` command

2. **Create new command**: `agentify.bft.ts`
   - Generate all BFT command files in `.agents/commands/bft/`
   - Generate `AGENTS.md` with agent instructions
   - Create symlinks for Claude Code compatibility

3. **Update git workflow**:
   - Remove `.claude/commands/bft` from .gitignore
   - Check in all generated files as build artifacts

### Phase 2: Integration

1. **Symlink Management**:
   - `.claude/commands/bft/` → `.agents/commands/bft/`
   - `AGENTS.md` → `.agents/commands/bft/AGENTS.md`
   - `CLAUDE.md` → `.agents/commands/bft/AGENTS.md`

2. **Commit Integration**:
   - Run `bft agentify` as part of commit process
   - Treat as generated code (like TypeScript compilation)

## Benefits

1. **Single Source of Truth**: All agent config in one place
2. **Tool Agnostic**: Easy to add support for other AI tools
3. **Version Control**: Generated files tracked for debugging
4. **Consistency**: Follows existing patterns for generated code

## Migration Strategy

- **Breaking Change**: This replaces existing `claudify` workflow
- **Cleanup**: Existing `.claude/commands/` content will be regenerated
- **Rollback**: Can revert symlinks if needed during transition

## Future Extensions

This architecture supports future agent tools:

- Cursor AI integration
- Custom agent tool support
- Tool-specific command formats

The symlink approach allows multiple tools to consume the same command
definitions while maintaining tool-specific compatibility layers.
