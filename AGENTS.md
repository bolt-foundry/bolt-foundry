# AI Agent Configuration

This repository is configured for use with AI coding assistants. CLAUDE.md is a
symlink to this file for compatibility with Claude Code (claude.ai/code).

## Quick Start

- **Project**: Bolt Foundry - Open-source platform for reliable LLM systems
- **Runtime**: Deno 2.x with TypeScript
- **Source Control**: Sapling SCM (not Git)
- **Task Runner**: `bff <command>` (Bolt Foundry Friend)
- **Package Management**: npm (NOT deno install - see below)

## Essential Commands

```bash
bff build              # Full project build
bff test               # Run tests
bff e2e --build        # Run end-to-end tests
bff ci                 # Full CI pipeline
bff devTools           # Start development environment
bff ai                 # List AI-safe commands
```

## Key Resources

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

## Important Notes

1. **No MDX** - Use plain Markdown (`.md`) only
2. **No direct env access** - Use `packages/get-configuration-var/`
3. **Test first** - Follow TDD practices in testing card
4. **Use BFF commands** - Prefer `bff` over direct commands

## Dependency Management

This project uses **npm** for managing dependencies, not Deno's built-in package
management:

- Run `npm install` to install dependencies (NOT `deno install`)
- The project is configured with `"nodeModulesDir": "manual"` in deno.jsonc
- If you see errors about `.deno` directory, delete node_modules and run
  `npm install`
- This approach ensures compatibility with all npm packages and standard module
  resolution

For detailed technical documentation, see the memos and cards referenced above.
