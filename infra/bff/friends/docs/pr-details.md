# bff pr-details

Get detailed information about a GitHub PR.

## Usage

```bash
bff pr-details <PR_NUMBER>
```

## Examples

```bash
# Get details for PR #123
bff pr-details 123
```

## Output

The command displays:

- PR title, number, and state
- Author and timestamps (created, updated, merged)
- Branch information
- URL
- Description/body
- Statistics (comments, reviews, commits, changed files, additions, deletions)
- Review status

## Requirements

- GitHub CLI (`gh`) must be installed and authenticated
- The repository must be linked to a GitHub repository
- Valid PR number must be provided

## Authentication

If you receive an authentication error, run:

```bash
gh auth login
```
