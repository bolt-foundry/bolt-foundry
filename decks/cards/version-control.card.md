# Version control with Sapling

**Use Sapling SCM, not git.** This project doesn't use git at all.

Always use BFT commands over direct Sapling commands when possible. BFT commands
handle formatting, linting, and type checking automatically.

## Commit creation

- Make atomic, focused commits with clear purposes
- Keep changes logically grouped in a single commit
- Separate unrelated changes into different commits

### Commit message structure

- First line: concise summary of changes (50-72 characters)
- Empty line after the summary
- Body: detailed explanation of what and why (not how)
- List specific changes with bullet points
- Include test plans where appropriate
- Add co-author attribution when applicable

Example commit message:

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

## Version control commands

### BFT commit helpers (preferred)

BFT commands streamline your workflow with automatic formatting, linting, and PR
submission:

#### Creating commits

- `bft commit -m "message"` - Run pre-checks then commit and submit PR (default)
- `bft commit -m "message" --skip-pre-check` - Commit without pre-checks
- `bft commit -m "message" --no-submit` - Commit without submitting PR
- `bft commit -m "message" file1 file2` - Commit specific files
- `bft precommit` - Stage files and run pre-commit checks (AI-safe)

**Note:** By default, `bft commit` will:

1. Run pre-commit checks (format, lint, type check)
2. Create the commit
3. Submit a pull request

When to modify default behavior:

- Use `--skip-pre-check` when:
  - You're committing generated files that might not pass linting
  - You're in the middle of a refactor and need to save progress
  - You've already run checks manually
  - You're committing documentation-only changes
- Use `--no-submit` when:
  - You're creating multiple commits before submitting a stack
  - You want to review your commits locally first
  - You're working on experimental changes
  - You need to amend or rebase before creating a PR

The pre-checks include:

1. `bft format` - Format code (AI-safe)
2. `bft lint` - Run linting rules (AI-safe)
3. `bft check` - Type checking (AI-safe)

#### Amending commits

- `bft amend` - Amend current commit and submit PR
- `bft amend --no-submit` - Amend without submitting PR
- `bft amend -m "New message"` - Amend with new message

#### Viewing changes and status (AI-safe commands)

- `bft status` - Show working directory status using `sl status`
- `bft diff` - Show diff of current changes using `sl diff`
- `bft log` - Show commit history using `sl log`

#### Pull request management

- `bft merge <PR-number>` - Merge a GitHub PR
- `bft merge-stack` - Merge all PRs in current stack bottom-to-top
- `bft merge-stack_dry-run` - Preview what would be merged (AI-safe)
- `bft ci-status` - Check CI status for current commit (AI-safe)
- `bft pr-details <PR-number>` - Get PR information
- `bft pr-comments <PR-number>` - Fetch PR comments

### Direct Sapling commands (when needed)

You may need direct Sapling commands for:

- Check status: `sl status`
- View changes: `sl diff`
- Add new files: `sl add <file>` (required for new files)
- Remove deleted files: `sl remove <file>` (required for removed files)
- Commit specific files: `sl commit file1 file2 -m "Commit message"`
- Commit all changes: `sl commit -m "Commit message"`

### Amending commits

- Amend the current commit: `sl amend -m "New commit message"`
- Move to a specific commit: `sl goto <commit-hash>`
- Amend historical commits:
  1. First use `sl goto <commit-hash>` to move to that commit
  2. Then use `sl amend -m "New commit message"` to update it
  3. Sapling will automatically restack child commits

### Splitting commits

When you need to break a single commit into multiple logical commits:

**File-level splitting (non-interactive):** Use `sl uncommit` when changes are
cleanly separated by files:

1. `sl uncommit` - Removes the current commit, leaving changes in working
   directory
2. `sl commit file1 file2 -m "First logical commit"` - Commit specific files
3. `sl commit -m "Second logical commit"` - Commit remaining changes

**Hunk-level splitting (requires interaction):** When a single file has multiple
unrelated changes, use the interactive split:

- `sl split` - Opens interactive interface for hunk-by-hunk selection
- `sl commit --interactive` - Alternative for selecting hunks during commit

**⚠️ Limitation for AI agents:** The interactive modes don't work well for
automation. For mixed changes within files, consider:

1. **Manual file editing:** Temporarily stash changes, make incremental commits
2. **Better commit discipline:** Make smaller, focused changes to avoid mixed
   commits
3. **Human intervention:** Ask a human to handle complex interactive splits

**For historical commits:**

1. `sl goto <commit-hash>` - Move to the commit you want to split
2. Use appropriate workflow above
3. Sapling automatically restacks child commits

### Creating pull requests

- Submit pull requests: `sl pr submit`
- If hitting PR creation limits:
  `sl pr submit --config github.max-prs-to-create=6`
- Link existing pull requests: `sl pr link <PR-URL>`

### Checking PR status

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

## AI-safe commands

When working with AI agents, use these AI-safe BFT commands:

- `bft ai status` - Check repository status
- `bft ai diff` - View current changes
- `bft ai log` - View commit history
- `bft ai format` - Format code
- `bft ai lint` - Run linting
- `bft ai check` - Type check
- `bft ai test` - Run tests
- `bft ai precommit` - Stage files and run all checks
- `bft ai ci-status` - Check CI status
- `bft ai merge-stack_dry-run` - Preview stack merges

## Best practices

1. **Review before committing**
   - Use `bft status` (or `bft ai status`) to verify which files will be
     included
   - Use `bft diff` (or `bft ai diff`) to review the actual content changes
   - Run `bft format` (or use `bft commit` which includes formatting)
   - Make sure to `sl add` new files and `sl remove` deleted files

2. **Commit organization**
   - Group related changes together in logical commits by feature
   - Include code, tests, and docs for a feature in the same commit
   - Keep these in separate commits:
     - Code generation changes (e.g., from `bft genGqlTypes`)
     - Dependency updates
     - Large refactoring separate from feature work

3. **Descriptive messages**
   - Start with a verb (Add, Fix, Update, Refactor, etc.)
   - Clearly state what the commit accomplishes
   - Explain why the change is necessary in the body

4. **Historical commit improvements**
   - Use `sl goto` + `sl amend` to improve commit messages before PRs
   - Never change history that has already been pushed and merged

5. **PR workflow**
   - Use `sl pr submit` to create/update PRs from your commits
   - Provide clear PR descriptions that summarize the entire change set

These practices create clean, well-documented version history that makes code
review straightforward.
