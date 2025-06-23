---
name: bff-commit
description: Create a commit using BFF with automatic formatting, linting, and PR submission
---

Please help me create a commit for the current uncommitted changes.

First, run bff ai diff to see the uncommitted changes.

Then, see if the changes can be logically grouped.

Finally, commit each logical grouping using "bff commit -m 'use the style from
the example commit message below' filepath-1.md filepath-2.md

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
