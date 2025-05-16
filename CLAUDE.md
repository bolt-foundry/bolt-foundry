# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Bolt Foundry is an open-source platform for creating reliable, testable, and
verifiable LLM (Large Language Model) systems. The platform focuses on:

- Identity Cards: Testable units of LLM functionality with built-in verification
- Behavior Cards: Actionable protocols and best practices for LLM systems
- Test-Driven LLMs: Testing framework for LLM behaviors
- Composable Systems: Building complex LLM applications from verified components

## Tech Stack

- Runtime: Deno 2 (JavaScript/TypeScript)
- Frontend: React with component-based architecture
- Backend/API: GraphQL with Isograph integration
- Database: Multiple backends supported (PostgreSQL, SQLite, Neon)
- Build/Dev Tools: BFF (Bolt Foundry Friend) CLI
- Version Control: Sapling SCM (not Git)

## Repository Structure

The codebase follows a monorepo structure:

- `apps/`: Individual applications
  - `bfDb/`: Database layer with ORM-like functionality
  - `bfDs/`: Design system (UI components)
  - `boltFoundry/`: Main web application with React components
  - `web/`: Web server and routing
- `infra/`: Build tools and infrastructure
  - `bff/`: CLI tooling for development
  - `appBuild/`: Build system for applications
- `lib/`: Shared utilities
- `static/`: Static assets
- `docs/`: Project documentation
- `cards/`: LLM behavior and identity cards

## Development Commands

The primary interface for development is the BFF (Bolt Foundry Friend) CLI:

```bash
# Build the project
bff build

# Run tests (can specify a pattern/file)
bff test
bff test apps/bfDb/storage/__tests__/adapterRegistry.test.ts

# Format code
bff format

# Lint code
bff lint

# Type checking
bff check

# End-to-end tests
bff e2e

# Isograph generation (GraphQL)
bff iso

# Development environment
bff dev

# Database operations
bff db

# Generate config keys
bff genConfigKeys

# Merge a GitHub PR
bff merge
bff merge <pr-number>
bff merge <pr-number> <method>

# Check GitHub CI status
bff ci-status
bff ci-status <commit-hash>
bff ci-status --details  # Show detailed failure information
bff ci-status -d        # Short form for --details

# Show help
bff help
```

## Architecture Notes

### Database (bfDb)

- Uses a builder pattern for defining database schemas
- Supports multiple backends (PostgreSQL, SQLite, Neon)
- Provides NodeTypes for defining entities (BfPerson, BfOrganization, etc.)
- Circular references are supported (see CircularNodeExample.ts)

### GraphQL

- Currently migrating from Nexus to a custom builder pattern (still backed by
  Nexus)
- New GraphQL builder uses a fluent interface similar to bfNodeSpec
- Isograph for React integration
- Main query endpoints defined in graphql/roots/
- Implementation details in apps/bfDb/docs/nextgqlbuilder.md and
  apps/bfDb/docs/0.1/implementation-plan.md

### UI Components (bfDs)

- React-based design system
- Component naming convention: BfDs[ComponentName].tsx
- Components organized by type (Button, Form, Table, etc.)
- Test files located in **tests** directory

### Web Application

- React-based frontend
- Isograph for GraphQL data fetching
- Router context for navigation
- Feature flags system

## Development Practices

- Test-Driven Development (Red-Green-Refactor)
- Tests located in `__tests__` directories
- Documentation follows versioned structure (0.1, 0.2, etc.)
- Project plans focus on user-centric goals
- Implementation plans focus on technical details

## Common Workflows

- Running tests for specific modules: `bff test path/to/test.ts`
- Building for development: `bff build`
- Checking TypeScript errors: `bff check`
- Running the development server: `bff dev`
- Formatting code: `bff format`
- Generating GraphQL code: `bff iso`

## Version Control with Sapling

This project uses Sapling SCM instead of Git. Always use `sl` commands instead
of `git` commands:

### GitHub API Access

For accessing GitHub information like PRs and reviews, use the `gh api` command:

```bash
# Get PR details
gh api repos/{owner}/{repo}/pulls/{pr_number}

# View PR comments
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments

# View PR reviews
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews

# View PR review comments
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews/comments
```

```bash
# Check status
sl status

# View changes
sl diff

# Add new files (required for new files)
sl add <file>

# Remove deleted files (required for removed files)
sl remove <file>

# Commit specific files
sl commit file1 file2 -m "Commit message"

# Commit all changes
sl commit -m "Commit message"

# Amend the current commit
sl amend -m "New commit message"

# Create pull request
sl pr submit

# Import a PR to your working copy
sl pr pull <PR_NUMBER>

# View commit stack and relationships
sl smartlog
```

### Working with Stacked PRs

To view the stacked PRs (PRs that depend on each other):

1. Use `sl pr pull <PR_NUMBER>` to import the PR into your working copy
2. Use `sl smartlog` to visualize the commit stack structure
3. Use `sl pr list` to see all open PRs

The smartlog output will show you a linear history of commits with connections,
where each commit may correspond to a PR. Combined with `sl pr list`, you can
identify the stacked PRs in the current stack.

### Commit Message Guidelines

- First line: Concise summary of changes (50-72 characters)
- Empty line after the summary
- Body: Detailed explanation of what and why (not how)
- Include "Changes:" section with bullet points
- Include "Test plan:" section describing how to verify the changes
- End with co-author attribution when applicable

### Commit Organization

- Group related files together by functionality
- Create multiple focused commits for different functional changes
- It's more important to separate commits by grouped functionality than by type
  (code/docs/config)
- Code can and should be split into multiple commits when it covers different
  functional areas
- Examples of logical grouping:
  - Features or components that work together
  - Related bug fixes
  - Performance improvements to a specific subsystem
  - API changes and their implementations
- Each commit should be atomic (self-contained and focused on a single purpose)

Example:

```
Add GraphQL Builder v0.1 Implementation Plan

Document our approach for migrating from the legacy three-helper GraphQL DSL
to a single-argument fluent builder pattern.

Changes:
- Created apps/bfDb/docs/0.1/implementation-plan.md
- Updated CLAUDE.md with information about the GraphQL builder migration
- Added technical design section with builder interfaces

Test plan:
1. Verify implementation plan follows versioned documentation structure
2. Check that technical design section matches current implementation

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Memory Notes

- Update claude.md when we make changes that could be structural

## Documentation Practices

- Do not include dates (specific or relative) in documentation files unless
  explicitly requested
- Use status.md files in project directories for tracking current project status
- Documentation follows versioned structure (0.1, 0.2, etc.) rather than
  date-based versioning
- Status indicators should use symbols (✅, 🔄, ⏱️) instead of dates to show
  progress
