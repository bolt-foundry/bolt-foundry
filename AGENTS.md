# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**Bolt Foundry** - Customer Success Platform for AI that enables continuous
improvement through customer feedback using RLHF workflows.

- **Runtime**: Deno 2.x with TypeScript
- **Source Control**: Sapling SCM (not Git)
- **Task Runner**: `bft <command>` (Bolt Foundry Tool)
- **Package Management**: Import maps (no npm)

## Development Commands

### Core Commands

- `bft help` - List all available commands
- `bft build` - Build the entire monorepo
- `bft test` - Run all tests across the monorepo
- `bft lint` - Lint TypeScript files
- `bft format` - Format TypeScript files

### Testing

- Individual package tests: `deno test packages/<package-name>/`
- App-specific tests: `deno test apps/<app-name>/`
- Integration tests: Look for `*.integration.test.ts` files
- E2E tests: Look for `*.e2e.ts` files

### Build Process

- In transition. Each app in apps is likely to have a build process.

## Architecture

### Monorepo Structure

- `apps/` - Main applications and web services
  - `aibff/` - AI feedback and evaluation CLI tool
  - `bfDb/` - Database layer with GraphQL API
  - `bfDs/` - Design system components
  - `boltFoundry/` - Main web application
  - `boltfoundry-com/` - Marketing website
- `packages/` - Reusable TypeScript packages
  - `bolt-foundry/` - Core library and client
  - `logger/` - Logging utilities
  - `get-configuration-var/` - Configuration management
- `infra/` - Build tools and infrastructure
  - `bft/` - Bolt Foundry Task runner implementation
- `decks/` - Behavior specifications and evaluation cards

### Key Technologies

- **Deno 2.x** - Runtime with TypeScript support
- **Isograph** - GraphQL client framework (used in web apps)
- **React 19** - UI framework for web applications
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

### Testing Strategy

- Unit tests co-located with source files (`__tests__/` directories)
- Integration tests for database and API layers
- E2E tests for web applications using test helpers
- Test databases use SQLite with temporary files in `tmp/`

## Important Notes

### BFT Task Runner

- Custom task runner at `infra/bft/`
- Tasks defined in `.bft.ts` files and `.bft.deck.md` files
- AI-safe commands by default, use `bft requestApproval <command>` for
  unrestricted access
- Automatically loads tasks from `infra/bft/tasks/` directory

### Package Management

- **No npm install required** - uses Deno's import maps in `deno.jsonc`
- **JSR dependencies**: `@std/*`, `@deno/*` packages from jsr.io
- **npm dependencies**: Direct `npm:package-name` imports
- **Local imports**: `@bfmono/` prefix for monorepo modules
- **Manual node_modules**: Configured for compatibility when needed

### Database Layer (bfDb)

- All entities extend BfNode base class
- Automatic GraphQL schema generation via decorators
- Multiple backend support (SQLite, PostgreSQL, Neon)
- Connection-based pagination and traversal patterns
