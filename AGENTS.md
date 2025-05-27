# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**Bolt Foundry** is an open-source platform for building reliable LLM systems
through structured "Persona Cards" and behavior-driven development. The project
is building an "ORM for LLMs" that transforms prompt engineering from brittle
text strings into structured, semantic APIs.

## Technology Stack & Architecture

### Core Technologies

- **Runtime**: Deno 2.x (primary runtime environment)
- **Language**: TypeScript with React 19 and JSX
- **Database**: Multi-backend support (PostgreSQL/Neon, SQLite for development)
- **GraphQL**: Nexus with custom schema generation via Isograph
- **Build**: ESBuild for client-side, custom Deno compilation for server
- **Testing**: Deno's built-in test runner + custom evaluation framework
- **Source Control**: Sapling SCM (not Git)

### Monorepo Structure

```
apps/                    # Main applications
   bfDb/                # Database ORM and GraphQL layer
   bfDs/                # Design system components
   boltFoundry/         # Main web application (React + Isograph)
   collector/           # LLM usage analytics collector
   contacts/            # CRM application
   web/                 # Web server and routing
packages/               # Reusable packages
   bolt-foundry/        # Core SDK and telemetry
   logger/              # Logging utilities
   get-configuration-var/ # Configuration management
infra/                  # Infrastructure and tooling
   bff/                 # "Bolt Foundry Friend" task runner
   appBuild/            # Build pipeline
   testing/             # Test utilities
   lint/                # Custom linting rules
lib/                    # Shared utilities
static/                 # Static assets and CSS
```

## Development Commands (BFF System)

The project uses a custom task runner called **BFF** (Bolt Foundry Friends). All
development tasks use `bff <command>`:

### Essential Commands

```bash
# Development environment
bff devTools            # Start Jupyter (:8888), Sapling (:3011), Tools (:9999)

# Build and test
bff build              # Full project build with memory monitoring
bff test               # Run comprehensive test suite
bff e2e --build        # Build then run end-to-end tests
bff ci                 # Full CI pipeline (format, lint, check, test, build)

# Code quality
bff format             # Format code (deno fmt)
bff lint               # Custom linting rules
bff check              # TypeScript type checking

# Development workflow
bff commit -m "msg" --pre-check --submit   # Format, lint, commit, and create PR
bff commit -m "msg" --skip-pre-check file1 file2  # Commit specific files without pre-checks
```

### Database Commands

```bash
bff db:reset           # Reset development database
bff db:clean           # Clean models except defaults
```

### Code Generation

```bash
bff genConfigKeys      # Generate configuration keys and types
bff genGqlTypes        # Generate GraphQL schema and types
```

## Key Architectural Patterns

### 1. BfNode Database Pattern

- **Location**: `apps/bfDb/classes/BfNode.ts`
- **Pattern**: Base class for all database entities with GraphQL integration
- **Features**:
  - Multi-backend storage abstraction
  - Automatic GraphQL schema generation
  - Relationship management with type safety
  - Connection-based pagination (Relay-style)

### 2. Isograph GraphQL Integration

- **Location**: `apps/boltFoundry/__generated__/__isograph/`
- **Pattern**: Type-safe GraphQL client with entrypoint-based routing
- **Key Files**:
  - `entrypoints/` - Route definitions that generate resolvers
  - `__generated__/` - Auto-generated types and fragment readers
- **Usage**: Define entrypoints in `entrypoints/`, run `bff genGqlTypes` to
  generate types

### 3. Design System (bfDs)

- **Location**: `apps/bfDs/components/`
- **Pattern**: Reusable React components with consistent theming
- **Testing**: Component tests use React Testing Library
- **Usage**: Import from `apps/bfDs/components/` in other apps

### 4. Multi-Backend Configuration

- **Pattern**: Environment-based backend selection via configuration variables
- **Backends**: Neon (production), PostgreSQL (staging), SQLite (development)
- **Configuration**: Secure management via environment variables and 1Password
  integration

### 5. Content System

- **MDX Support**: Markdown with embedded React components in `content/`
- **Jupyter Integration**: `.ipynb` notebook support and rendering
- **Build Process**: Content processed during `bff build` via
  `infra/appBuild/contentBuild.ts`

