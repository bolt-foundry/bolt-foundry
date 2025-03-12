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

Deno.test("handleDomains - should handle example domain", async () => {
  // Arrange
  const routes = new Map<string, Handler>();
  routes.set("/example.com", () => new Response("example.com route"));

  // Mock the Deno.readDir to include example.com
  const originalReadDir = Deno.readDir;

  try {
    // Mock implementation that returns domain-like directories
    Deno.readDir = () => {
      const mockEntries = [
        {
          name: "example.com",
          isDirectory: true,
          isFile: false,
          isSymlink: false,
        },
      ];
      return (async function* () {
        for (const entry of mockEntries) {
          yield entry;
        }
      })();
    };

    // Create a request for example.com domain
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req, routes);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "example.com route");
    }
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle domain via SERVE_PROJECT env var", async () => {
  // Arrange
  const originalEnv = Deno.env.get("SERVE_PROJECT");
  const originalReadDir = Deno.readDir;

  try {
    // Set SERVE_PROJECT to example.com
    Deno.env.set("SERVE_PROJECT", "example.com");

    // Mock implementation that returns domain-like directories
    Deno.readDir = () => {
      const mockEntries = [
        {
          name: "example.com",
          isDirectory: true,
          isFile: false,
          isSymlink: false,
        },
      ];
      return (async function* () {
        for (const entry of mockEntries) {
          yield entry;
        }
      })();
    };

    const routes = new Map<string, Handler>();
    routes.set("/example.com", () => new Response("example.com route"));

    // Create a request with any domain (should be overridden by SERVE_PROJECT)
    const req = new Request("https://some-other-domain.com/some-path");

    // Act
    const result = await handleDomains(req, routes);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "example.com route");
    }
  } finally {
    // Restore original environment and Deno.readDir
    if (originalEnv) {
      Deno.env.set("SERVE_PROJECT", originalEnv);
    } else {
      Deno.env.delete("SERVE_PROJECT");
    }
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle 404 for domain with no matching route", async () => {
  // Arrange
  const routes = new Map<string, Handler>();
  // Intentionally not adding the /example.com route handler

  // Mock the Deno.readDir to include example.com
  const originalReadDir = Deno.readDir;

  try {
    // Mock implementation that returns domain-like directories
    Deno.readDir = () => {
      const mockEntries = [
        {
          name: "example.com",
          isDirectory: true,
          isFile: false,
          isSymlink: false,
        },
      ];
      return (async function* () {
        for (const entry of mockEntries) {
          yield entry;
        }
      })();
    };

    // Create a request for example.com domain
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req, routes);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      assertEquals(result.status, 404);
      const text = await result.text();
      assertEquals(text, "Not found™");
    }
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle dynamically discovered domains", async () => {
  // Mock the Deno.readDir to simulate content directories
  const originalReadDir = Deno.readDir;

  try {
    // Mock implementation that returns domain-like directories
    Deno.readDir = () => {
      const mockEntries = [
        {
          name: "example.com",
          isDirectory: true,
          isFile: false,
          isSymlink: false,
        },
        {
          name: "test.org",
          isDirectory: true,
          isFile: false,
          isSymlink: false,
        },
        { name: "blog", isDirectory: true, isFile: false, isSymlink: false }, // Not a domain
      ];
      return (async function* () {
        for (const entry of mockEntries) {
          yield entry;
        }
      })();
    };

    // Arrange
    const routes = new Map<string, Handler>();
    routes.set("/example.com", () => new Response("example.com route"));

    // Create a request for dynamically discovered domain
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req, routes);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "example.com route");
    }
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});
