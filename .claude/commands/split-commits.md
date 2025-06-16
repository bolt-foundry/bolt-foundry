---
name: split-commits
description: Intelligently split commits into logical, atomic units based on features and dependencies
---

# Split Commits Intelligently

Splits a single commit containing multiple changes into smaller, logical commits
ordered by dependencies.

## Overview

This command helps you break apart commits that contain multiple unrelated
changes or features. It analyzes dependencies between changes and creates atomic
commits that:

- Group related functionality together
- Order commits from least to most dependent
- Ensure each commit can build and test independently

## Process

### 1. Analyze Current Changes

First, examine all uncommitted changes:

```bash
sl diff
```

Review the changes and identify:

- Distinct features or bug fixes
- Dependencies between changes
- Shared functionality that should stay together

### 2. Group Changes Logically

Group changes by **feature/functionality**, not by file type:

✅ **Good groupings:**

- All changes for "Add user authentication" (model, API, UI)
- All changes for "Fix database connection bug" (config, retry logic, tests)
- All changes for "Refactor logging system" (interface, implementations, tests)

❌ **Bad groupings:**

- All TypeScript files in one commit
- All test files in another commit
- All documentation in a third commit

### 3. Determine Dependency Order

Order commits from least to most dependent:

1. **Infrastructure/utilities** - Helper functions, types, configs
2. **Core functionality** - Main feature implementation
3. **Integration** - Code that uses the new functionality
4. **Tests** - Tests for the new features
5. **Documentation** - Updates to docs reflecting the changes

### 4. Execute the Split

Use Sapling's non-interactive split workflow:

```bash
# 1. Uncommit the current commit (keeps changes in working directory)
sl uncommit

# 2. Create first commit with least dependent changes
sl add src/utils/newHelper.ts src/types/newTypes.ts
sl commit -m "Add helper functions and types for feature X"

# 3. Create second commit with core functionality
sl add src/core/featureX.ts src/api/featureXEndpoint.ts
sl commit -m "Implement feature X core functionality"

# 4. Create third commit with integration
sl add src/components/FeatureXComponent.tsx
sl commit -m "Add UI component for feature X"

# 5. Commit remaining changes
sl commit -m "Add tests and documentation for feature X"
```

## Guidelines

### Atomic Commits

Each commit should:

- Have a single, clear purpose
- Include all changes needed for that purpose
- Build and test successfully on its own
- Not break existing functionality

### Dependency Analysis

Before splitting, ask yourself:

- Which changes depend on others?
- What's the minimal set of changes needed for each feature?
- Can each commit be deployed independently?

### Testing Each Commit

After creating each commit, verify it works:

```bash
# After each commit
bff test
bff check
```

## Examples

### Example 1: Mixed Feature and Bug Fix

**Original commit contains:**

- Bug fix for database connections
- New user profile feature
- Logging improvements

**Split into:**

1. `Fix database connection timeout handling`
2. `Improve logging output format`
3. `Add user profile management feature`

### Example 2: Large Feature with Dependencies

**Original commit contains:**

- New GraphQL types
- GraphQL resolver implementation
- React components using the GraphQL
- Tests for everything

**Split into:**

1. `Add GraphQL types for order management`
2. `Implement order management resolvers`
3. `Add order management UI components`
4. `Add tests for order management feature`

## Limitations

### Hunk-Level Splitting

When a single file contains multiple unrelated changes, you'll need human
intervention:

- `sl split` - Interactive hunk selection (requires human)
- `sl commit --interactive` - Interactive staging (requires human)

**Workaround for mixed files:**

1. Manually separate changes into different files temporarily
2. Create commits
3. Recombine if needed

### Best Practice

Avoid needing to split by:

- Making smaller, focused changes
- Committing more frequently
- Using `sl commit file1 file2` to commit specific files

## Command Summary

```bash
# View current changes
sl diff

# Uncommit current commit
sl uncommit

# Stage specific files
sl add file1 file2

# Create focused commit
sl commit -m "Descriptive message"

# Verify each commit
bff test && bff check
```
