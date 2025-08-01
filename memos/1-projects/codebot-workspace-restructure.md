# Codebot Workspace Restructure Implementation

## Summary

Restructure the codebot container workspace to simplify the directory structure
and improve the development workflow by consolidating everything under @bfmono
with @internalbf-docs as an optional git submodule.

## Current State

- Codebot mounts two separate volumes:
  - `${workspacePath}/@bfmono` → `/@bfmono`
  - `${workspacePath}/@internalbf-docs` → `/@internalbf-docs`
- Working directory is unclear/not set
- Requires copying internalbf-docs separately
- `.claude` file in @bfmono expects certain directory structure

## Proposed Changes

### 1. Directory Structure

Move to a single-root structure:

```
/@bfmono/                       # Container working directory
├── .claude                     # Configuration file
├── memos/
│   └── @internalbf-docs/      # Git submodule (optional)
└── ... (rest of @bfmono)
```

### 2. Git Submodule Setup

- Add @internalbf-docs as a git submodule at `memos/@internalbf-docs`
- Submodule remains optional - OSS users get empty directory
- Internal users with access can initialize: `git submodule update --init`

### 3. Codebot Script Updates

Update `infra/bft/tasks/codebot.bft.ts` to:

- Mount only `${workspacePath}` → `/@bfmono`
- Set working directory to `/@bfmono`
- Remove separate @internalbf-docs copying logic
- Handle optional submodule gracefully (check if initialized before pulling)

### 4. Enhanced Commit Workflow

Extend existing `bft commit` deck (currently AI-powered) with TypeScript
implementation to:

- Detect if changes exist in submodules
- Commit submodule changes first
- Update parent repo's submodule pointer
- Provide single command for complete commit workflow
- Work with both Sapling and Git repos

## Implementation Steps

1. **Add submodule to @bfmono** (Special process for Sapling repos)

   Since @bfmono uses Sapling, we need to use Git to add the submodule:

   ```bash
   # Clone the repo using Git in a temporary location
   cd /tmp
   git clone https://github.com/bolt-foundry/bolt-foundry.git bfmono-git
   cd bfmono-git

   # Add the submodule
   git submodule add https://github.com/bolt-foundry/internalbf-docs memos/@internalbf-docs

   # Commit the changes
   git add .gitmodules memos/@internalbf-docs
   git commit -m "Add @internalbf-docs as git submodule"

   # Push to a branch
   git push origin HEAD:add-internalbf-docs-submodule

   # Create PR using GitHub CLI
   gh pr create \
     --title "Add @internalbf-docs as git submodule" \
     --body "Adds internalbf-docs as a git submodule at memos/@internalbf-docs. This is part of the codebot workspace restructure to consolidate everything under @bfmono. The submodule is optional - OSS users will get an empty directory. Internal users can initialize with: git submodule update --init. Related: #1729" \
     --head add-internalbf-docs-submodule

   # After PR is merged, pull changes in Sapling repo
   cd /@bfmono
   sl pull
   ```
2. **Update codebot.bft.ts**

- Remove lines related to separate @internalbf-docs handling
- Update volume mount configuration
- Add working directory setting

3. **Enhance bft commit command**

- Create TypeScript implementation: `infra/bft/tasks/commit.bft.ts`
- Extend existing deck functionality
- Handle submodule detection and commits
- Support both Sapling (main repo) and Git (submodules)

## Benefits

- Simpler directory structure
- `.claude` file works naturally with relative paths
- Single volume mount
- Optional internal docs for OSS users
- Cleaner workspace management

## Risks & Mitigations

- **Risk**: Forgetting to commit submodule pointer updates
- **Mitigation**: `bft commit` command handles this automatically

- **Risk**: OSS users confused by empty submodule directory
- **Mitigation**: Add README in memos/ explaining optional submodules

## Testing Plan

1. Create test workspace with new structure
2. Verify codebot starts correctly
3. Test with and without submodule initialized
4. Verify `.claude` file recognizes full project structure
5. Test `bft commit` with submodule changes
