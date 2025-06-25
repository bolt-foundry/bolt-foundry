# aibff GUI Phase 1 Technical Plan

## Overview

This document outlines the technical implementation plan for Phase 1 of the
aibff GUI, focusing on basic infrastructure setup. Phase 1 establishes the
foundation for a locally-running web application that helps users create graders
through conversational AI interaction.

## Phase 1 Scope

From the main implementation plan:

- Create `gui` command in aibff (part of compiled binary)
- Set up embedded Deno server with Vite
- Create AibffNode base class extending GraphQLNode
- Create concrete node classes (AibffSample, AibffGrader, etc.)
- Set up isolated Isograph instance in aibff GUI folder
- Integrate BfDs components
- Set up PostHog analytics with basic event tracking
- Basic AI assistant powered by aibff render command
- Update build process to include GUI assets

## Technical Architecture Decisions

### 1. GUI Command Structure

- **Location**: `apps/aibff/src/commands/gui.ts`
- **Pattern**: Follows existing aibff command structure
- **Aliases**: `gui`, `web`
- **Flags**:
  - `--dev`: Run in development mode with Vite HMR
  - `--build`: Build GUI assets without starting server
  - `--port`: Specify server port (default: 3000)
  - `--no-open`: Don't auto-open browser on startup

### 2. Embedded Server Architecture

- **Server**: Deno's built-in HTTP server (`Deno.serve`)
- **No external frameworks** (Oak, Fresh, etc.)
- **Routing**: URLPattern API for clean route matching
- **Static asset serving**: Built assets embedded via `--include` flag
- **Development mode**: Proxy to Vite dev server
- **Production mode**: Serve embedded assets directly
- **Graceful shutdown**: Save pending state, close SSE connections on Ctrl+C

### 3. Frontend Build Integration

- **Build location**: `apps/aibff/gui/dist/`
- **Integration point**: `aibff rebuild` command
- **Build steps**:
  1. Run Vite build for GUI assets
  2. Include built assets in binary compilation
  3. Use `--include` flag to embed assets

### 4. Data Model Structure

#### AibffNode Base Class

- **Location**: `apps/bfDb/nodeTypes/aibff/AibffNode.ts`
- **Extends**: GraphQLNode (following PublishedDocument pattern)
- **Provides**:
  - Common file persistence logic
  - ID generation
  - Markdown with TOML frontmatter serialization (for readability)

#### Concrete Node Classes

All in `apps/bfDb/nodeTypes/aibff/`:

- `AibffSample.ts`
- `AibffGrader.ts`
- `AibffEvaluation.ts`
- `AibffSession.ts`
- `AibffConversation.ts`

### 5. GraphQL/Isograph Setup

- **Schema location**: `apps/aibff/src/gui/graphql/schema.ts`
- **GraphQL server**: GraphQL Yoga
- **Endpoint**: `/graphql` (with GraphiQL in dev mode)
- **Isolated instance**: Separate from main bfDb schema
- **Initial operations**:
  - `createConversation` mutation
  - `sendMessage` mutation
  - `conversation` query
  - `messages` query

### 6. Real-time Communication

- **Server-Sent Events (SSE)**: For streaming AI responses
- **GraphQL mutations**: For creating messages
- **Endpoint**: `/api/stream`
- **Flow**:
  1. Client sends message via GraphQL mutation
  2. Server triggers aibff render
  3. Response streams back via SSE

### 7. Frontend Stack

- **Build tool**: Vite
- **Framework**: React (via BfDs)
- **Components**: Import directly from `packages/`
- **Analytics**: PostHog (frontend only)
- **Dev server**: `http://localhost:5173` (Vite default)

### 8. AI Integration

- **Deck location**: `apps/aibff/gui/decks/hello-world.deck.md`
- **Render method**: Use aibff render function as library (not subprocess)
- **Initial deck**: Simple hello world conversation
- **Context passing**: Via deck context variables
- **Response handling**: Buffer complete response for v1 (no streaming yet)

## Implementation Steps

### Step 1: Create GUI Command

```typescript
// apps/aibff/src/commands/gui.ts
export const guiCommand: Command = {
  name: "gui",
  aliases: ["web"],
  description: "Launch the aibff GUI web interface",
  run: async (args: string[]) => {
    // Implementation
  },
};
```

### Step 2: Set Up Vite Project

```bash
cd apps/aibff
deno run -RWE npm:create-vite-extra@latest gui --template deno-react-swc
```

This creates:

```
apps/aibff/gui/
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── components/
├── vite.config.mts      # Deno-optimized config
├── deno.json            # Deno configuration
└── README.md
```

