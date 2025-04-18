# Monorepo Structure Protocol

This behavior card defines the organization and management of code in a monorepo
(single repository containing multiple projects/packages).

## Root Level Organization

The monorepo is organized into the following top-level directories:

- `apps/`: Application implementations (frontend, backend, services)
- `packages/`: Shared libraries and utilities
- `infra/`: Infrastructure, build tools, and deployment configurations
- `content/`: Documentation and content resources
- `static/`: Static assets (images, CSS, fonts)
- `build/`: Compiled output (not committed to source control)
- `agents/`: AI agent definitions and behavior cards
- `docs/`: Project-level documentation

## Apps Directory Structure

Applications in the `apps/` directory follow a consistent pattern:

```
apps/
  ├── [app-name]/             # Each app has its own directory
  │   ├── components/         # UI components for the app
  │   │   └── shared/         # Components shared within this app
  │   ├── contexts/           # React contexts
  │   ├── hooks/              # Custom React hooks
  │   ├── lib/                # App-specific utilities
  │   ├── __generated__/      # Generated code
  │   ├── server/             # Server-side code for the app
  │   ├── entrypoints/        # Application entry points
  │   ├── graphql/            # GraphQL schema and resolvers (if applicable)
  │   ├── bfdb/               # Database models (if applicable)
  │   └── docs/               # App-specific documentation
```

## Packages Directory Structure

Shared libraries in the `packages/` directory follow a consistent pattern:

```
packages/
  ├── [package-name]/         # Each package has its own directory
  │   ├── __tests__/          # Tests for the package
  │   ├── docs/               # Package documentation
  │   ├── [package-name].ts   # Main package entry point
  │   └── deno.jsonc          # Package-specific configuration
```

## Infrastructure (infra) Directory Structure

Infrastructure code is organized by purpose:

```
infra/
  ├── appBuild/               # Build pipeline configuration
  ├── bff/                    # CLI tooling (Bolt Foundry Friends)
  │   ├── bin/                # Binary executable scripts
  │   ├── friends/            # Modular BFF commands
  │   └── prompts/            # Templates for LLM prompts
  ├── bin/                    # Executable scripts
  ├── constants/              # Shared configuration constants
  └── jupyter/                # Notebook integration
```

## Library Management Guidelines

- **Shared code**: Place any code used by multiple apps in `packages/`
- **App-specific code**: Keep within the app's directory structure
- **Internal libraries**: When an app exposes functionality to other apps,
  organize with clear public interfaces

## Module Import Patterns

- Use explicit paths with full imports (apps/, packages/, etc.)
- Avoid relative imports for cross-package dependencies
- Example: `import { getLogger } from "packages/logger/logger.ts"`

## Documentation Integration

- Cross-reference documentation between code and docs
- App-specific docs should be in `apps/[app-name]/docs/`
- Use versioned documentation (see "docs-directory" behavior card)

## Test Organization

- Place tests close to the code they test
- Use `__tests__` directories within their respective modules
- Example: `packages/bolt-foundry/__tests__/bolt-foundry.test.ts`

## Asset Management

- Store shared assets in `static/assets/`
- Group assets by type (images, videos, etc.)
- CSS is stored at the root of `static/` directory
- Example: `static/appStyle.css`, `static/bfDsStyle.css`

## Real-World Examples

The BoltFoundry repo follows this structure with specific apps like:

- `apps/boltFoundry/`: Main React application
- `apps/bfDb/`: Database models and utilities
- `apps/bfDs/`: UI components (design system)
- `apps/graphql/`: GraphQL schema and resolvers
- `apps/web/`: Web server and routing

The monorepo approach enables:

1. **Shared tooling**: All apps benefit from the same build tools
2. **Code reuse**: Packages can be imported by any app
3. **Atomic changes**: PRs can include changes across multiple apps
4. **Unified versioning**: All code is versioned together

## Developer Experience Guidelines

- Use consistent naming conventions across the monorepo
- Maintain clear boundaries between apps and packages
- Document dependencies between different parts of the system
- Leverage tooling that understands the monorepo structure (the BFF CLI)

By following this structure, developers can navigate the codebase more easily
and maintain consistency across multiple applications and packages within the
same repository.
