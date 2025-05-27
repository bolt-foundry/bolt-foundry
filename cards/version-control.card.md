# Version Control with Sapling

We use Sapling SCM for version control. **Never use git commands** - this
project does not use git. Prefer BFF commands (and BFF AI commands when
available) over direct Sapling commands when possible.

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

## Version Control Commands

### BFF Commit Helper (Preferred)

The project provides BFF commands that streamline the workflow. **Always prefer
these over direct Sapling commands**:

- `bff commit -m "message"` - Run pre-checks (format, lint, type check) then
  commit
- `bff commit -m "message" --skip-pre-check` - Commit without pre-checks
- `bff commit -m "message" --submit` - Commit and immediately submit PR
- `bff commit -m "message" file1 file2` - Commit specific files

The pre-checks include:

1. `bff format` - Format code
2. `bff lint` - Run linting rules
3. `bff check` - Type checking

### Direct Sapling Commands (When Needed)

While BFF commands are preferred, you may need direct Sapling commands for:

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

### Splitting Commits

When you need to break a single commit into multiple logical commits:

**File-level splitting (non-interactive):**
Use `sl uncommit` when changes are cleanly separated by files:

1. `sl uncommit` - Removes the current commit, leaving changes in working directory
2. `sl commit file1 file2 -m "First logical commit"` - Commit specific files
3. `sl commit -m "Second logical commit"` - Commit remaining changes

**Hunk-level splitting (requires interaction):**
When a single file has multiple unrelated changes, use the interactive split:

- `sl split` - Opens interactive interface for hunk-by-hunk selection
- `sl commit --interactive` - Alternative for selecting hunks during commit

**⚠️ Limitation for AI agents:** The interactive modes don't work well for automation. For mixed changes within files, consider:

1. **Manual file editing:** Temporarily stash changes, make incremental commits
2. **Better commit discipline:** Make smaller, focused changes to avoid mixed commits
3. **Human intervention:** Ask a human to handle complex interactive splits

**For historical commits:**
1. `sl goto <commit-hash>` - Move to the commit you want to split
2. Use appropriate workflow above
3. Sapling automatically restacks child commits

### Creating Pull Requests

- Submit pull requests: `sl pr submit`
- If hitting PR creation limits:
  `sl pr submit --config github.max-prs-to-create=6`
- Link existing pull requests: `sl pr link <PR-URL>`

### Checking PR Status

- View PR status: `sl ssl` (alias for `sl smartlog -T {ssl}`)
- This shows PRs with statuses like "Unreviewed", "Approved", or "Closed"
- Example output:
  ```
  @ 4d9180fd8 6 minutes ago alyssa #178 Unreviewed
  │ adding baz
  │
  o 3cc43c835 6 minutes ago alyssa #177 Approved
  │ adding bar
  ```
- For detailed CI check information, use GitHub CLI: `gh pr checks`

## Best Practices

1. **Review Before Committing**
   - Use `sl status` to verify which files will be included
   - Use `sl diff` to review the actual content changes
   - Run `bff format` (or use `bff commit` which includes formatting)
   - Make sure to `sl add` new files and `sl remove` deleted files

2. **Commit Organization**
   - Group related changes together in logical commits by feature
   - Include code, tests, and docs for a feature in the same commit
   - Keep these in separate commits:
     - Code generation changes (e.g., from `bff genGqlTypes`)
     - Dependency updates
     - Large refactoring separate from feature work

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

This workflow ensures clean, well-documented version history and makes code
review easier for your team.
