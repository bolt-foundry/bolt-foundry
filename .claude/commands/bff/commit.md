---
name: bft-commit
description: Create a commit using BFT with automatic formatting, linting, and PR submission
---

Please help me create a commit for the current uncommitted changes.

First, run bft ai status to see all modified and untracked files.

Then, run bft ai diff to see the details of the uncommitted changes.

Then, see if the changes can be logically grouped.

Then, commit each logical grouping using "bft commit -m 'use the style from the
example commit message below' filepath-1.md filepath-2.md

The linter runs as part of the bft commit command, so if the files are updated,
don't worry, that' expected.

Finally, submit all the pull requests using "sl pr submit".

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
1. Run tests: `bft test apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts`
2. Verify builder supports scalar fields, objects, and mutations

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
