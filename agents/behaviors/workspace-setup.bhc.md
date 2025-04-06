# Workspace Setup Protocol

This behavior card defines the standard process for setting up and managing
workspaces in the Bolt Foundry monorepo.

## Purpose

Workspaces in the Bolt Foundry project allow for modular development of features
and applications within the monorepo structure. This protocol establishes
guidelines for creating and configuring new workspaces.

## Workspace Structure

When creating a new workspace, ensure it follows this structure:

```
apps/[workspace-name]/
  ├── components/      # UI components 
  ├── bfdb/           # Database models (if applicable)
  ├── graphql/        # GraphQL schemas (if applicable)
  ├── docs/           # Documentation
  │   └── 0.1/        # Versioned implementation plans
  ├── deno.jsonc      # Deno configuration
  └── package.json    # NPM dependencies
```

## Configuration Files

### Default `deno.jsonc`

Every workspace should include a minimal `deno.jsonc` file:

```jsonc
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.11",
    "@std/path": "jsr:@std/path@^1.0.8",
    "@std/testing": "jsr:@std/testing@^1.0.9",
    "react": "npm:react@^18.2.0",
    "react-dom": "npm:react-dom@^18.2.0"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "lint": {
    "rules": {
      "include": [
        "no-console",
        "no-self-compare",
        "no-sync-fn-in-async-fn",
        "verbatim-module-syntax",
        "no-eval"
      ]
    }
  },
  "fmt": {
    "indentWidth": 2,
    "lineWidth": 80,
    "semiColons": true,
    "singleQuote": false
  }
}
```

### Minimal `package.json`

Each workspace should contain a minimal `package.json`:

```json
{
  "name": "@bolt-foundry/[workspace-name]",
  "version": "0.1.0",
  "description": "[Brief description]",
  "main": "[main-entry-file].ts",
  "type": "module",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## Adding to Root Workspace Configuration

After creating the workspace:

1. Add the workspace path to the `workspace` array in the root `deno.jsonc`
   file:

```jsonc
"workspace": [
  "packages/bolt-foundry",
  "packages/logger",
  "packages/get-configuration-var",
  "examples/nextjs-sample",
  "apps/[workspace-name]"
],
```

## Dependency Management

Follow the dependency management behavior card for adding dependencies:

- Use `deno add npm:[package-name]` for adding npm packages
- Update both `deno.jsonc` and `package.json` as needed
- Document significant dependencies

## Importing Between Workspaces

Use absolute imports when referencing code from other workspaces:

```typescript
// Good - use absolute imports for cross-workspace references
import { getLogger } from "packages/logger/logger.ts";
import { SomeComponent } from "apps/bfDs/components/SomeComponent.tsx";

// Avoid - don't use relative imports for cross-workspace references
import { getLogger } from "../../packages/logger/logger.ts";
```

## Testing

Create appropriate tests in a `__tests__` directory within each major
subdirectory:

```
apps/[workspace-name]/
  ├── components/
  │   └── __tests__/   # Component tests
  ├── bfdb/
  │   └── __tests__/   # Database model tests
```

## Documentation

Maintain versioned implementation documentation:

1. Create a directory structure for versioned docs: `docs/0.1/`
2. Include an implementation plan for each version milestone
3. Maintain a backlog.md file for planned future work

## Workspace Registration Process

When creating a new workspace:

1. Create the directory structure and base files
2. Add configuration files (deno.jsonc, package.json)
3. Update root workspace references
4. Initialize with minimal implementation
5. Document the workspace purpose and structure

## Examples

See these existing workspaces for reference:

- `apps/bfDs` - Design system components
- `apps/bfDb` - Database models and utilities
- `apps/desks` - Persistent video communication workspace
- `packages/logger` - Shared logging utilities
