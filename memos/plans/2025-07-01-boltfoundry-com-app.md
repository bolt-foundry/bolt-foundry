# Implementation Memo: New boltFoundry.com App

**Date**: 2025-07-01\
**Status**: Completed\
**Phase**: 1 (Hello World) ✅

## Overview

Create a new `apps/boltfoundry-com` application using a shared app-server
package, serving as a clean landing page that compiles to a single executable.
This implementation includes reusable server components and comprehensive E2E
testing.

## Architecture Decision

Based on the successful aibff GUI implementation, we created a shared app-server
package and new Vite + Deno architecture:

- **Frontend**: React + Vite for development experience and build tooling
- **Backend**: Shared `@bolt-foundry/app-server` package for reusable server
  logic
- **Build**: Single executable with embedded frontend assets
- **CLI Integration**: `bft app boltfoundry-com` and
  `bft compile boltfoundry-com`
- **Testing**: E2E tests with automated screenshot capture

## Phase 1: Hello World Implementation

### Goals

- Create minimal working landing page
- Establish Vite + Deno architecture foundation
- Implement `bft app boltfoundry.com` command
- Single executable build process

### Actual Directory Structure

```
apps/boltfoundry-com/          # Hyphenated naming (not camelCase)
├── vite.config.ts            # Vite configuration with monorepo aliases
├── deno.json                 # Minimal config (tasks removed, uses BFT)
├── index.html                # HTML entry point
├── server.ts                 # Backend using @bolt-foundry/app-server
├── src/                      # React frontend source
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Main app component
│   └── components/          # React components
├── dist/                     # Built frontend assets (generated)
├── public/                   # Static assets (vite.svg, etc.)
└── __tests__/
    └── e2e/
        └── landing.test.e2e.ts  # E2E tests with screenshot capture

packages/app-server/           # NEW: Shared server package
└── app-server.ts             # Reusable Vite + Deno server logic
```

### Implementation Steps

#### 1. Create Shared Server Package (`packages/app-server/`)

- ✅ **AppServer class** for reusable Vite + Deno server logic
- ✅ **Dev/prod modes** with automatic Vite proxy and static file serving
- ✅ **Health check endpoint** (`/health`) built-in
- ✅ **SPA fallback** for client-side routing
- ✅ **Content-Type handling** for various file types

#### 2. Update CLI Commands (`infra/bft/tasks/`)

- ✅ **app.bft.ts**: Handle `boltfoundry-com` with `--dev`, `--build`, `--port`
  flags
- ✅ **compile.bft.ts**: Added `boltfoundry-com` compilation with
  `--include dist`
- ✅ **e2e.bft.ts**: Simplified to pure test runner (removed hardcoded apps)

#### 3. Create Backend Server (`apps/boltfoundry-com/server.ts`)

- ✅ **Uses shared app-server package** instead of custom implementation
- ✅ **Environment + CLI args** for port configuration (E2E testing support)
- ✅ **import.meta.resolve()** for consistent asset path resolution
- ✅ **Graceful shutdown** handling

#### 4. Create Vite Configuration (`apps/boltfoundry-com/vite.config.ts`)

- ✅ **Deno plugin integration** with `@deno/vite-plugin`
- ✅ **React plugin** with TypeScript support
- ✅ **Monorepo aliases** (`@bfmono/`, `@bolt-foundry/`)
- ✅ **Dynamic HMR port** configuration for development

#### 5. Create React Application

- ✅ **`index.html`**: Basic Vite + React template
- ✅ **`src/main.tsx`**: React entry point with StrictMode
- ✅ **`src/App.tsx`**: Working Vite + React landing page
- ✅ **`public/vite.svg`**: Static assets properly included

#### 6. E2E Testing Infrastructure

- ✅ **`__tests__/e2e/landing.test.e2e.ts`**: Concrete E2E tests
- ✅ **Screenshot capture**: Automated PNG screenshots for debugging
- ✅ **Server lifecycle**: Proper startup/shutdown with stream cleanup
- ✅ **HTTP 200 assertions**: Verify landing page and health endpoint

#### 7. Build Integration

- ✅ **Development**: `bft app boltfoundry-com --dev` with HMR
- ✅ **Production**: `bft compile boltfoundry-com` creates single executable
- ✅ **Asset embedding**: Frontend assets included in binary with
  `--include dist`
