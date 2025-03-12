import { assertEquals } from "@std/assert";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";

// Mock Deno.env
const originalEnv = Deno.env.get;

// Mock Deno.readDir
const originalReadDir = Deno.readDir;

function mockReadDirWithDomains(domainNames: string[]) {
  return () => {
    const mockEntries = domainNames.map(name => ({
      name,
      isDirectory: true,
      isFile: false,
      isSymlink: false,
    }));

    return (async function* () {
      for (const entry of mockEntries) {
        yield entry;
      }
    })();
  };
}

Deno.test("handleDomains - should return null for non-existent domain", async () => {
  // Arrange
  try {
    // Override Deno.readDir to return example domains
    Deno.readDir = mockReadDirWithDomains(["example.com", "test.org"]);

    // Create a request with a domain that doesn't exist in our mock content
    const req = new Request("https://nonexistent.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result, null);
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle existing domain", async () => {
  // Arrange
  try {
    // Override Deno.readDir to return example domains
    Deno.readDir = mockReadDirWithDomains(["example.com", "test.org"]);

    // Create a request for example.com domain
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "example.com");
    }
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should use FORCE_DOMAIN env var if available", async () => {
  // Arrange
  try {
    // Mock env var
    Deno.env.get = (key) => key === "FORCE_DOMAIN" ? "example.com" : originalEnv(key);

    // Override Deno.readDir to return example domains
    Deno.readDir = mockReadDirWithDomains(["example.com", "test.org"]);

    // Create a request with any domain (should be overridden by FORCE_DOMAIN)
    const req = new Request("https://some-other-domain.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "example.com");
    }
  } finally {
    // Restore original environment and Deno.readDir
    Deno.env.get = originalEnv;
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle dynamically discovered domains", async () => {
  // Arrange
  try {
    // Override Deno.readDir to return domain-like directories
    Deno.readDir = mockReadDirWithDomains([
      "example.com", 
      "test.org", 
      "blog" // Not a domain (doesn't contain a dot)
    ]);

    // Create a request for dynamically discovered domain
    const req = new Request("https://test.org/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result instanceof Response, true);
    if (result) {
      const text = await result.text();
      assertEquals(text, "test.org");
    }
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});

Deno.test("handleDomains - should handle non-domain directories", async () => {
  // Arrange
  try {
    // Override Deno.readDir to only include non-domain directories
    Deno.readDir = mockReadDirWithDomains(["blog", "docs", "assets"]);

    // Create a request for a non-domain path
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result, null);
  } finally {
    // Restore original Deno.readDir
    Deno.readDir = originalReadDir;
  }
});