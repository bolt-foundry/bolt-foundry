---
name: bff-commit
description: Create a commit using BFF with automatic formatting, linting, and PR submission
---

# BFF Commit

Creates a commit using the Bolt Foundry Friend (BFF) tool with automatic
pre-commit checks and PR submission.

## Usage

```bash
bff commit -m "Your commit message"
```

## Options

- `-m "message"` - The commit message (required)
- `--skip-pre-check` - Skip formatting, linting, and type checking
- `--no-submit` - Create commit without submitting a pull request
- `file1 file2` - Commit only specific files

## Default Behavior

By default, `bff commit` will:

1. Run pre-commit checks:
   - `bff format` - Format code
   - `bff lint` - Run linting rules
   - `bff check` - Type checking
2. Create the commit
3. Submit a pull request

## When to Use Options

### Use `--skip-pre-check` when:

- Committing generated files that might not pass linting
- In the middle of a refactor and need to save progress
- You've already run checks manually
- Committing documentation-only changes

### Use `--no-submit` when:

- Creating multiple commits before submitting a stack
- Want to review commits locally first
- Working on experimental changes
- Need to amend or rebase before creating a PR

## Best Practices

1. **Review before committing**
   - Use `bff status` to verify which files will be included
   - Use `bff diff` to review the actual content changes
   - Make sure to `sl add` new files and `sl remove` deleted files

2. **Commit message structure**
   - First line: concise summary (50-72 characters)
   - Empty line after summary
   - Body: detailed explanation of what and why
   - List specific changes with bullet points
   - Include test plans where appropriate

## Example Commit Message

```
Remove connection implementation from GraphQL builder

Simplify the initial implementation by removing Relay Connection support.
Focus on core scalar fields, object fields, and mutations for v1.

Changes:
- Remove connection method, interface, and imports from makeGqlBuilder.ts
- Remove connection tests from makeGqlBuilder.test.ts
- Create placeholder for gqlSpecToNexus.ts with TODOs

Test plan:
1. Run tests: `bff test apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts`
2. Verify builder supports scalar fields, objects, and mutations

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## AI-Safe Alternative

For AI agents, use: `bff precommit` to stage files and run pre-commit checks
