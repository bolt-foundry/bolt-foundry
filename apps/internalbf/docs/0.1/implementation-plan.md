# InternalBF Implementation Plan - Version 0.1

**Version:** 0.1

## Version Summary

This initial implementation establishes the foundation for the InternalBF
application, creating a basic HTTP server that can route requests to different
internal services, with the first integrations being ThanksBot for Discord and
routing support for the Desks application.

## Technical Goals

- Create a stable HTTP server using Deno
- Implement request routing infrastructure
- Set up ThanksBot Discord integration
- Add support for routing to the Desks application
- Establish logging and error handling patterns

## Components and Implementation

### 1. HTTP Server (Simple)

**File**: `apps/internalbf/internalbf.ts`

**Purpose**: Create the core HTTP server and request handler

**Technical Specifications**:

- Use Deno's HTTP server
- Configure server port via environment variables
- Implement basic request logging
- Create route dispatching mechanism

**Implementation Details**:

```typescript
// Set up HTTP server with configurable port
const port = Number(Deno.env.get("PORT") ?? 5000);

// Request handler with route dispatching
function handleRequest(req: Request): Response {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);

  // Parse the URL to get the pathname
  const url = new URL(req.url);
  const path = url.pathname;

  // Route dispatching logic
  if (path.startsWith("/desks")) {
    return handleDesksRequest(req);
  }

  // Default response for unhandled routes
  return new Response("Hello World", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// Start the server
if (import.meta.main) {
  logger.info(`Starting internalbf app on port ${port}`);
  Deno.serve({ port, hostname: "0.0.0.0" }, handleRequest);
}
```

### 2. ThanksBot Integration (Moderate)

**File**: `apps/internalbf/services/thanksbot.ts`

**Purpose**: Implement Discord bot for tracking thank-you messages

**Technical Specifications**:

- Connect to Discord API using discord.js
- Listen for messages containing "#thanks"
- Parse mentioned users and reasons
- Store data in Notion database
- Respond with confirmation message

**Implementation Details**:

```typescript
// Set up ThanksBot with Discord and Notion integration
async function setupThanksBot() {
  // Get required environment variables
  const THANKSBOT_NOTION_TOKEN = getConfigurationVariable(
    "THANKSBOT_NOTION_TOKEN",
  );
  const THANKSBOT_NOTION_DATABASE_ID = getConfigurationVariable(
    "THANKSBOT_NOTION_DATABASE_ID",
  );
  const THANKSBOT_TOKEN = getConfigurationVariable("THANKSBOT_TOKEN");

  // Initialize Discord client with appropriate intents
  const client = new discord.Client({
    intents: [
      discord.IntentsBitField.Flags.Guilds,
      discord.IntentsBitField.Flags.GuildMessages,
      discord.IntentsBitField.Flags.MessageContent,
    ],
  });

  // Set up message handler for #thanks mentions
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith("#thanks")) {
      // Parse message to extract user and reason
      // Store in Notion database
      // Respond with confirmation
    }
  });

  // Login to Discord
  await client.login(THANKSBOT_TOKEN);
}
```

### 3. Desks Integration (Simple)

**File**: `apps/internalbf/services/desks.ts`

**Purpose**: Route requests to the Desks application

**Technical Specifications**:

- Import Desks request handler
- Forward requests with path starting with "/desks"
- Maintain request context and headers

**Implementation Details**:

```typescript
// Import Desks handler
import { handleDesksRequest } from "../desks/desks.ts";

// Route requests to Desks application
function routeToDesks(req: Request): Response {
  try {
    logger.info(`Routing request to Desks: ${req.url}`);
    return handleDesksRequest(req);
  } catch (error) {
    logger.error(`Error routing to Desks: ${error}`);
    return new Response("Error processing request", { status: 500 });
  }
}
```

### 4. Environment and Logging (Simple)

**File**: `apps/internalbf/utils/config.ts`

**Purpose**: Manage environment variables and logging

**Technical Specifications**:

- Use get-configuration-variable for environment management
- Set up structured logging with appropriate levels
- Create helper functions for common logging patterns

**Implementation Details**:

```typescript
// Import logging and configuration utilities
import { getLogger } from "packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

// Set up logger
const logger = getLogger(import.meta);

// Helper for required environment variables
function getRequiredEnvVar(name: string): string {
  const value = getConfigurationVariable(name);
  if (!value) {
    logger.error(`Required environment variable ${name} not set`);
    throw new Error(`Required environment variable ${name} not set`);
  }
  return value;
}
```

## Testing Strategy

1. **HTTP Server**:
   - Test server startup and configuration
   - Verify request logging and handling
   - Test route dispatching logic

2. **ThanksBot**:
   - Test Discord message parsing
   - Verify Notion database integration
   - Test error handling for missing tokens

3. **Desks Integration**:
   - Test routing to Desks application
   - Verify error handling for failed requests
   - Test path matching logic

## Next Steps

After completing this foundation implementation, the next version (v0.2) will
focus on:

1. Standardizing the service registration pattern
2. Implementing additional service integrations
3. Adding monitoring and health checks
4. Improving error handling and logging