- ✅ **CLI integration**: Full BFT task runner integration

### Technical Specifications

#### Vite Configuration

```typescript
export default defineConfig({
  plugins: [
    deno(),
    react({ babel: { babelrc: true } }),
  ],
  server: {
    hmr: { port: dynamicPort },
  },
  resolve: {
    alias: {
      "@bfmono/": "../../../",
    },
  },
  publicDir: "@bfmono/static",
});
```

#### Backend Server Features

- **Development Mode**: Proxy frontend requests to Vite dev server
- **Production Mode**: Serve built assets directly from `dist/`
- **SPA Support**: Fallback to `index.html` for client-side routing
- **Health Check**: `/health` endpoint for monitoring
- **Port Configuration**: Configurable via CLI flags

#### CLI Command Structure

```bash
bft app boltfoundry-com           # Run production server
bft app boltfoundry-com --dev     # Run development mode with HMR  
bft app boltfoundry-com --build   # Build assets only
bft app boltfoundry-com --port 4000  # Custom port
bft compile boltfoundry-com       # Compile to single executable
bft e2e apps/boltfoundry-com/__tests__/e2e/  # Run E2E tests
```

### Dependencies

#### Frontend Dependencies

- `react` + `react-dom`: UI framework
- `@vitejs/plugin-react`: Vite React integration
- `@deno/vite-plugin`: Deno + Vite integration
- `vite`: Build tooling and dev server

#### Backend Dependencies

- ✅ **`@bolt-foundry/app-server`**: Shared server package
- ✅ **`@bolt-foundry/logger`**: Logging infrastructure
- ✅ **Standard Deno runtime**: HTTP server and file system APIs
- ✅ **Existing `@bfmono/packages/cli-ui`**: CLI output

### Testing Strategy

#### Completed Testing

- ✅ **Manual Testing**: All CLI commands work correctly
- ✅ **Integration Testing**: Dev/build/compile modes function properly
- ✅ **E2E Testing**: Comprehensive Puppeteer tests with screenshot capture
- ✅ **Binary Testing**: Single executable serves content correctly
- ✅ **Stream Management**: Proper process cleanup without leaks

#### Future Testing (Phase 2)

- Unit tests for React components
- API endpoint testing (when GraphQL added)
- Performance testing for compiled binaries

## Phase 2: Full Webapp (Future)

### Planned Enhancements

- GraphQL integration with existing bfDb
- User authentication and session management
- Dynamic content management
- Advanced routing and page management
- Component library integration
- Database-driven content

### Migration Path

- Phase 1 provides solid foundation for Phase 2 expansion
- Architecture supports adding GraphQL, database, and auth layers
- Can leverage existing aibff patterns for advanced features

## Risk Assessment

### Low Risk

- Vite + Deno architecture is proven in aibff
- Single page scope limits complexity
- Existing CLI patterns to follow

### Medium Risk

- New `bft` task system integration
- Static asset management across monorepo
- Build process coordination

### Mitigation Strategies

- Start with minimal viable implementation
- Leverage proven aibff patterns
- Incremental feature addition

## Success Criteria

### Phase 1 Complete When:

- ✅ `bft app boltfoundry-com` launches working landing page
- ✅ `--dev` mode provides hot reload experience with HMR
- ✅ `--build` mode creates production-ready assets
- ✅ Single executable serves both static and dynamic content
- ✅ Basic landing page displays correctly in browser
- ✅ E2E tests verify functionality and capture screenshots
- ✅ Shared app-server package enables reusability

### Definition of Done

- ✅ CLI commands functional with all flags (`--dev`, `--build`, `--port`)
- ✅ Development and production modes working
- ✅ Landing page renders without errors (verified by E2E tests)
- ✅ Documentation updated to reflect actual implementation
- ✅ Comprehensive E2E testing with automated screenshots
- ✅ Single executable compilation with embedded assets
- ✅ Shared server architecture for future applications

## Notes

- Keep Phase 1 deliberately simple to establish solid foundation
- Focus on architecture and tooling over visual design
- Prepare for Phase 2 expansion without over-engineering
- Maintain consistency with existing monorepo patterns
