# Implementation Memo: New boltFoundry.com App

**Date**: 2025-07-01\
**Updated**: 2025-07-11\
**Status**: In Progress\
**Phase**: 1.5 (Isograph Integration)

## Overview

Create a new `apps/boltFoundry.com` application based on the aibff GUI
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
- Implement `bft dev boltfoundry-com` command
- Single executable build process

### Directory Structure

```
apps/boltFoundry.com/
├── vite.config.ts           # Vite configuration
├── deno.json                # Deno configuration with tasks
├── index.html               # HTML entry point
├── server.ts                # Backend server
├── src/                     # React frontend source
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main app component
│   └── components/         # React components
├── dist/                   # Built frontend assets (generated)
├── commands/app.ts          # CLI command handler
└── main.ts                 # CLI entry point integration
```

### Implementation Steps

#### 1. Create CLI Command (`infra/bft/tasks/app.bft.ts`)

- Hardcoded to handle `boltfoundry.com` argument
- Support `--dev`, `--build`, `--port`, `--no-open` flags
- Process management for Vite dev server and backend server

#### 2. Create Backend Server (`apps/boltFoundry.com/server.ts`)

- Basic Deno HTTP server
- Static file serving from `dist/` in production
- Proxy to Vite dev server in development mode
- Health check endpoint (`/health`)
- SPA fallback for client-side routing

#### 3. Create Vite Configuration (`apps/boltFoundry.com/vite.config.ts`)

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
bft dev boltfoundry-com           # Run development mode with HMR
bft dev boltfoundry-com --build   # Build assets only
bft dev boltfoundry-com --port 4000  # Custom port
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

## Phase 1.5: Isograph Integration (Current)

### Overview

Add Isograph GraphQL integration to the existing boltfoundry-com app for landing
page routing. This leverages the proven patterns from apps/boltFoundry while
keeping the scope minimal.

### Goals

- Add isograph routing to existing boltfoundry-com app
- Create single entrypoint for home route
- Establish GraphQL integration foundation for future expansion
- Maintain existing Vite + Deno architecture

### Implementation Steps

#### 1. Add Isograph Configuration

**File**: `apps/boltfoundry-com/isograph.config.json`

```json
{
  "project_root": ".",
  "artifact_directory": "./__generated__",
  "schema": "../bfDb/graphql/__generated__/schema.graphql",
  "options": {
    "on_invalid_id_type": "ignore",
    "include_file_extensions_in_import_statements": true,
    "no_babel_transform": true
  }
}
```

#### 2. Update Build System

- Add isograph compilation to `infra/bft/tasks/iso.bft.ts`
- Update `infra/appBuild/routesBuild.ts` to include boltfoundry-com
- Add import mappings to root `deno.jsonc` for boltfoundry-com

#### 3. Create Isograph Environment

**Client**: `apps/boltfoundry-com/isographEnvironment.ts` **Server**:
`apps/boltfoundry-com/server/isographEnvironment.ts`

Follow patterns from apps/boltFoundry environment setup

#### 4. Add Entrypoint Structure

**Directory**: `apps/boltfoundry-com/entrypoints/`

- `EntrypointHome.ts` - Single entrypoint for landing page

#### 5. Update Router Integration

- Modify `src/App.tsx` to support isograph entrypoints
- Add `BfIsographFragmentReader` integration
- Update router to handle both traditional and isograph routes

### Success Criteria

- [ ] Landing page renders via isograph entrypoint
- [ ] Build system generates isograph artifacts
- [ ] Routing works with both traditional and GraphQL-powered routes
- [ ] Maintains existing dev/build/serve functionality

## Phase 2: Full Webapp (Future)

### Planned Enhancements

- Additional isograph entrypoints for new pages
- User authentication and session management
- Dynamic content management
- Advanced routing and page management
- Component library integration
- Database-driven content

### Migration Path

- Phase 1.5 establishes isograph foundation
- Phase 2 can add additional entrypoints and features
- Can leverage full apps/boltFoundry patterns as needed

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

- [ ] `bft dev boltfoundry-com` launches working landing page
- [ ] `--dev` mode provides hot reload experience
- [ ] `--build` mode creates production-ready assets
- [ ] Single executable serves both static and dynamic content
- [ ] Basic landing page displays correctly in browser

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
