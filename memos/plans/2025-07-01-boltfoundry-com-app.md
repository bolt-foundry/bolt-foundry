# Implementation Memo: New boltFoundry.com App

**Date**: 2025-07-01\
**Status**: Implemented (Phase 1)\
**Phase**: 1 (Hello World)

## Overview

Create a new `apps/boltfoundry-com` application based on the aibff GUI
architecture, serving as a clean landing page that compiles to a single
executable. This will be a two-phase implementation starting with a simple hello
world.

## Architecture Decision

Based on the successful aibff GUI implementation, we'll replicate its Vite +
Deno architecture:

- **Frontend**: React + Vite for development experience and build tooling
- **Backend**: Deno server handling both API routes and static file serving
- **Build**: Single executable that serves static and dynamic assets
- **CLI Integration**: New `app` task in the `bft` task runner

## Phase 1: Hello World Implementation

### Goals

- Create minimal working landing page
- Establish Vite + Deno architecture foundation
- Implement `bft app boltfoundry-com` command
- Single executable build process

### Directory Structure

```
apps/boltfoundry-com/
├── vite.config.ts           # Vite configuration
├── deno.json                # Deno configuration with tasks
├── index.html               # HTML entry point
├── server.ts                # Backend server
├── src/                     # React frontend source
│   ├── main.tsx            # React entry point
│   └── App.tsx             # Main app component
└── dist/                   # Built frontend assets (generated)
```

### Implementation Steps

#### 1. Create CLI Command (`infra/bft/tasks/app.bft.ts`)

- Hardcoded to handle `boltfoundry-com` argument
- Support `--dev`, `--build`, `--port`, `--no-open` flags
- Process management for Vite dev server and backend server

#### 2. Create Backend Server (`apps/boltfoundry-com/server.ts`)

- Basic Deno HTTP server
- Static file serving from `dist/` in production
- Proxy to Vite dev server in development mode
- Health check endpoint (`/health`)
- SPA fallback for client-side routing

#### 3. Create Vite Configuration (`apps/boltfoundry-com/vite.config.ts`)

- Deno plugin integration
- React plugin with Babel support
- Monorepo path aliases (`@bfmono/`)
- Shared static assets configuration
- Dynamic HMR port configuration

#### 4. Create React Application

- **`index.html`**: Basic HTML template with React root
- **`src/main.tsx`**: React entry point with StrictMode
- **`src/App.tsx`**: Simple landing page component
- **`src/components/`**: Reusable components (Header, Footer, etc.)

#### 5. Build Integration

- Development: Concurrent Vite dev server + backend server
- Production: Build static assets + serve via single executable
- CLI integration with existing monorepo tooling

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
```

### Dependencies

#### Frontend Dependencies

- `react` + `react-dom`: UI framework
- `@vitejs/plugin-react`: Vite React integration
- `@deno/vite-plugin`: Deno + Vite integration
- `vite`: Build tooling and dev server

#### Backend Dependencies

- Standard Deno runtime (no additional deps for Phase 1)
- Leverage existing `@bfmono/packages/cli-ui` for CLI output

### Testing Strategy

#### Phase 1 Testing

- **Manual Testing**: CLI commands work correctly
- **Integration Testing**: Dev/build modes function properly
- **Basic E2E**: Server starts and serves content

#### Future Testing (Phase 2)

- Unit tests for components
- E2E tests with Puppeteer (following aibff pattern)
- Integration tests for API endpoints

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

- [x] `bft app boltfoundry-com` launches working landing page
- [x] `--dev` mode provides hot reload experience
- [x] `--build` mode creates production-ready assets
- [x] Single executable serves both static and dynamic content
- [x] Basic landing page displays correctly in browser

### Definition of Done

- CLI command functional with all flags
- Development and production modes working
- Landing page renders without errors
- Documentation updated for new command
- Basic testing completed

## Notes

- Keep Phase 1 deliberately simple to establish solid foundation
- Focus on architecture and tooling over visual design
- Prepare for Phase 2 expansion without over-engineering
- Maintain consistency with existing monorepo patterns
