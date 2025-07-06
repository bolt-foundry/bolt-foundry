# @bolt-foundry/app-server

Shared server package for Vite + Deno applications in the Bolt Foundry monorepo.

## Features

- **Development Mode**: Proxies requests to Vite dev server
- **Production Mode**: Serves static files from dist directory
- **SPA Support**: Fallback to index.html for client-side routing
- **Health Check**: `/health` endpoint for monitoring
- **Configurable**: Port, paths, and behavior options

## Usage

```typescript
import { createAppServer } from "@bolt-foundry/app-server";

const server = createAppServer({
  port: 8000,
  isDev: false,
  distPath: "./dist",
  viteDevServerUrl: "http://localhost:5173",
  enableSpaFallback: true,
});

await server.start();
```

## Options

- `port`: Server port (default: 8000)
- `isDev`: Development mode flag (default: false)
- `distPath`: Path to built assets (default: "./dist")
- `viteDevServerUrl`: Vite dev server URL (default: "http://localhost:5173")
- `enableSpaFallback`: Enable SPA fallback routing (default: true)
