# Codebot

Codebot provides containerized development environments for Bolt Foundry with
automatic browser launching and host-container communication.

## Quick Start

```bash
# Start a new codebot workspace
bft codebot

# The container will automatically:
# 1. Start the development server
# 2. Open your browser when the app is ready
# 3. Be accessible at http://{workspace-id}.codebot.local:8000
```

## Host Bridge System

Codebot includes a bidirectional communication system between containers and the
host machine, enabling containers to request browser launches and other host
services.

### Architecture

The system consists of two bridge services that communicate over HTTP:

```
┌─────────────────────────┐         ┌─────────────────────────┐
│      Host Machine       │         │       Container         │
│                         │         │                         │
│  Host Bridge (8017)     │ ← HTTP → │  Container Bridge (8017)│
│  - Opens browsers       │         │  - Monitors app health  │
│  - Handles host actions │         │  - Requests browser open│
└─────────────────────────┘         └─────────────────────────┘
```

### Components

#### Host Bridge (`host-bridge.ts`)

- **Port**: 8017
- **Endpoints**:
  - `POST /browser/open` - Opens a URL in the host browser
  - `GET /pong` - Health check endpoint
- **Auto-started**: Launches automatically when you run `bft codebot`

#### Container Bridge (`container-bridge.ts`)

- **Port**: 8017 (inside container network)
- **Endpoints**:
  - `GET /status` - Reports container and app health
  - `GET /ping` - Tests connectivity to host
- **Features**:
  - Automatically starts `bft dev boltfoundry-com`
  - Monitors app health on localhost:8000
  - Requests browser launch when app is ready

### Network Configuration

- **Host Resolution**: `host.codebot.local` → 192.168.64.1
- **Container Resolution**: `{workspace-id}.codebot.local` → container IP
- **DNS Server**: Runs on port 15353 for `*.codebot.local` domains

### How It Works

1. Run `bft codebot`
2. Host bridge starts on your machine (if not already running)
3. Container starts with container bridge in background
4. Container bridge launches the dev server
5. Once the app is healthy, container bridge sends request to host bridge
6. Host bridge opens your default browser to the workspace URL

### Manual Testing

```bash
# Test host bridge from your machine
curl http://localhost:8017/pong

# Test host bridge from container
bft codebot --exec "curl http://host.codebot.local:8017/pong"

# Check container bridge status (from host)
curl http://{workspace-id}.codebot.local:8017/status
```

### Troubleshooting

#### Host bridge not starting

- Check if port 8017 is already in use: `lsof -i :8017`
- Manually start with logging:
  ```bash
  deno run --allow-net --allow-run --allow-env infra/apps/codebot/host-bridge.ts
  ```

#### Container can't reach host

- Verify DNS resolution: `bft codebot --exec "ping host.codebot.local"`
- Check host bridge is running: `pgrep -f host-bridge.ts`
- Ensure `/etc/resolver/codebot.local` exists with:
  ```
  nameserver 127.0.0.1
  port 15353
  ```

#### Browser not opening automatically

- Check container bridge logs:
  `bft codebot --exec "cat /tmp/container-bridge.log"`
- Verify app is actually running:
  `curl http://{workspace-id}.codebot.local:8000`
- Test browser open manually:
  ```bash
  curl -X POST http://localhost:8017/browser/open \
    -H "Content-Type: application/json" \
    -d '{"url":"https://example.com"}'
  ```

### Development

To modify the bridge behavior:

1. **Host Bridge**: Edit `infra/apps/codebot/host-bridge.ts`
2. **Container Bridge**: Edit `infra/apps/codebot/container-bridge.ts`
3. **Run tests**:
   `deno test infra/apps/codebot/__tests__/bridge.integration.test.ts`

The bridges use simple HTTP APIs for easy extension and debugging. Add new
endpoints as needed for additional host-container communication.
