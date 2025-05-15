# Sapling Commit Workflow

When working with Sapling for version control (instead of git), follow these guidelines for an effective commit workflow:

## Commit Creation

- Make atomic, focused commits with clear purposes
- Keep changes logically grouped in a single commit
- Separate unrelated changes into different commits

### Commit Message Structure
- First line: concise summary of changes (50-72 characters)
- Empty line after the summary
- Body: detailed explanation of what and why (not how)
- List specific changes with bullet points
- Include test plans where appropriate
- Add co-author attribution when applicable

Example commit message:
```
Refactor GraphQL Builder: Remove Connection Implementation

Remove the Relay Connection implementation from the GraphQL builder to simplify
the initial implementation. Focus on core scalar fields, object fields, and mutations
for v1 of the builder.

Changes:
- Removed connection method, interface, and imports from makeGqlBuilder.ts
- Removed connection tests from makeGqlBuilder.test.ts
- Created placeholder for gqlSpecToNexus.ts with TODOs

Test plan:
1. Run tests: `bff test apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts`
2. Verify that the builder continues to support scalar fields, objects, and mutations

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Sapling-Specific Commands

### Basic Commit Workflow
- Check status: `sl status`
- View changes: `sl diff`
- Add new files: `sl add <file>` (required for new files)
- Remove deleted files: `sl remove <file>` (required for removed files)
- Commit specific files: `sl commit file1 file2 -m "Commit message"`
- Commit all changes: `sl commit -m "Commit message"`

### Amending Commits
- Amend the current commit: `sl amend -m "New commit message"`
- Move to a specific commit: `sl goto <commit-hash>`
- Amend historical commits:
  1. First use `sl goto <commit-hash>` to move to that commit
  2. Then use `sl amend -m "New commit message"` to update it
  3. Sapling will automatically restack child commits

### Creating Pull Requests
- Submit pull requests: `sl pr submit`
- If hitting PR creation limits: `sl pr submit --config github.max-prs-to-create=6`
- Link existing pull requests: `sl pr link <PR-URL>`

## Best Practices

1. **Review Before Committing**
   - Use `sl status` to verify which files will be included
   - Use `sl diff` to review the actual content changes
   - Run `bff f` to ensure proper formatting before committing
   - Make sure to `sl add` new files and `sl remove` deleted files

2. **Commit Organization**
   - Group related changes together in logical commits
   - Examples:
     - Code changes in one commit
     - Documentation updates in another commit
     - Dependency updates in a separate commit

3. **Descriptive Messages**
   - Start with a verb (Add, Fix, Update, Refactor, etc.)
   - Clearly state what the commit accomplishes
   - Explain why the change is necessary in the body

4. **Historical Commit Improvements**
   - Use `sl goto` + `sl amend` to improve commit messages before PRs
   - Never change history that has already been pushed and merged

5. **PR Workflow**
   - Use `sl pr submit` to create/update PRs from your commits
   - Provide clear PR descriptions that summarize the entire change set

This workflow ensures clean, well-documented version history and makes code review easier for your team.