---
name: bff-status
description: Show working directory status using Sapling
---

# BFF Status

Shows the current working directory status using Sapling SCM.

## Usage

```bash
bff status
```

## What It Shows

The command displays:

- Modified files (M)
- Added files (A)
- Removed files (R)
- Untracked files (?)
- Files with conflicts (!)

## Example Output

```
M apps/bfDb/builders/graphql/makeGqlBuilder.ts
A apps/bfDb/builders/graphql/newFeature.ts
R apps/bfDb/builders/graphql/deprecated.ts
? apps/bfDb/temp.log
```

## Related Commands

### View changes in detail

```bash
bff diff
```

### View commit history

```bash
bff log
```

### Check PR status

```bash
sl ssl
```

Shows PRs with statuses like "Unreviewed", "Approved", or "Closed"

### Check CI status

```bash
bff ci-status
```

## AI-Safe Version

For AI agents, use:

```bash
bff ai status
```

## Working with Untracked Files

If you see files marked with `?` (untracked):

- Add them with: `sl add <filename>`
- Or add all with: `sl add .`

If you see removed files marked with `!`:

- Remove them with: `sl remove <filename>`

## Best Practices

1. Always check status before committing
2. Ensure all new files are added (`sl add`)
3. Ensure deleted files are removed (`sl remove`)
4. Review untracked files to avoid missing important changes
