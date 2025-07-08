# Implementation Plan: Isograph Routing Baseline

**Date**: 2025-07-07\
**Status**: Planning\
**Goal**: Establish standardized Isograph entrypoint routing infrastructure
across apps

## Objective

Create a minimal "hello world" landing page in `apps/boltfoundry-com` that uses
proper Isograph entrypoint routing patterns. This will serve as the foundation
for standardizing routing across both `boltfoundry-com` and `aibff/gui`.

## Background

Currently we have:

- **apps/boltFoundry**: Sophisticated routing with Isograph entrypoints (to be
  deprecated)
- **apps/boltfoundry-com**: Minimal app with basic Isograph setup but no routing
- **apps/aibff/gui**: Custom hash-based routing without Isograph

The goal is to migrate away from `apps/boltFoundry` and establish
`boltfoundry-com` as the new reference implementation, with `aibff/gui` becoming
a locally-hosted version using the same patterns.

## Current State Analysis

### apps/boltfoundry-com

- ✅ Basic Isograph setup (config, environment, generated types)
- ✅ GraphQL server with yoga
- ✅ Deno + Vite + React infrastructure
- ❌ No routing system
- ❌ No entrypoints defined
- ❌ No meaningful UI components

### Infrastructure Needed

1. Isograph entrypoint system
2. Route generation and matching
3. AppRoot component with routing logic
4. Minimal page components
5. Build system integration

## Implementation Plan

### Phase 1: E2E Test First

#### 1.1 Write Single E2E Test

- Write e2e test that visits "/" and expects to see "Hello World -
  bolt-foundry/bolt-foundry has X stars"
- Test should verify the GitHub stars count is a number
- This will fail initially - no implementation yet

#### 1.2 Implement Minimal Infrastructure to Make Test Pass

- Create all necessary components, routing, and Isograph setup
- Focus on making the e2e test pass with minimal but complete implementation
- Use real GitHub API through existing GithubRepoStats

### Phase 2: Core Routing Infrastructure

#### 2.1 Create Entrypoint Structure

```
apps/boltfoundry-com/
├── entrypoints/
│   └── EntrypointHome.ts
├── __generated__/
│   └── builtRoutes.ts
└── routes.ts
```

#### 2.2 Define Home Entrypoint

- Create `EntrypointHome.ts` with currentViewer { Home } fragment
- Query: `Query.currentViewer { Home }`
- Home fragment includes GithubRepoStats query: `githubRepoStats { stars }`
- Generate proper Isograph types for currentViewer.Home component

#### 2.3 Build Route Generation System

- Extract route generation logic from apps/boltFoundry
- Create `builtRoutes.ts` generation
- Integrate with bft build system

#### 2.4 Create AppRoot Component

- Replace simple App.tsx with routing-capable AppRoot
- Implement Isograph route matching
- Add fallback/404 handling

### Phase 3: Polish Implementation

#### 3.1 Create Home Page Component

- Create `<Home />` component that renders via currentViewer { Home } fragment
- Uses Isograph pattern: `currentViewer { Home }` renders `<Home />` component
- Home component displays: "Hello World - bolt-foundry/bolt-foundry has X stars"
- Home fragment queries GithubRepoStats for star count
- Follows currentViewer component rendering patterns from boltFoundry

#### 3.2 Route Configuration

- Define routes.ts with single home route
- Set up both regular and Isograph route arrays
- Configure path matching

#### 3.3 Navigation Infrastructure

- Basic RouterContext (if needed)
- RouterLink component for future expansion
- useRouter hook

### Phase 4: Build Integration

#### 4.1 Update Build Process

- Add route generation to build steps
- Ensure Isograph generation happens before route building
- Integrate with bft build system

#### 4.2 Server Integration

- Update server.ts to handle routing
- Add route matching logic
- Implement proper SSR for Isograph routes
- Ensure server can render Isograph entrypoints
- Add hydration markers for client takeover
- Support both server-rendered and client-side navigation

#### 4.3 Development Workflow

- Hot reload support for route changes
- Proper development server setup
- Build artifact generation

## Success Criteria

1. **Functional**: "/" route displays "Hello World - bolt-foundry/bolt-foundry
   has X stars" using currentViewer { Home } fragment pattern
2. **Patterns**: Uses same architectural patterns as apps/boltFoundry
3. **Build**: Routes generate automatically as part of build process
4. **Types**: Full TypeScript integration with generated types
5. **Universal Rendering**: Both server-side rendering and client-side hydration
   work seamlessly
6. **Well Tested**: Comprehensive test coverage for components, routing, and
   integration
7. **Reusable**: Infrastructure can be easily replicated in aibff/gui

## Files to Create/Modify

### New Files

- `entrypoints/EntrypointHome.ts`
- `routes.ts`
- `AppRoot.tsx`
- `components/Home.tsx`
- `__generated__/builtRoutes.ts`
- `__tests__/homepage.test.e2e.ts`

### Modified Files

- `src/main.tsx` (import AppRoot instead of App)
- `server.ts` (add routing logic)
- Build system integration with bft
- `schema.graphql` (if needed)

## Next Steps

1. Extract route generation utilities from apps/boltFoundry
2. Create minimal entrypoint and route definitions
3. Implement AppRoot with routing logic
4. Test end-to-end functionality
5. Document patterns for replication in aibff/gui

## References

- `apps/boltFoundry/routes.ts` - Route definition patterns
- `apps/boltFoundry/AppRoot.tsx` - Routing component structure
- `apps/boltFoundry/__generated__/builtRoutes.ts` - Generated route example
- `apps/boltFoundry/entrypoints/` - Entrypoint patterns
