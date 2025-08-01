# Codebot Browser Launch Fix

PR: #1750

## The Problem

When running `bft codebot`:

1. Creates a container
2. Container runs `bft dev boltfoundry-com` ✅
3. Container tries to open Chrome ❌ (wrong - needs to open on host)

## The Solution

Build bidirectional communication into codebot with two bridge services:

### 1. Host Bridge Service

```typescript
// infra/apps/codebot/host-bridge.ts
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function startHostBridge() {
  const server = Deno.serve({ port: 8017 }, async (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/browser/open" && req.method === "POST") {
      const { url: targetUrl } = await req.json();
      logger.debug(`Opening browser: ${targetUrl}`);

      // Open browser on host
      const cmd = Deno.build.os === "darwin" ? "open" : "xdg-open";
      await new Deno.Command(cmd, { args: [targetUrl] }).output();

      return Response.json({ success: true });
    }

    if (url.pathname === "/pong" && req.method === "GET") {
      return Response.json({
        pong: true,
        from: "host",
        timestamp: new Date().toISOString(),
      });
    }

    // Add more endpoints as needed
    return new Response("Not Found", { status: 404 });
  });

  logger.debug("🌉 Host bridge started on port 8017");
  return server;
}

// Start in codebot.bft.ts:
// import { startHostBridge } from "@bfmono/infra/apps/codebot/host-bridge.ts";
// const hostBridge = startHostBridge();
```

### 2. Container Bridge Service

```typescript
// infra/apps/codebot/container-bridge.ts
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);
const workspaceId = Deno.env.get("WORKSPACE_ID") || "unknown";

// Global app state
let appProcess: Deno.ChildProcess | null = null;

async function checkAppHealth(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000", {
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function startContainerBridge() {
  const server = Deno.serve({ port: 8017 }, async (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/status" && req.method === "GET") {
      const appHealthy = await checkAppHealth();
      const appStatus = appProcess
        ? (await appProcess.status).success === false
          ? "crashed"
          : appHealthy
          ? "running"
          : "starting"
        : "not started";

      return Response.json({
        ready: true,
        services: {
          "boltfoundry-com": {
            status: appStatus,
            healthy: appHealthy,
            url: `http://${workspaceId}.codebot.local:8000`,
          },
        },
        workspaceId,
      });
    }

    if (url.pathname === "/ping" && req.method === "GET") {
      // Ping the host to verify connectivity
      try {
        const hostResponse = await fetch("http://host.codebot.local:8017/pong");
        const hostData = await hostResponse.json();

        return Response.json({
          pong: true,
          timestamp: new Date().toISOString(),
          workspaceId,
          hostPong: hostData,
        });
      } catch (error) {
        return Response.json({
          pong: true,
          timestamp: new Date().toISOString(),
          workspaceId,
          hostError: error.message,
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  });

  logger.debug("🌉 Container bridge started on port 8017");
  return server;
}

// Container entrypoint script
if (import.meta.main) {
  const bridge = await startContainerBridge();

  // Start the app
  appProcess = new Deno.Command("bft", {
    args: ["dev", "boltfoundry-com"],
  }).spawn();

  // Wait for app to be ready
  let ready = false;
  for (let i = 0; i < 30; i++) {
    if (await checkAppHealth()) {
      ready = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (ready) {
    // Tell host to open browser
    await fetch("http://host.codebot.local:8017/browser/open", {
      method: "POST",
      body: JSON.stringify({
        url: `http://${workspaceId}.codebot.local:8000`,
      }),
    });
  } else {
    logger.error("App failed to start after 30 seconds");
  }

  // Keep bridge running
  await bridge.finished;
}
```

## Why This Works

- Both host and container bridges use port 8017 (no conflicts since they're on
  different network namespaces)
- **Container → Host**: Can open browsers via `http://host.codebot.local:8017`
- **Host → Container**: Can check status via
  `http://${workspaceId}.codebot.local:8017`
- Uses `host.codebot.local` for container-to-host communication
- Simple HTTP APIs = easy to extend and debug

## Implementation

1. Create `infra/apps/codebot/host-bridge.ts`
2. Create `infra/apps/codebot/container-bridge.ts`
3. Import and start host bridge in `codebot.bft.ts`
4. Update Dockerfile to run container bridge as entrypoint
5. Container auto-opens browser once app is ready

Note: `host.codebot.local` is already configured in `/etc/hosts` to point to the
host machine (192.168.64.1)
