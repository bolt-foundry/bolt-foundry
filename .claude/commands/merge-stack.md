---
name: merge-stack
description: Add stacked PRs to GitHub merge queue in dependency order
---

# Merge Stack with GitHub Merge Queue

Adds all PRs in your current Sapling stack to GitHub's merge queue in the
correct order (bottom to top).

## Overview

This command helps you merge stacked PRs by:

1. Detecting all commits in your current stack
2. Finding their associated GitHub PRs
3. Adding them to the merge queue in dependency order
4. Monitoring the merge queue status

GitHub's merge queue automatically handles:

- Waiting for checks to pass
- Resolving merge conflicts
- Maintaining correct merge order
- Retrying failed merges

## Process

### 1. Detect Current Stack

First, identify all commits in your stack:

```bash
sl log -r "ancestors(.) - ancestors(main)" --template "{node}\n"
```

### 2. Find Associated PRs

For each commit, find its PR by matching commit titles:

```bash
# Get commit title
sl log -r <commit-hash> --template "{desc}" | head -1

# List open PRs to match
sl pr list
```

### 3. Check PR Status

Before adding to queue, verify each PR:

```bash
gh pr view <pr-number> --repo=bolt-foundry/bolt-foundry --json state,mergeable,mergeStateStatus
```

### 4. Add PRs to Merge Queue

Add PRs to the merge queue from bottom to top:

```bash
# Navigate to bottom of stack first
sl goto <bottom-commit>

# For each PR in order (bottom to top)
gh pr merge <pr-number> --auto --repo=bolt-foundry/bolt-foundry --rebase
```

Options for merge method:

- `--rebase` (default) - Rebase and merge
- `--squash` - Squash and merge
- `--merge` - Create a merge commit

### 5. Monitor Queue Status

Check the status of your PRs in the queue:

```bash
# See all your PRs
gh pr status --repo=bolt-foundry/bolt-foundry

# Check specific PR
gh pr view <pr-number> --repo=bolt-foundry/bolt-foundry
```

## Dry Run Mode

To preview what would be added to the queue without actually doing it:

1. Run through steps 1-3 above
2. List the PRs that would be queued in order
3. Show current status of each PR

## Example Workflow

```bash
# 1. Check your current stack
sl ssl

# 2. Preview what would be merged
sl log -r "ancestors(.) - ancestors(main)" --template "{node} {desc}"

# 3. Add all PRs to merge queue
# For each PR from bottom to top:
gh pr merge <pr-number> --auto --repo=bolt-foundry/bolt-foundry --rebase

# 4. Monitor progress
gh pr status --repo=bolt-foundry/bolt-foundry
```

## Troubleshooting

### PR Not Found

If a commit doesn't have an associated PR:

```bash
sl pr submit
```

### PR Not Ready

If a PR can't be added to the queue:

- Check for merge conflicts:
  `gh pr view <pr-number> --repo=bolt-foundry/bolt-foundry`
- Ensure required checks are configured
- Verify PR is not in draft state

### Queue Stuck

If PRs are stuck in the queue:

```bash
# Check merge queue status
gh pr view <pr-number> --repo=bolt-foundry/bolt-foundry --json mergeStateStatus

# Remove from queue if needed
gh pr merge <pr-number> --disable-auto --repo=bolt-foundry/bolt-foundry
```

## Best Practices

1. **Review Stack First**: Use `sl ssl` to see all PRs in your stack
2. **Check CI Status**: Ensure base PRs have passing checks before queuing
3. **Monitor Queue**: Keep an eye on the merge queue for any issues
4. **Use Auto-Merge**: Let the queue handle timing and conflicts

## Notes

- The merge queue ensures PRs are merged in the correct order
- Failed merges will be automatically retried
- You can remove PRs from the queue with `--disable-auto`
- The queue handles all timing and conflict resolution
- All commands use `--repo=bolt-foundry/bolt-foundry` to target the correct
  repository
