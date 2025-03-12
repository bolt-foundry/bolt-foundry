import { assertEquals } from "@std/assert";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";
import type { Handler } from "packages/web/web.tsx";

Deno.test("handleDomains - should return null for non-domain-specific routes", async () => {
  // Arrange
  const routes = new Map<string, Handler>();
  routes.set("/biglittletech.ai", () => new Response("biglittletech.ai route"));
  
  // Create a request with random domain
  const req = new Request("https://example.com/some-path");
  
  // Act
  const result = await handleDomains(req, routes);
  
  // Assert
  assertEquals(result, null);
});

Deno.test("handleDomains - should handle biglittletech.ai domain", async () => {
  // Arrange
  const routes = new Map<string, Handler>();
  routes.set("/biglittletech.ai", () => new Response("biglittletech.ai route"));
  
  // Create a request for biglittletech.ai domain
  const req = new Request("https://biglittletech.ai/some-path");
  
  // Act
  const result = await handleDomains(req, routes);
  
  // Assert
  assertEquals(result instanceof Response, true);
  if (result) {
    const text = await result.text();
    assertEquals(text, "biglittletech.ai route");
  }
});

Deno.test("handleDomains - should handle domain via SERVE_PROJECT env var", async () => {
  // Arrange
  const originalEnv = Deno.env.get("SERVE_PROJECT");
  
  try {
    // Set SERVE_PROJECT to biglittletech.ai
    Deno.env.set("SERVE_PROJECT", "biglittletech.ai");
    
    const routes = new Map<string, Handler>();
    routes.set("/biglittletech.ai", () => new Response("biglittletech.ai route"));
    
    // Create a request with any domain (should be overridden by SERVE_PROJECT)
    const req = new Request("https://example.com/some-path");
    
    // Act
    const result = await handleDomains(req, routes);
    
    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "biglittletech.ai route");
    }
  } finally {
    // Restore original environment
    if (originalEnv) {
      Deno.env.set("SERVE_PROJECT", originalEnv);
    } else {
      Deno.env.delete("SERVE_PROJECT");
    }
  }
});

Deno.test("handleDomains - should handle 404 for domain with no matching route", async () => {
  // Arrange
  const routes = new Map<string, Handler>();
  // Intentionally not adding the /biglittletech.ai route handler
  
  // Create a request for biglittletech.ai domain
  const req = new Request("https://biglittletech.ai/some-path");
  
  // Act
  const result = await handleDomains(req, routes);
  
  // Assert
  assertEquals(result instanceof Response, true);
  if (result) {
    assertEquals(result.status, 404);
    const text = await result.text();
    assertEquals(text, "Not found™");
  }
});
