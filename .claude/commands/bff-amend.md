---
name: bff-amend
description: Amend the current commit and optionally submit a PR
---

# BFF Amend

Amends the current commit using the Bolt Foundry Friend (BFF) tool.

## Usage

```bash
bff amend
```

## Options

- `--no-submit` - Amend without submitting pull request
- `-m "New message"` - Amend with a new commit message
- `--verbose`, `-v` - Show full output from pre-commit checks (default: concise)
- `--skip-precommit` - Skip formatting, linting, and type checking

## Default Behavior

By default, `bff amend` will:

1. Amend the current commit with any staged changes
2. Submit/update the pull request

## Examples

### Amend with current changes

```bash
# Make your changes
sl add changed_file.ts
bff amend
```

### Amend with new message

```bash
bff amend -m "Updated commit message with better description"
```

### Amend without submitting PR

```bash
bff amend --no-submit
```

## Working with Historical Commits

To amend commits that aren't the current one:

1. First navigate to the commit:
   ```bash
   sl goto <commit-hash>
   ```

2. Make your changes and amend:
   ```bash
   sl add modified_file.ts
   bff amend -m "Updated historical commit"
   ```

3. Sapling will automatically restack child commits

## Best Practices

1. **Review changes before amending**
   - Use `bff status` to see what will be included
   - Use `bff diff` to review the changes

2. **When to use `--no-submit`**
   - Making multiple amendments before finalizing
   - Working on a stack of commits
   - Need to test changes locally first

3. **Commit message updates**
   - Use `-m` flag to improve commit messages
   - Follow the same commit message guidelines as `bff commit`

## Direct Sapling Alternative

If you need more control, use direct Sapling commands:

```bash
sl amend -m "New commit message"
```
