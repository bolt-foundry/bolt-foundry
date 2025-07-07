# AI Agent Configuration

This repository is configured for use with AI coding assistants. CLAUDE.md is a
symlink to this file for compatibility with Claude Code (claude.ai/code).

## Quick Start

- **Project**: Bolt Foundry - Open-source platform for reliable LLM systems
- **Runtime**: Deno 2.x with TypeScript
- **Source Control**: Sapling SCM (not Git)
- **Task Runner**: `bft <command>` (Bolt Foundry Tool)
- **Package Management**: Deno automatic node modules (see below)

## Essential Commands

```bash
bft build              # Full project build
bft test               # Run tests
bft e2e --build        # Run end-to-end tests
bft ci                 # Full CI pipeline
bft devTools           # Start development environment
bft ai                 # List AI-safe commands
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
4. **Use BFT commands** - Prefer `bft` over direct commands
5. **TypeScript array syntax** - Always use `Array<T>` instead of `T[]` for
   array types (e.g., `Array<BfDsLiteTabItem>` not `BfDsLiteTabItem[]`)

## Dependency Management

This project uses **Deno's automatic node modules management** for dependencies:

- Dependencies are automatically managed via `"nodeModulesDir": "auto"` in
  deno.jsonc
- No need to run `npm install` - Deno handles node_modules automatically
- Dependencies are declared in deno.jsonc imports map with `npm:` prefixes
- This approach provides seamless compatibility with npm packages while
  leveraging Deno's dependency management

For detailed technical documentation, see the memos and cards referenced above.
