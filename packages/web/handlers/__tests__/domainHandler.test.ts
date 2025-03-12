import { assert, assertEquals } from "@std/assert";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

if (Deno.env.get("FORCE_DOMAIN")) {
  logger.warn("FORCE_DOMAIN is set. Tests will probably fail.");
}
// Mock Deno.env
const originalEnv = Deno.env.get;

// Mock Deno.readDir
const originalReadDir = Deno.readDir;

// Mock Deno.readTextFile
const originalReadTextFile = Deno.readTextFile;

function mockReadDirWithDomains(domainNames: string[]) {
  return () => {
    const mockEntries = domainNames.map((name) => ({
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

// Mock content file reading
function mockReadTextFile(mockContents: Record<string, string>) {
  return (path: string | URL): Promise<string> => {
    logger.debug(`Reading ${path}`);
    // Convert path to a string if it's a URL
    const pathString = path instanceof URL ? path.pathname : path.toString();

    // Check if we have mock content for this path
    for (const [domainName, content] of Object.entries(mockContents)) {
      if (
        pathString.includes(`${domainName}/page.md`) ||
        pathString.includes(`content/${domainName}/page.md`)
      ) {
        logger.info(`Found mock content for ${pathString}`, content);
        return Promise.resolve(content);
      }
    }

    throw new Error(`File not found: ${pathString}`);
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

    // Mock readTextFile to return content for the domain's page.md
    Deno.readTextFile = mockReadTextFile({
      "example.com": "# Example.com\nThis is the example.com page content.",
    });

    // Create a request for example.com domain
    const req = new Request("https://example.com");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assertEquals(
        text,
        "<h1>Example.com</h1>\n<p>This is the example.com page content.</p>",
      );
    }
  } finally {
    // Restore original functions
    Deno.readDir = originalReadDir;
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("handleDomains - should use FORCE_DOMAIN env var if available", async () => {
  // Arrange
  try {
    // Mock env var
    Deno.env.get = (key) =>
      key === "FORCE_DOMAIN" ? "example.com" : originalEnv(key);

    // Override Deno.readDir to return example domains
    Deno.readDir = mockReadDirWithDomains(["example.com", "test.org"]);

    // Mock readTextFile to return content for the forced domain's page.md
    Deno.readTextFile = mockReadTextFile({
      "example.com":
        "# Forced Domain\nThis is the forced example.com page content.",
    });

    // Create a request with any domain (should be overridden by FORCE_DOMAIN)
    const req = new Request("https://some-other-domain.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assertEquals(
        text,
        "<h1>Forced Domain</h1>\n<p>This is the forced example.com page content.</p>",
      );
    }
  } finally {
    // Restore original environment and functions
    Deno.env.get = originalEnv;
    Deno.readDir = originalReadDir;
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("handleDomains - should handle dynamically discovered domains", async () => {
  // Arrange
  try {
    // Override Deno.readDir to return domain-like directories
    Deno.readDir = mockReadDirWithDomains([
      "example.com",
      "test.org",
      "blog", // Not a domain (doesn't contain a dot)
    ]);

    // Mock readTextFile to return content for the domain's page.md
    Deno.readTextFile = mockReadTextFile({
      "test.org": "# Test.org\nDynamically discovered domain content.",
    });

    // Create a request for dynamically discovered domain
    const req = new Request("https://test.org");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assertEquals(
        text,
        "<h1>Test.org</h1>\n<p>Dynamically discovered domain content.</p>",
      );
    }
  } finally {
    // Restore original functions
    Deno.readDir = originalReadDir;
    Deno.readTextFile = originalReadTextFile;
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
