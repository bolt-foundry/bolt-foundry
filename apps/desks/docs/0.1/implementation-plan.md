# Desks Implementation Plan - Version 0.1

**Version:** 0.1

## Version Summary

This initial implementation establishes a "hello world" integration of the Desks
application with the internalbf app, creating the foundation for future
development by setting up the routing and basic structure.

## Technical Goals

- Integrate Desks with the internalbf app
- Create a `/desks` route that displays a simple welcome page
- Establish the directory structure and integration patterns
- Implement a basic request handler

## Components and Implementation

### 1. Basic Handler (Simple)

**File**: `apps/desks/desks.ts`

**Purpose**: Create a simple request handler for the Desks application

**Technical Specifications**:

- Create a function to handle requests to the `/desks` route
- Return a basic HTML page with Desks branding
- Display version information
- Log requests to the Desks application

**Implementation Details**:

```typescript
// Simple request handler for the Desks application
export function handleDesksRequest(req: Request): Response {
  // Log requests
  logger.info(`[Desks] Handling request: ${req.url}`);

  // Return a basic HTML page
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Desks v0.1</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
          }
          h1 {
            color: #333;
          }
          .version {
            color: #666;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Desks</h1>
        <p>This is the initial implementation (v0.1) of the Desks application.</p>
        <p>Desks provides persistent video communication spaces optimized for iPad.</p>
        <p class="version">Version: 0.1</p>
      </body>
    </html>
  `,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    },
  );
}
```

### 2. InternalBF Integration (Simple)

**File**: `apps/internalbf/internalbf.ts`

**Purpose**: Integrate the Desks application with the internalbf app

**Technical Specifications**:

- Import the Desks handler
- Route requests to `/desks` to the Desks handler
- Preserve existing functionality

**Implementation Details**:

```typescript
// Update imports to include the Desks handler
import { handleDesksRequest } from "../desks/desks.ts";

// Update the request handler to route /desks requests
function handleRequest(req: Request): Response {
  logger.info(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);

  // Parse the URL to get the pathname
  const url = new URL(req.url);
  const path = url.pathname;

  // Route /desks requests to the Desks application
  if (path.startsWith("/desks")) {
    return handleDesksRequest(req);
  }

  // Default response for other routes
  return new Response("Hello World", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
```

## Testing Strategy

1. **Integration Test**:
   - Verify that accessing the `/desks` route returns the expected HTML
   - Confirm that logs are correctly generated
   - Check that other routes continue to function as expected

2. **Browser Test**:
   - Verify the basic styling and content of the welcome page
   - Test on both desktop and iPad browsers

## Next Steps

After completing this hello world implementation, the next version (v0.2) will
focus on:

1. Implementing basic Daily.co API integration
2. Creating a responsive UI layout
3. Building the foundation for video conferencing functionality
