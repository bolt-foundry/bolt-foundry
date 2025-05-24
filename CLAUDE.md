# AGENTS.md

This file provides guidance to AI agents (including Claude Code) when working
with code in this repository. CLAUDE.md is symlinked to this file for
compatibility.

## Project Overview

Bolt Foundry is an open-source platform for creating reliable, testable, and
verifiable LLM (Large Language Model) systems. The platform focuses on:

- Persona Cards: Testable units of LLM functionality with built-in verification
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
- `cards/`: LLM behavior and persona cards

## AI Agent Reference Cards

### Persona Cards

- **Purpose**: Provide project context and high-level understanding.
- **Content**: Project overview, architecture, directory structure, technology
  descriptions.
- **Where to Find**: `cards/personas/`, particularly "Bolt Foundry Persona
  Card.md"

### Behavior Cards

- **Purpose**: Provide actionable workflows, protocols, and best practices.
- **Content**: Implementation plans, testing protocols, commit guidelines,
  coding standards.
- **File Format**: Stored as `.bhc.md` files (Behavior Card Markdown)
- **Where to Find**: `cards/behaviors/`, notably cards such as "coding.bhc.md,"
  "implementation-plans.bhc.md," "project-plans.bhc.md," and "tdd.bhc.md"
- **How to Use**: Reference these cards when implementing features, planning
  projects, or following development workflows

## Best Places for AI Agents to Find Information

- **AGENTS.md**: Comprehensive guidelines for working on the project, including
  code organization, development tools, testing, and debugging practices.
- **Persona & Behavior Cards (`cards/`)**: Essential for understanding the
  project and executing tasks effectively.
- **GraphQL Schema (`apps/bfDb/graphql`)**: Defines API interactions and data
  relationships.
- **Design System (`apps/bfDs`)**: Clarifies frontend component usage and UI
  patterns.

## Recommended Workflow for AI Agents

1. **Contextual Understanding**: Review Persona Cards and AGENTS.md to
   understand the project structure and purpose.
2. **Command Execution**: Always use `bff ai` commands first for any development
   operations (testing, formatting, linting, etc.) before considering
   alternatives.
3. **Task Implementation**: Follow Behavior Cards strictly for step-by-step
   actions, testing, and committing.
4. **Testing & Debugging**: Use provided debugging guidelines, log-level
   management, and structured testing processes outlined in AGENTS.md.

By utilizing Persona and Behavior Cards together, AI agents can effectively
contribute to Bolt Foundry, ensuring adherence to the project's high standards
and best practices.

## Development Commands

The primary interface for development is the BFF (Bolt Foundry Friend) CLI:

### AI-Safe Commands

**IMPORTANT**: AI agents must use `bff ai` commands for all development
operations before considering any alternatives. This ensures safe execution and
prevents potentially destructive operations.

For AI assistants working on the codebase, use the `bff ai` command to run only
AI-safe operations:

```bash
# List all AI-safe commands
bff ai

# Run AI-safe commands only (prevents potentially destructive operations)
bff ai test           # Run tests safely
bff ai format         # Format code safely
bff ai lint           # Lint code safely
bff ai check          # Type check safely
bff ai diff           # View file differences safely
bff ai status         # Check working directory status safely
bff ai precommit      # Stage files and run all pre-commit checks safely
```

### All Commands

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

# View GitHub PR details
bff pr-details <PR_NUMBER>

# View GitHub PR comments
bff pr-comments

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

### Linting

The project uses the Deno linter with custom rules defined in
`infra/lint/bolt-foundry.ts`:

- `no-env-direct-access`: Prevents direct access to Deno.env, use
  getConfigurationVariable()
- `no-bfnodespec-first-static`: Ensures bfNodeSpec is not the first static field
  in a class
- `no-logger-set-level`: Prevents accidental commits of logger.setLevel() calls,
  which should only be used for local debugging

## Common Workflows

- Running tests for specific modules: `bff test path/to/test.ts`
- Building for development: `bff build`
- Checking TypeScript errors: `bff check`
- Running the development server: `bff dev`
- Formatting code: `bff format`
- Generating GraphQL code: `bff iso`
- Running linter: `bff lint`

## Version Control

This project uses BFF CLI commands and Sapling SCM for version control.

1. Prefer using `bff` commands whenever available for version control operations
2. Fall back to `sl` (Sapling) commands when needed
3. Never use `git` commands under any circumstances

### Commit Workflow with BFF

```bash
# Create a commit with BFF
bff commit -m "Your commit message" [files...]

# Amend the current commit
bff amend [-m "Your updated message"] [files...]

# Check CI status
bff ci-status [--details | -d]

# Merge a GitHub PR
bff merge <pr-number> [method]
```

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

Note: When using the `gh` command, always use `--repo=bolt-foundry/bolt-foundry`

Alternatively, use the BFF commands which handle repository detection
automatically:

```bash
# View PR details
bff pr-details <PR_NUMBER>

# View PR comments  
bff pr-comments [PR_NUMBER]

# List review threads on a PR
bff pr-threads [PR_NUMBER]

# Resolve a review thread
bff pr-resolve PR_NUMBER THREAD_ID
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

### Recent Work: Formatter GraphQL Integration (Completed)

Successfully implemented comprehensive GraphQL integration for Formatter.tsx:

**Completed Integration:**
- ✅ Created GraphQL schema with 4 main types: Bolt, Card, Variable, Turn
- ✅ Implemented 11 working mutations with stubbed data:
  - Bolt: createBolt, updateBolt  
  - Card: addCard, updateCard, deleteCard
  - Variable: addVariable, updateVariable, deleteVariable
  - Turn: addTurn, updateTurn, deleteTurn
- ✅ Replaced fake data in Formatter.tsx with real GraphQL mutation calls
- ✅ Generated complete GraphQL schema at `/apps/bfDb/graphql/__generated__/schema.graphql`

**Key Files Modified:**
- `apps/bfDb/graphql/roots/FormatterMutations.ts` - Contains all 10 formatter mutations
- `apps/bfDb/graphql/roots/Bolt.ts, Card.ts, Variable.ts, Turn.ts` - GraphQL object types
- `apps/boltFoundry/mutations/graphqlMutations.ts` - Direct GraphQL mutation functions
- `apps/boltFoundry/components/Formatter.tsx` - Now uses createBolt() GraphQL mutation

**Technical Notes:**
- Mutations return success/message responses (stubbed data as requested)
- Query object method `.object()` not implemented yet, so mutations work but queries don't
- Isograph syntax complex - used direct GraphQL fetch calls instead
- Schema generation requires full `bff build` for mutations to appear
- All mutation payload types properly generated in schema

## Documentation Practices

- Do not include dates (specific or relative) in documentation files unless
  explicitly requested
- Use status.md files in project directories for tracking current project status
- Documentation follows versioned structure (0.1, 0.2, etc.) rather than
  date-based versioning
- Status indicators should use symbols (✅, 🔄, ⏱️) instead of dates to show
  progress

## Development Best Practices

- **AI agents must use `bff ai` commands first** before any other commands that
  do the same thing. This ensures safety and prevents potentially destructive
  operations.
- Remember to use bff commands first before using any other commands that do the
  same thing.

## Version Control Workflow

**For AI Agents**: Use only `bff ai` commands for development operations. Other
version control operations should be requested from human developers.

**General Priority Order**:

1. `bff ai` commands (AI agents should only use these)
2. `bff` commands
3. `sl` (Sapling) commands
4. `gh` commands with --repo=bolt-foundry/bolt-foundry
5. Never use `git` commands
