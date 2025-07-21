# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Core Development Principle

**🚀 Simple is almost always better than complex.**

When in doubt, build the smallest thing that could work. Working code beats
perfect code.

## Development Philosophy

### Move Fast and Ship

- **Working > Perfect** - Ship functional solutions quickly over architecturally
  perfect ones
- **Iterate in production** - Get something working in users' hands, then
  improve based on real usage
- **Bias toward action** - When uncertain between approaches, pick one and ship
  it
- **Fail fast** - Build the simplest thing that could work, learn from failures
  quickly

### Code Quality Expectations

- **Good enough is good enough** - Don't over-engineer unless performance/scale
  demands it
- **Pragmatic solutions encouraged** - Hardcode values, copy-paste code, use
  quick hacks if they solve the problem
- **Technical debt is acceptable** - Mark it with TODOs, but don't let it block
  shipping
- **Refactor after shipping** - Clean up working code rather than perfecting
  unshipped code

### When Building Features

1. **Start with the hack** - Build the most direct solution first
2. **Ship the MVP** - Get basic functionality working and deployed
3. **Measure real usage** - Let actual user behavior guide improvements
4. **Iterate based on data** - Don't guess what users want

## Project Overview

**Bolt Foundry** - Customer Success Platform for AI that enables continuous
improvement through customer feedback using RLHF workflows.

- **Runtime**: Deno 2.x with TypeScript
- **Source Control**: Sapling SCM (not Git)
- **Task Runner**: `bft <command>` (Bolt Foundry Tool)
- **Package Management**: Nix and `deno add`

## Development Commands

### Core Commands

- `bft help` - List all available commands
- Use `bft help` to see the complete list of available commands
- **Prefer `bft` commands over `deno run` whenever possible**

### Testing

- Individual package tests: `deno test packages/<package-name>/`
- App-specific tests: `deno test apps/<app-name>/`
- Integration tests: Look for `*.integration.test.ts` files
- E2E tests: Look for `*.test.e2e.ts` files in `__tests__/e2e/` directories

## Architecture

### Monorepo Structure

- `apps/` - Main applications and web services
  - `aibff/` - AI feedback and evaluation CLI tool
  - `bfDb/` - Database layer with GraphQL API
  - `bfDs/` - Design system components
  - `boltFoundry/` - Main web application
  - `boltfoundry-com/` - Marketing website
  - Additional deprecated/experimental apps exist but are not actively
    maintained
- `packages/` - Reusable TypeScript packages
  - `bolt-foundry/` - Core library and client
  - `logger/` - Logging utilities
  - `get-configuration-var/` - Configuration management
  - `aibff/` - AI feedback package
  - `cli-ui/` - CLI user interface utilities
  - Additional packages exist in various stages of development
- `infra/` - Build tools and infrastructure
  - `bft/` - Bolt Foundry Task runner implementation
  - `bff/` - Bolt Foundry Friend tools (targeted for removal)
  - `jupyter/` - Jupyter notebook support (targeted for removal)
  - `appBuild/` - Application build utilities (targeted for removal)
  - Additional infrastructure components exist as part of ongoing monorepo
    consolidation
- `decks/` - Behavior specifications and evaluation cards

### Key Technologies

- **Deno** - Runtime with TypeScript support
- **Isograph** - GraphQL client framework (used in web apps)
- **React** - UI framework for web applications
- **SQLite/PostgreSQL** - Database backends via bfDb
- **Lexical** - Rich text editor framework
- **Vite** - Frontend build tool for web apps

### Design Patterns

- **BfNode System**: Central data model pattern in bfDb for all entities
- **RLHF Workflow**: Customer feedback → evaluation specs → improved AI
  responses
- **Deck/Card System**: Modular behavior specifications using .deck.md files
- **GraphQL-First**: All data access through GraphQL via bfDb layer

### Configuration

- `deno.jsonc` - Main Deno configuration with import maps
- `deno.lock` - Dependency lock file
- Workspace configuration for multiple apps/packages
- Custom lint rules in `infra/lint/bolt-foundry.ts`

## Important Notes

### BFT Task Runner

- Custom task runner at `infra/bft/`
- Tasks defined in `.bft.ts` files and `.bft.deck.md` files in
  `infra/bft/tasks/`
- AI-safe commands by default, use `bft requestApproval <command>` for
  unrestricted access
- Automatically loads tasks from `infra/bft/tasks/` directory

### Package Management

- **Nix for system dependencies** - Use `nix develop` to enter development shell
- **Deno for JavaScript/TypeScript packages** - Use `deno add <package>` to add
  dependencies
- **JSR dependencies**: `@std/*`, `@deno/*` packages from jsr.io
- **npm dependencies**: Use `deno add npm:package-name`
- **Local imports**: `@bfmono/` prefix for monorepo modules

### Database Layer (bfDb)

- All entities extend BfNode base class
- Automatic GraphQL schema generation via decorators
- Multiple backend support
- Connection-based pagination and traversal patterns

---

## 🎯 Final Reminder

**Before building anything: What's the simplest version that could work?**

- Start small and iterate
- Working code beats perfect architecture
- You can always improve later
- Simple is almost always better than complex
