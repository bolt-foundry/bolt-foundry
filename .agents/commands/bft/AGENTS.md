# AI Agent Configuration Deck

This repository is configured for use with AI coding assistants. This deck
provides guidance for AI agents working with the Bolt Foundry codebase.

## Base Card: Bolt Foundry Project Overview

**Project**: Bolt Foundry - Open-source platform for reliable LLM systems
**Runtime**: Deno 2.x with TypeScript **Source Control**: Sapling SCM (not Git)
**Task Runner**: `bft <command>` (Bolt Foundry Tool) **Package Management**: npm
(NOT deno install - see below)

## Card: Essential Commands

When working with this codebase, use these primary commands:

```bash
bft build              # Full project build
bft test               # Run tests
bft e2e --build        # Run end-to-end tests
bft ci                 # Full CI pipeline
bft devTools           # Start development environment
bft ai                 # List AI-safe commands
```

Always prefer `bft` commands over direct tool invocation when available.

## Card: Key Resources

**Development Practices:**

- `decks/cards/version-control.card.md` - Sapling SCM and commit workflow
- `decks/cards/testing.card.md` - TDD practices
- `decks/cards/coding.card.md` - Code organization and style

**Architecture Documentation:**

- `memos/guides/` - Technical architecture and patterns
- `memos/plans/` - Implementation plans (dated)

**Project Structure:**

- `apps/` - Main applications (bfDb, bfDs, boltFoundry, etc.)
- `packages/` - Reusable packages
- `infra/` - Build and tooling infrastructure
- `decks/` - Behavior specifications and cards

## Card: Critical Constraints

When working with this codebase, follow these rules:

1. **No MDX** - Use plain Markdown (`.md`) only
2. **No direct env access** - Use `packages/get-configuration-var/`
3. **Test first** - Follow TDD practices in testing card
4. **Use BFT commands** - Prefer `bft` over direct commands
5. **TypeScript array syntax** - Always use `Array<T>` instead of `T[]` for
   array types (e.g., `Array<BfDsLiteTabItem>` not `BfDsLiteTabItem[]`)

## Card: Dependency Management

This project uses **npm** for managing dependencies, not Deno's built-in package
management:

### Approach

- Run `npm install` to install dependencies (NOT `deno install`)
- The project is configured with `"nodeModulesDir": "manual"` in deno.jsonc
- If you see errors about `.deno` directory, delete node_modules and run
  `npm install`
- This approach ensures compatibility with all npm packages and standard module
  resolution

### Troubleshooting

If you encounter module resolution issues:

1. Delete `node_modules/` directory
2. Run `npm install`
3. Restart your development environment

## Card: Code Organization

When adding new code:

### File placement

- **Applications**: `apps/{app-name}/`
- **Shared packages**: `packages/{package-name}/`
- **Build tools**: `infra/`
- **Documentation**: `memos/guides/` or `docs/`

### Naming conventions

- Use kebab-case for directories and files
- Use PascalCase for TypeScript classes and interfaces
- Use camelCase for variables and functions
- Always use `Array<T>` syntax for TypeScript arrays

## Using This Configuration

1. Start by running `bft ai` to see available AI-safe commands
2. Reference the cards in `decks/cards/` for specific practices
3. Check `memos/guides/` for architectural guidance
4. Use `bft devTools` to start the development environment
5. Always run tests before submitting changes: `bft test`

For detailed technical documentation, see the memos and cards referenced above.
