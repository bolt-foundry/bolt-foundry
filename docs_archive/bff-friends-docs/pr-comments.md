# PR Comments and Review Threads Commands

This documentation covers the GitHub PR-related commands in the BFF CLI.

## pr-comments

Fetches and displays all comments from a GitHub pull request.

### Usage

```bash
# Fetch comments from PR linked to current branch
bff pr-comments

# Fetch comments from a specific PR
bff pr-comments 763
```

### What it displays

- PR description
- General PR comments
- PR reviews (with state: APPROVED, COMMENTED, etc.)
- Code review comments (inline comments on specific files/lines)

### Example output

```
=== PR Description ===
Add support for edge relationships between BfPerson and BfOrganization nodes...

=== PR Comments ===
(No comments found)

=== PR Reviews ===
[randallb at 5/16/2025, 4:27:46 PM]
State: COMMENTED
Looks generally good.
----------------------------------------

=== Code Review Comments ===
File: apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts
----------------------------------------
[randallb at 5/16/2025, 4:19:07 PM]
apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts:129
Let's double check to make sure we're consistent here.
----------------------------------------
```

## pr-threads

Lists review threads on a GitHub pull request, showing which are resolved and
unresolved.

### Usage

```bash
# List threads from PR linked to current branch
bff pr-threads

# List threads from a specific PR
bff pr-threads 763
```

### What it displays

- Unresolved threads (displayed first)
- Resolved threads
- File path and line number for each thread
- All comments in each thread
- Instructions on how to resolve each unresolved thread

### Example output

```
=== Review Threads for PR #763 ===

=== Unresolved Threads ===

Thread PRRT_kwDONzx_xs5QFyJ_ - 🔴 UNRESOLVED
File: apps/bfDb/builders/graphql/__tests__/makeGqlBuilder.test.ts:129
----------------------------------------
randallb at 5/16/2025, 4:19:07 PM
Let's double check to make sure we're consistent here.
----------------------------------------
To resolve: bff pr-resolve 763 PRRT_kwDONzx_xs5QFyJ_

=== Summary ===
Total threads: 12
Unresolved: 12
Resolved: 0
```

## pr-resolve

Resolves a specific review thread on a GitHub pull request.

### Usage

```bash
bff pr-resolve PR_NUMBER THREAD_ID
```

### Example

```bash
bff pr-resolve 763 PRRT_kwDONzx_xs5QFyJ_
```

### Requirements

- Requires write permissions to the repository
- Specifically needs Repository Permissions > Contents set to Read and Write
  access
- Must be authenticated with GitHub CLI (`gh auth login`)

### How it works

1. Uses GitHub's GraphQL API to execute the `resolveReviewThread` mutation
2. Requires the review thread ID (not just the comment ID)
3. Thread IDs can be found using the `bff pr-threads` command

### Common errors

- "Failed to resolve review thread" - Check authentication and permissions
- "Invalid thread ID" - Use `bff pr-threads` to get valid thread IDs

## Workflow example

1. View comments on a PR:
   ```bash
   bff pr-comments 763
   ```

2. List review threads to see what needs resolution:
   ```bash
   bff pr-threads 763
   ```

3. Resolve specific threads:
   ```bash
   bff pr-resolve 763 PRRT_kwDONzx_xs5QFyJ_
   ```

4. Verify resolution:
   ```bash
   bff pr-threads 763
   ```

## Technical details

- These commands use the GitHub CLI (`gh`) for API access
- pr-comments uses REST API endpoints
- pr-threads and pr-resolve use GraphQL API
- All commands automatically detect the repository from Sapling configuration