Note: The deno-react-swc template provides:

- SWC for fast TypeScript/JSX compilation
- Deno-compatible module resolution
- No package.json needed (uses Deno's import maps)

**Important**: After creating the Vite project, add it to the root workspace:

```jsonc
// In root deno.jsonc, add to workspace array:
{
  "workspace": [
    // ... existing entries ...
    "apps/aibff/gui"
  ]
}
```

### Step 3: Create AibffNode Classes

```typescript
// apps/bfDb/nodeTypes/aibff/AibffNode.ts
export abstract class AibffNode extends GraphQLNode {
  // Base implementation
}
```

### Step 4: Implement Server

- Parse dev/prod mode
- Set up URLPattern-based routing
- Set up SSE endpoint at `/api/stream`
- Set up GraphQL Yoga at `/graphql`
- Add `/api/config` endpoint for runtime configuration (PostHog key, etc.)
- Serve static assets or proxy to Vite
- Route requests appropriately
- Implement graceful shutdown handler

### Step 5: Create Hello World Deck

```markdown
<!-- apps/aibff/gui/decks/hello-world.deck.md -->

You are a helpful AI assistant in the aibff GUI. Greet the user and explain that
you're here to help them build graders.
```

### Step 6: Update Build Process

- Modify `apps/aibff/src/commands/rebuild.ts`
- Run `aibff gui --build` before compilation
- Update `--include` paths to include gui/dist

### Step 7: Frontend Components

Start with a minimal test to ensure BfDs integration works:

```typescript
// apps/aibff/gui/src/App.tsx
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function App() {
  return (
    <div>
      <h1>aibff GUI</h1>
      <BfDsButton onClick={() => console.log("BfDs works!")}>
        Test BfDs Integration
      </BfDsButton>
    </div>
  );
}
```

Once BfDs renders correctly, implement:

- Chat interface using BfDs components
- Message list component
- Input field with send button
- SSE connection management

### Step 8: PostHog Integration

```typescript
// Get config from server
const config = await fetch("/api/config").then((r) => r.json());

// Initialize in main.tsx only if key provided
if (config.posthogKey) {
  posthog.init(config.posthogKey, {
    api_host: "https://app.posthog.com",
    opt_out_capturing_by_default: checkOptOut(),
  });
}
```

## Development Workflow

1. **Start dev mode**: `aibff gui --dev`
   - Starts Deno server on port 3000
   - Proxies to Vite dev server on port 5173
   - Enables HMR for rapid development

2. **Test production build**:
   - Run `aibff rebuild` to compile with GUI
   - Run `aibff gui` to test embedded assets

3. **GraphQL development**:
   - Schema hot-reloads in dev mode
   - GraphiQL available at `/graphql` in dev mode
   - GraphQL Yoga handles all GraphQL requests

## File Structure

```
apps/aibff/
├── src/
│   ├── commands/
│   │   └── gui.ts
│   └── gui/
│       ├── graphql/
│       │   └── schema.ts
│       └── server.ts
├── gui/
│   ├── index.html
│   ├── deno.json
│   ├── vite.config.mts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── components/
│   └── decks/
│       └── hello-world.deck.md
└── memos/
    └── plans/
        └── 2025-06-aibff-gui-phase1-plan.md

apps/bfDb/nodeTypes/aibff/
├── AibffNode.ts
├── AibffSample.ts
├── AibffGrader.ts
├── AibffEvaluation.ts
├── AibffSession.ts
└── AibffConversation.ts
```

## Testing Strategy (TDD)

We'll use minimal TDD with Deno.test, focusing on three core tests that drive
the implementation:

### 1. GUI Command Test

```typescript
// apps/aibff/src/commands/__tests__/gui.test.ts
Deno.test("gui command starts server and responds to health check", async () => {
  // Start server in test mode on port 3001
  const process = await startGuiCommand(["--port", "3001"]);

  // Wait for server to be ready
  await waitForServer("http://localhost:3001/health");

  // Assert health check responds
  const response = await fetch("http://localhost:3001/health");
  assertEquals(response.status, 200);

  // Cleanup
  process.kill();
});
```

### 2. Message Flow Test

```typescript
// apps/aibff/src/gui/graphql/__tests__/schema.test.ts
Deno.test("sendMessage mutation creates message and triggers AI response", async () => {
  // Setup test schema
  const schema = createTestSchema();

  // Create temp directory for test isolation
  const tempDir = await Deno.makeTempDir();

  // Send message mutation
  const result = await schema.execute({
    query: `
      mutation {
        sendMessage(content: "Hello") {
          id
          content
          role
        }
      }
    `,
  });

  // Verify message saved
  const savedFile = await Deno.readTextFile(
    "test-data/conversations/test-session/conversation.md",
  );
  assertStringIncludes(savedFile, "Hello");

  // Verify aibff render was called
  assertSpyCalls(renderSpy, 1);
});
```

### 3. Build Integration Test

```typescript
// apps/aibff/src/commands/__tests__/rebuild.test.ts
Deno.test("rebuild includes GUI assets when GUI exists", async () => {
  // Mock GUI dist directory
  await ensureDir("apps/aibff/gui/dist");
  await Deno.writeTextFile("apps/aibff/gui/dist/index.html", "<html>");

  // Spy on Deno.Command to capture compile args
  const commandSpy = spy(Deno, "Command");

  // Run rebuild
  await rebuildCommand.run([]);

  // Verify --include flag contains GUI assets
  const compileCall = commandSpy.calls.find((c) => c.args[0] === "compile");
  assertStringIncludes(
    compileCall.args.join(" "),
    "--include=apps/aibff/gui/dist",
  );

  // Cleanup
  await Deno.remove("apps/aibff/gui/dist", { recursive: true });
});
```

These three tests will drive the implementation of:

- Command structure and server setup
- GraphQL schema and mutations
- AibffNode persistence
- AI integration via aibff render
- Build process modifications

Run tests with: `bff test apps/aibff`

## Error Handling Strategy

- **Server errors**: Log to console with full stack trace
- **User-facing errors**: Display "An error occurred, check the console" in red
  text
- **GraphQL errors**: Return standard GraphQL error format
- **File system errors**: Log and show user-friendly message about permissions
- **AI render errors**: Show partial response with error indicator

## Implementation Milestones

Each milestone should be completed and tested before moving to the next:

### Milestone 1: Project Setup

- [ ] Vite project created with deno-react-swc template
- [ ] Added to root workspace in deno.jsonc
- [ ] Basic App.tsx with "Hello aibff GUI"
- [ ] Manual Vite build works: `cd gui && deno run -A npm:vite build`

### Milestone 2: Basic Server

- [ ] `aibff gui` launches a web server
- [ ] Server responds to health check at `/health`
- [ ] `aibff gui --build` runs Vite build
- [ ] `aibff gui --dev` starts Vite dev server and proxies to it
- [ ] Browser opens to localhost:3000
- [ ] GUI command test passes

### Milestone 3: BfDs Integration

- [ ] Import BfDsButton from packages
- [ ] BfDsButton renders successfully
- [ ] HMR works with BfDs components

### Milestone 4: GraphQL Setup

- [ ] GraphQL Yoga serves at `/graphql`
- [ ] GraphiQL available in dev mode
- [ ] AibffNode base class implemented
- [ ] Basic query/mutation works

### Milestone 5: Message Persistence

- [ ] AibffConversation node saves to disk (Markdown with TOML frontmatter)
- [ ] GraphQL mutation creates messages
- [ ] Message flow test passes
- [ ] Test isolation with temp directories works

### Milestone 6: AI Integration

- [ ] "Hello world" deck created
- [ ] SSE endpoint streams responses
- [ ] AI response appears in browser

### Milestone 7: Production Build

- [ ] Vite build produces dist assets
- [ ] Assets embedded in binary with --include
- [ ] Production mode serves embedded assets
- [ ] Build integration test passes

### Milestone 8: Analytics

- [ ] PostHog initializes on frontend
- [ ] Basic page view tracked
- [ ] Opt-out mechanism works

### Final Validation

- [ ] All three TDD tests pass
- [ ] Full flow works: send message → AI responds → saves to disk

## Next Steps (Phase 2 Preview)

Once Phase 1 is complete, Phase 2 will add:

- Dynamic dimension selection flow
- YouTube comment examples
- Sample collection UI
- Grader generation logic

## Conversation Storage Format

Example conversation file structure:

```markdown
<!-- conversations/session-{id}/conversation.md --> +++

id = "conv-123" created_at = "2025-01-24T10:00:00Z" session_id = "session-456"
+++

## User

Hello, I need help creating a grader

## Assistant

I'll help you create a grader. What would you like to grade?

## User

YouTube comments for helpfulness
```

## Notes

- Keep Phase 1 minimal - just prove the architecture works
- Focus on development experience and build process
- Ensure all pieces integrate smoothly before adding features
- Document any Vite/Deno compatibility issues encountered
- Working directory context: GUI creates files relative to where `aibff gui` is
  run