## Build Process Architecture

The build system is complex and sequential:

1. **Config Generation**: Generate configuration keys and types
2. **Barrel Files**: Auto-generate export files for modules
3. **Route Building**: Process and validate route definitions
4. **Content Building**: Process MDX and notebook content
5. **GraphQL Types**: Generate GraphQL schema and types
6. **Isograph Compilation**: Compile GraphQL fragments and entrypoints
7. **Client/Server Compilation**: ESBuild for client, Deno compile for server

## Testing Strategy

- **Unit Tests**: `bff test` - Per-module testing with Deno test runner
- **Integration Tests**: Database and GraphQL integration testing
- **E2E Tests**: `bff e2e` - Puppeteer-based end-to-end testing
- **Component Tests**: React component testing in `__tests__/` directories
- **Custom Evaluations**: LLM prompt testing framework

## Important Implementation Details

### Import Path Conventions

- Use Deno-style imports with import maps defined in `deno.jsonc`
- Apps: `apps/` prefix (e.g., `apps/bfDb/bfDb.ts`)
- Packages: `packages/` prefix or named imports (e.g., `@bolt-foundry/logger`)
- Generated Isograph: `@iso/` prefix

### Configuration Management

- **No direct environment access** - Use `packages/get-configuration-var/`
  instead
- **1Password Integration** for secrets in production
- **Multi-environment** configs (development, staging, production)

### Custom Linting Rules

- **Location**: `infra/lint/bolt-foundry.ts`
- **Key Rules**:
  - `no-env-direct-access` - Must use configuration variables
  - `no-console` - Use logger instead
  - `no-logger-set-level` - Logger level set by configuration

### Router Architecture

- **Traditional Routes**: React component-based in `apps/boltFoundry/routes.ts`
- **Isograph Routes**: GraphQL entrypoint-based with type safety
- **Route Registration**: Via `apps/web/routes/routeRegistry.ts`

## Key Files for Development

### Core Configuration

- `deno.jsonc` - Deno workspace, imports, and linting configuration
- `package.json` - npm dependencies for Node.js compatibility
- `apps/boltFoundry/routes.ts` - Application routing definitions

### Database Layer

- `apps/bfDb/bfDb.ts` - Core database API and exports
- `apps/bfDb/classes/BfNode.ts` - Base node class for all entities
- `apps/bfDb/backend/` - Database backend implementations (PostgreSQL, SQLite,
  Neon)
- `apps/bfDb/builders/` - Schema builders for database and GraphQL

### Web Server

- `apps/web/web.tsx` - Main server entry point
- `apps/web/handlers/` - Request handling (main, static, route handlers)
- `apps/boltFoundry/AppRoot.tsx` - React application root

### Build System

- `infra/bff/friends/build.bff.ts` - Main build pipeline
- `infra/appBuild/appBuild.ts` - Client-side build configuration
- `infra/appBuild/contentBuild.ts` - Content processing (MDX, notebooks)

## Development Workflow Best Practices

1. **Always run** `bff devTools` to start development environment
2. **Before committing**, run `bff format && bff lint && bff check`
3. **Test changes** with `bff test` and `bff e2e --build`
4. **Use BFF commit workflow**: `bff commit -m "message" --pre-check --submit`
5. **For full CI check**, run `bff ci` before submitting PRs
6. **Database changes** require running `bff genGqlTypes` to update schema
7. **Content changes** require `bff build` to process MDX and notebooks

## Architecture Principles

- **Type Safety**: Comprehensive TypeScript with strict checking
- **Modularity**: Clear separation between apps, packages, and infrastructure
- **Configuration-Driven**: Environment-based configuration with secure secret
  management
- **Testing-First**: Comprehensive test coverage with multiple testing
  strategies
- **Developer Experience**: Custom tooling (BFF) optimized for team workflow
- **Build Reproducibility**: Deterministic builds with explicit dependency
  management

## AI Development Guidelines

- Check BFF AI for commands that are already accessible to AI agents. If a
  command isn't there, it's probably in bff help. If the developer asks, you can
  run commands in the bff namespace.

## Source Control Notes

- We don't use git, we use sapling.
- For detailed workflow including commit splitting, see `cards/version-control.card.md`
