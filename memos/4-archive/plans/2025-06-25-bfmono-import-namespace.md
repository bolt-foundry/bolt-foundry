# @bfmono Import Namespace Migration

## Overview

We are updating the Bolt Foundry monorepo to use the `@bfmono/` namespace prefix
for all internal package imports. This change transforms imports from bare paths
to properly namespaced paths.

## Migration Pattern

- **Before**: `packages/bfds-lite`
- **After**: `@bfmono/packages/bfds-lite`

This pattern applies to all internal imports:

- `packages/*` → `@bfmono/packages/*`
- `apps/*` → `@bfmono/apps/*`

## Primary Motivation

The main driver for this change is **bundler compatibility**. Modern bundlers
like Vite expect package imports to follow standard naming conventions. When
attempting to implement Vite for the aibff application, we encountered
resolution failures:

```
Failed to resolve import "@bolt-foundry/bfds-lite" from "src/App.tsx"
```

By adopting the `@bfmono/` namespace:

1. Bundlers can clearly distinguish between external npm packages and internal
   monorepo packages
2. The namespace acts as a clear boundary, signaling that these are
   monorepo-internal packages
3. Standard bundler configurations will work without complex custom resolution
   logic

## Additional Benefits

### Import Maps (Future Enhancement)

The `@bfmono/` namespace structure aligns with browser import map
specifications. This will enable future enhancements where we can:

- Define import mappings in the browser directly
- Serve packages without bundling for development
- Provide consistent resolution across different environments

### Clarity and Convention

- Clear separation between internal and external dependencies
- Follows npm scoping conventions that developers expect
- Makes the monorepo structure more explicit in import statements

## Implementation Notes

This is not a migration from `@bolt-foundry/` (which remains for published
packages) but from the current bare import paths. The change enables standard
tooling to work with our monorepo structure without requiring custom
configuration for each tool.

## Lint Rule

A new lint rule `bolt-foundry/no-cornercased-imports` has been implemented to
enforce this convention:

- **Rule name**: `bolt-foundry/no-cornercased-imports`
- **Description**: Enforces the use of `@bfmono/` prefix for internal imports
- **Auto-fixable**: Yes - the rule will automatically convert imports

The rule catches imports that start with these cornercased directory names:

- `apps/`
- `packages/`
- `infra/`
- `lib/`
- `util/`
- `experimental/`
- `content/`
- `docs/`
- `static/`
- `tmp/`

Example transformations:

```typescript
// Before (will trigger lint error)
import { getLogger } from "packages/logger/logger.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";

// After (auto-fixed)
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
```

The lint rule is configured in `deno.jsonc` and implemented in
`infra/lint/bolt-foundry.ts`.
