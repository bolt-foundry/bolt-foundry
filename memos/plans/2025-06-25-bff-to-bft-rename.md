# BFF to BFT Rename Implementation Plan

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

## Implementation Strategy

### Phase 1: Create Parallel Structure with Clean Implementation

1. Create `/infra/bft/` directory alongside `/infra/bff/`
2. Create new cleanroom implementation of core files in `/infra/bft/`:
   - `bft.ts` (minimal implementation with help functionality and command
     loading)
   - `bin/bft.ts` (executable file that loads and runs commands)
   - Basic command registration system
3. Create `bft` executable in `/infra/bin/` pointing to new implementation
4. Configure `bft` to load and execute `.bff.ts` files from
   `/infra/bff/friends/`
5. Implement `--help` command that lists all available commands from current
   location
6. Test that `bft --help` shows all commands and `bft <command>` executes them

### Phase 2: Migrate Friend Commands

1. Move all friend files from `/infra/bff/friends/` to `/infra/bft/friends/`
2. Rename all `.bff.ts` files to `.bft.ts` in the new location
3. Update imports in friend files to use new `/infra/bft/` paths
4. Update function names (e.g., `trackBffCommand` to `trackBftCommand`)
5. Add deprecation warnings to `bff` command
6. Configure `bff` to also load friends from `/infra/bft/friends/` for backward
   compatibility
7. Verify `bft --help` now shows all migrated commands
8. Test both commands work with all friends

### Phase 3: Update Documentation and CI

1. Update all documentation files (README, CLAUDE.md, etc.)
2. Update GitHub Actions workflows
3. Update shell scripts and examples
4. Update analytics tracking references

### Phase 4: Update Shebang Lines via Lint Rule

1. Create a lint rule that automatically updates shebang lines from
   `#! /usr/bin/env -S bff` to `#! /usr/bin/env -S bft`
2. Run `bft lint --fix` to automatically update all `.bft.ts` files
3. This ensures consistent updates across all files
4. Test that files execute correctly with new shebang

### Phase 5: Deprecation and Cleanup

1. Keep `bff` as alias with deprecation warning for 30 days
2. Monitor usage and assist teams with migration
3. Remove old `/infra/bff/` directory after confirming everything works
4. Final removal of `bff` command

## Technical Changes

### File Renames

```bash
# Executable
/infra/bin/bff → /infra/bin/bft

# Main directory
/infra/bff/ → /infra/bft/

# Friend commands (40+ files)
/infra/bff/friends/*.bff.ts → /infra/bft/friends/*.bft.ts

# Core files
/infra/bff/bff.ts → /infra/bft/bft.ts
```

### Code Updates

1. **Shebang Updates** (all .bft.ts files):
   ```typescript
   #! /usr/bin/env -S bft
   ```

2. **Import Updates**:
   ```typescript
   // Before
   import { register } from "@bfmono/infra/bff/bff.ts";

   // After
   import { register } from "@bfmono/infra/bft/bft.ts";
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

- [ ] All developers can use `bft` without issues
- [ ] CI/CD pipelines work with `bft`
- [ ] No confusion between `bft` and `aibff` in AI tools
- [ ] Clean removal of `bff` after transition period
- [ ] All documentation updated

## Timeline

- **Phase 1**: Create parallel structure, add deprecation warnings
- **Phase 2**: Core infrastructure updates
- **Phase 3**: Documentation and CI updates
- **Phase 4**: Update shebang lines only
- **Phase 5**: Transition period with both commands
- **Final**: Cleanup and removal of `bff`

## Notes

- Lint rule in Phase 4 automates shebang updates, avoiding manual errors
- Consider additional lint rules for import path updates
- Monitor PostHog analytics for `bff` usage during transition
- Coordinate with teams using automated tooling
- Update onboarding documentation immediately
