# Commits Viewer Implementation Plan

**Author**: Claude\
**Status**: Planning

## Overview

Implement a simple PR viewer for Sapling stacked PRs, inspired by ReviewStack,
as part of the InternalBF application.

## MVP Scope

The simplest possible implementation that:

1. Displays PR title and description
2. Shows all commits from the base of the stack
3. Uses BfDs components for UI
4. Authenticates with GitHub personal access token

## Implementation Details

### Route Structure

```
/internalbf/commits/[org]/[repo]/pull/[pr]
```

### GraphQL Schema

```graphql
type Query {
  githubPR(org: String!, repo: String!, number: Int!): PullRequest
}

type PullRequest {
  id: ID!
  number: Int!
  title: String!
  body: String
  state: String!
  commits: [Commit!]!
  stackInfo: StackInfo
}

type Commit {
  sha: String!
  message: String!
  author: CommitAuthor!
}

type CommitAuthor {
  name: String!
  email: String!
  date: String!
}

type StackInfo {
  isStack: Boolean!
  stackPRs: [Int!]
  currentPosition: Int
}
```

### Component Structure

```typescript
// apps/internalbf/components/CommitsView.tsx
import { iso } from "@iso";
import { BfDsButton, BfDsCallout, BfDsList, BfDsListItem } from "apps/bfDs";

export const CommitsView = iso(`
  field Query.CommitsView($org: String!, $repo: String!, $prNumber: Int!) {
    githubPR(org: $org, repo: $repo, number: $prNumber) {
      title
      number
      body
      commits {
        sha
        message
        author {
          name
          date
        }
      }
      stackInfo {
        isStack
        currentPosition
        stackPRs
      }
    }
  }
`)(function CommitsView({ data }) {
  const pr = data.githubPR;

  if (!pr) {
    return <BfDsCallout type="error">Pull request not found</BfDsCallout>;
  }

  return (
    <div className="commits-view">
      <BfDsButton
        text="← Back"
        onClick={() => window.location.href = "/internalbf"}
      />

      <h1>{pr.title} #{pr.number}</h1>

      {pr.body && (
        <div className="pr-description">
          <pre>{pr.body}</pre>
        </div>
      )}

      {pr.stackInfo?.isStack && (
        <BfDsCallout type="info">
          Part of a stack (position {pr.stackInfo.currentPosition} of{" "}
          {pr.stackInfo.stackPRs.length})
        </BfDsCallout>
      )}

      <h2>Commits ({pr.commits.length})</h2>
      <BfDsList>
        {pr.commits.map((commit) => (
          <BfDsListItem
            key={commit.sha}
            title={commit.message.split("\n")[0]}
            subtitle={`${commit.sha.substring(0, 7)} • ${commit.author.name}`}
          />
        ))}
      </BfDsList>
    </div>
  );
});
```

### GitHub API Integration

```typescript
// apps/internalbf/graphql/resolvers/githubPR.ts
export async function githubPRResolver(
  _root: unknown,
  args: { org: string; repo: string; number: number },
  ctx: Context,
) {
  const token = getConfigurationVariable("GITHUB_TOKEN");

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github.v3+json",
  };

  // Fetch PR details
  const prResponse = await fetch(
    `https://api.github.com/repos/${args.org}/${args.repo}/pulls/${args.number}`,
    { headers },
  );

  if (!prResponse.ok) {
    return null;
  }

  const pr = await prResponse.json();

  // Fetch commits
  const commitsResponse = await fetch(pr.commits_url, { headers });
  const commits = await commitsResponse.json();

  // Detect if this is a Sapling stack
  const stackInfo = detectSaplingStack(pr, commits);

  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    body: pr.body,
    state: pr.state,
    commits: commits.map(formatCommit),
    stackInfo,
  };
}

function detectSaplingStack(pr: any, commits: any[]): StackInfo | null {
  // Simple detection: look for stack markers in PR body
  // Real implementation would query related PRs
  const stackMatch = pr.body?.match(/Stack.*\n(.*\n)+/);

  if (!stackMatch) {
    return null;
  }

  // Parse stack information from PR body
  // This is simplified - real implementation would be more robust
  return {
    isStack: true,
    stackPRs: [pr.number], // Would include full stack
    currentPosition: 1,
  };
}
```

### Styling

```css
/* Simple styles using BfDs design tokens */
.commits-view {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--bf-space-4);
}

.pr-description {
  background: var(--bf-color-bg-secondary);
  border-radius: var(--bf-radius-md);
  padding: var(--bf-space-3);
  margin: var(--bf-space-4) 0;
}

.pr-description pre {
  white-space: pre-wrap;
  font-family: var(--bf-font-mono);
  margin: 0;
}
```

## Configuration

Required environment variables:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx  # Personal access token with repo scope
```

## Testing Plan

1. Test with a regular (non-stacked) PR
2. Test with a Sapling stacked PR
3. Test with a private repository
4. Test error cases (404, no auth)

## Future Enhancements

Once the MVP is working:

1. Add stack navigation (previous/next PR in stack)
2. Show file diffs
3. Display PR status checks
4. Add commenting capability
5. Implement caching for better performance

## Implementation Steps

1. [ ] Add GraphQL schema types
2. [ ] Implement GitHub API resolver
3. [ ] Create CommitsView component
4. [ ] Add route to InternalBF
5. [ ] Add link from dashboard
6. [ ] Test with real PRs
7. [ ] Add error handling
8. [ ] Document usage
