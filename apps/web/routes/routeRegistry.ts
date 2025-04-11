import type { Handler } from "apps/web/web.tsx";
import { registerAppRoutes } from "./appRoutes.ts";
import { registerIsographRoutes } from "./isographRoutes.ts";
import { graphQLHandler } from "apps/graphql/graphqlServer.ts";
import { handleAssemblyAI, handleLogout } from "../handlers/routeHandlers.ts";
import { serveDir } from "@std/http";

/**
 * Register all routes in the application
 */
export function registerAllRoutes(): Map<string, Handler> {
  // Initialize routes map
  const routes = new Map<string, Handler>();

  // Register standard app routes
  registerAppRoutes(routes);

  // Register isograph routes
  registerIsographRoutes(routes);

  // Register special routes
  registerSpecialRoutes(routes);

  return routes;
}

/**
 * Register special routes (GraphQL, static files, etc.)
 */
function registerSpecialRoutes(routes: Map<string, Handler>): void {
  // Serve static files
  routes.set("/static/:filename+", function staticHandler(req) {
    return serveDir(req, {
      headers: [
        "Cache-Control: public, must-revalidate",
        "ETag: true",
      ],
    });
  });

  // GraphQL handler
  routes.set("/graphql", graphQLHandler);

  // AssemblyAI handler
  routes.set("/assemblyai", handleAssemblyAI);

  // Simple logout route that clears cookies
  routes.set("/logout", handleLogout);

  // Forward requests to contacts-cms to local handler
  routes.set("/contacts-cms", async (req) => {
    const url = "https://bf-contacts.replit.app/api/contacts";
    const headers = new Headers(req.headers);

    // Read the body first
    const body = req.method !== "GET" ? await req.json() : undefined;

    // Forward the request to the external API
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();

    return new Response(
      JSON.stringify({
        success: responseData.success !== false,
        message: responseData.message || null,
      }),
      {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
}

/**
 * Default route handler for 404s
 */
export function defaultRoute(): Response {
  return new Response("Not found™", { status: 404 });
}
