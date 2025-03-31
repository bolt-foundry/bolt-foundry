import { assert, assertEquals } from "@std/assert";
import { handleDomains } from "apps/web/handlers/domainHandler.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Add a helper function to set up and tear down tests
interface TestSetupOptions {
  mockDomains?: string[];
  mockContents?: Record<string, string>;
  forceDomain?: string | null;
}

function setupTest(options: TestSetupOptions = {}) {
  const originals = {
    env: Deno.env.get,
    readDir: Deno.readDir,
    readTextFile: Deno.readTextFile,
    stat: Deno.stat,
  };

  // Mock environment
  if (options.forceDomain !== undefined) {
    Deno.env.get = (key) => {
      if (key === "FORCE_DOMAIN") return options.forceDomain || undefined;
      if (key === "TEST_ENVIRONMENT") return "true";
      return originals.env(key);
    };
  } else {
    Deno.env.get = (key: string): string | undefined => {
      if (key === "FORCE_DOMAIN") return undefined; // explicitly return undefined instead of null
      if (key === "TEST_ENVIRONMENT") return "true";
      return originals.env(key);
    };
  }

  // Mock readDir
  if (options.mockDomains) {
    Deno.readDir = mockReadDirWithDomains(options.mockDomains);
  }

  // Mock readTextFile
  if (options.mockContents) {
    Deno.readTextFile = mockReadTextFile(options.mockContents);
  }

  return {
    teardown: () => {
      Deno.env.get = originals.env;
      Deno.readDir = originals.readDir;
      Deno.readTextFile = originals.readTextFile;
      Deno.stat = originals.stat;
    },
  };
}

if (Deno.env.get("FORCE_DOMAIN")) {
  logger.warn("FORCE_DOMAIN is set. Tests will probably fail.");
}

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
  const { teardown } = setupTest({
    mockDomains: ["example.com", "test.org"],
  });

  try {
    // Create a request with a domain that doesn't exist in our mock content
    const req = new Request("https://nonexistent.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result, null);
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should handle existing domain", async () => {
  // Arrange
  const mockContent = "# Example.com\nThis is the example.com page content.";
  const { teardown } = setupTest({
    mockDomains: ["example.com", "test.org"],
    mockContents: {
      "example.com": mockContent,
    },
  });

  try {
    // Create a request for example.com domain - using the URL that matches our mock domain
    const req = new Request("https://example.com");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assert(
        text.includes("<!DOCTYPE html>"),
        "Response should contain DOCTYPE",
      );
      assert(
        text.includes('<link rel="stylesheet" href="/_static/base.css">'),
        "Response should contain stylesheet link",
      );
      assert(
        text.includes("<h1>Example.com</h1>"),
        "Response should contain the expected heading",
      );
      assert(
        text.includes("<p>This is the example.com page content.</p>"),
        "Response should contain the expected paragraph",
      );
    }
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should use FORCE_DOMAIN env var if available", async () => {
  // Arrange
  const mockContent =
    "# Forced Domain\nThis is the forced example.com page content.";
  const { teardown } = setupTest({
    mockDomains: ["example.com", "test.org"],
    mockContents: {
      "example.com": mockContent,
    },
    forceDomain: "example.com",
  });

  try {
    // Create a request with any domain (should be overridden by FORCE_DOMAIN)
    const req = new Request("https://some-other-domain.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assert(
        text.includes("<!DOCTYPE html>"),
        "Response should contain DOCTYPE",
      );
      assert(
        text.includes('<link rel="stylesheet" href="/_static/base.css">'),
        "Response should contain stylesheet link",
      );
      assert(
        text.includes("<h1>Forced Domain</h1>"),
        "Response should contain the expected heading",
      );
      assert(
        text.includes("<p>This is the forced example.com page content.</p>"),
        "Response should contain the expected paragraph",
      );
    }
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should handle dynamically discovered domains", async () => {
  // Arrange
  const mockContent = "# Test.org\nDynamically discovered domain content.";
  const { teardown } = setupTest({
    mockDomains: [
      "example.com",
      "test.org",
      "blog", // Not a domain (doesn't contain a dot)
    ],
    mockContents: {
      "test.org": mockContent,
    },
  });

  try {
    // Create a request for dynamically discovered domain
    const req = new Request("https://test.org");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assert(
        text.includes("<!DOCTYPE html>"),
        "Response should contain DOCTYPE",
      );
      assert(
        text.includes('<link rel="stylesheet" href="/_static/base.css">'),
        "Response should contain stylesheet link",
      );
      assert(
        text.includes("<h1>Test.org</h1>"),
        "Response should contain the expected heading",
      );
      assert(
        text.includes("<p>Dynamically discovered domain content.</p>"),
        "Response should contain the expected paragraph",
      );
    }
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should handle non-domain directories", async () => {
  // Arrange
  const { teardown } = setupTest({
    mockDomains: ["blog", "docs", "assets"],
  });

  try {
    // Create a request for a non-domain path
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assertEquals(result, null);
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should handle static files for domain", async () => {
  // Arrange
  const { teardown } = setupTest({
    mockDomains: ["example.com"],
  });

  try {
    // Mock the stat function to simulate the _static directory existing
    Deno.stat = (path: string | URL): Promise<Deno.FileInfo> => {
      const pathString = path instanceof URL ? path.pathname : path.toString();
      if (pathString === "content/example.com") {
        return Promise.resolve({
          isFile: false,
          isDirectory: true,
          isSymlink: false,
          size: 0,
          mtime: null,
          atime: null,
          birthtime: null,
          ctime: null,
          isBlockDevice: false,
          isCharDevice: false,
          isFifo: false,
          isSocket: false,
          dev: 0,
          ino: 0,
          mode: 0,
          nlink: 0,
          uid: 0,
          gid: 0,
          rdev: 0,
          blksize: 0,
          blocks: 0,
        });
      }
      return Promise.reject(new Deno.errors.NotFound());
    };

    // Create a request for a static file under a domain
    const req = new Request("https://example.com/_static/style.css");

    // We shouldn't fully test the serveDir functionality here, but we can check
    // that our handler attempts to serve the file
    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
  } finally {
    teardown();
  }
});
