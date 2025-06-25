# Implementation Plan: Rename bfDs to cfDs

**Date**: 2025-06-25\
**Author**: AI Assistant\
**Status**: Completed ✅\
**Approach**: Option B - With History Preservation

## Overview

This plan outlines the systematic approach to rename the bfDs (Bolt Foundry
Design System) to cfDs throughout the codebase. This is phase 1 of a two-phase
design system naming migration.

## Scope

### What Changes

1. **Directory Structure**
   - `/apps/bfDs/` → `/apps/cfDs/`

2. **Component Names** (60+ components)
   - All `BfDs*` prefixed components → `CfDs*`
   - Examples: `BfDsButton` → `CfDsButton`, `BfDsModal` → `CfDsModal`

3. **Import Paths** (87+ files)
   - `@bfmono/apps/bfDs/*` → `@bfmono/apps/cfDs/*`

4. **CSS and Styling**
   - `/static/bfDsStyle.css` → `/static/cfDsStyle.css`
   - CSS class prefix: `bfds-*` → `cfds-*`

5. **Context and Hooks**
   - `BfDsContext` → `CfDsContext`
   - `useBfDs` → `useCfDs`

6. **Documentation** (10+ files)
   - All references to bfDs in documentation

### What Remains Unchanged

- bfDsLite remains as-is (per requirements)

## Implementation Approach

Using **Option B: Sapling Move with History Preservation**

- All file renames will use `sl mv` to preserve history
- Allows `sl log --follow` to track changes across rename
- Ensures complete traceability of code evolution

## Implementation Steps

### Phase 1: Preparation

1. Create comprehensive file list for all changes
2. Verify no external dependencies reference bfDs
3. Ensure all tests are passing before starting

### Phase 2: Directory and File Renaming (Using Sapling)

1. **Rename main directory**:
   ```bash
   sl mv apps/bfDs apps/cfDs
   ```

2. **Rename component files** (batch operation):
   ```bash
   # Navigate to the renamed directory
   cd apps/cfDs/components
   # Rename all BfDs* files to CfDs*
   for file in BfDs*.tsx; do
     sl mv "$file" "${file/BfDs/CfDs}"
   done
   ```

3. **Rename CSS file**:
   ```bash
   sl mv static/bfDsStyle.css static/cfDsStyle.css
   ```

4. **Commit the renames** before making code changes:
   ```bash
   sl commit -m "refactor: Rename bfDs to cfDs - file structure only"
   ```

### Phase 3: Code Updates

1. Update all component exports and class names
2. Update import statements across the codebase
3. Update CSS class prefixes in style files
4. Update context and hook names

### Phase 4: Documentation Updates

1. Update all documentation references
2. Update any code examples in documentation

### Phase 5: Verification

1. Run `bff build` to verify compilation
2. Run `bff test` to ensure all tests pass
3. Run `bff e2e --build` for end-to-end validation
4. Manual spot-check of key components

## Risk Mitigation

1. **Breaking Changes**: This is a breaking change for any code using bfDs
2. **Import Errors**: Systematic approach ensures all imports are updated
3. **CSS Conflicts**: CSS class renaming prevents style conflicts
4. **Testing**: Comprehensive test suite validation at each step

## Estimated Effort

- Total files to modify: ~150+ files
- Complexity: Medium-High (requires careful sequencing)
- Benefits: Complete history preservation and traceability

## Success Criteria

1. All bfDs references successfully renamed to cfDs
2. No build errors after rename
3. All tests passing
4. No runtime errors in development environment
5. Documentation accurately reflects new naming

## Future Considerations

This plan sets up for Phase 2 where bfDsLite will be renamed to bfDs, creating a
cleaner naming hierarchy:

- Current: bfDs (→ cfDs), bfDsLite
- Phase 1: cfDs, bfDsLite ✅
- Phase 2: cfDs, bfDs (renamed from bfDsLite) ✅
