# Phase 3: Legacy Code Cleanup

## Overview

This memo outlines the plan to remove all legacy environment variable code after
phases 1 and 2 are complete and stable.

## Legacy Code to Remove

### 1. getConfigurationVariable System

- `/packages/get-configuration-var/` - Entire package can be removed
- All imports of `@bfmono/packages/get-configuration-var` throughout codebase
- Associated tests and documentation

### 2. Old Environment File References

- All references to `.env.client` and `.env.server` in:
  - Documentation
  - Scripts
  - CI/CD pipelines
  - Docker configurations
  - Development setup guides

### 3. Legacy BFT Commands

- Any old BFT tasks that reference deprecated env patterns
- Legacy secret injection commands
- Commands that still use `.env.client` or `.env.server` naming

### 4. Manual Environment Loading

- Custom env file parsing code
- Manual `Deno.env.get()` calls that should use `import.meta.env`
- Direct `process.env` access in any remaining Node.js code

## Cleanup Strategy

### Step 1: Deprecation Notices

Before removing anything:

1. Add deprecation warnings to `getConfigurationVariable`
2. Log usage of deprecated patterns to identify stragglers
3. Update team documentation about deprecated patterns

### Step 2: Codemod Development

Create automated migrations for common patterns:

```typescript
// Codemod to transform:
const value = getConfigurationVariable("MY_VAR");

// Into:
const value = import.meta.env.MY_VAR;
```

### Step 3: Package by Package Migration

1. Run codemods on each package
2. Manually review and fix edge cases
3. Update package tests
4. Remove package dependencies on legacy code

### Step 4: Infrastructure Updates

1. Update CI/CD to remove old env file references
2. Update deployment scripts
3. Update developer onboarding docs
4. Remove old example files after confirming they're not needed

### Step 5: Final Removal

1. Delete `/packages/get-configuration-var/`
2. Remove legacy BFT commands that use old patterns
3. Clean up any remaining references
4. Update monorepo workspace configuration

## Verification Checklist

Before considering this phase complete:

- [ ] No imports of `@bfmono/packages/get-configuration-var` remain
- [ ] No references to `.env.client` or `.env.server` in code
- [ ] All apps use `injectEnvironment(import.meta)`
- [ ] All env access uses `import.meta.env`
- [ ] CI/CD pipelines updated
- [ ] Documentation updated
- [ ] No failing tests due to env changes
- [ ] Team trained on new patterns

## Risk Mitigation

### Gradual Rollout

1. Start with least critical apps
2. Monitor for issues in production
3. Keep legacy code available but deprecated
4. Have rollback plan ready

### Testing Strategy

1. Comprehensive integration tests before removal
2. Test all deployment scenarios
3. Verify local development still works
4. Test with fresh developer setup

### Communication

1. Team-wide announcement before starting
2. Migration guide for active branches
3. Support channel for questions
4. Post-mortem after completion

## Success Metrics

- Zero runtime errors related to missing env vars
- Reduced code complexity (fewer LOC)
- Improved type coverage
- Faster build times (less code to process)
- Clearer onboarding for new developers

## Notes

- This phase should only begin after phases 1 and 2 have been in production for
  at least 2 weeks
- Keep detailed logs of what was removed for future reference
- Consider archiving (not deleting) the old code initially
- Document lessons learned for future large-scale refactors
