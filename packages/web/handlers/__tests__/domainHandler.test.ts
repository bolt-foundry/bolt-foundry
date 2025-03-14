import { assert, assertEquals } from "@std/assert";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

// Add a helper function to set up and tear down tests
interface TestSetupOptions {
  mockDomains?: string[];
  mockContents?: Record<string, string>;
  forceDomain?: string | null;
  mockSocketPaths?: string[];
}

function setupTest(options: TestSetupOptions = {}) {
  const originals = {
    env: Deno.env.get,
    readDir: Deno.readDir,
    readTextFile: Deno.readTextFile,
    stat: Deno.stat,
    connect: Deno.connect,
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

  // Mock stat for socket paths
  if (options.mockSocketPaths) {
    Deno.stat = (path: string | URL): Promise<Deno.FileInfo> => {
      const pathString = path instanceof URL ? path.pathname : path.toString();
      
      // Check if this is a socket path we want to mock
      if (options.mockSocketPaths?.some(socketPath => pathString.includes(socketPath))) {
        return Promise.resolve({
          isFile: false,
          isDirectory: false,
          isSymlink: false,
          size: 0,
          mtime: null,
          atime: null,
          birthtime: null,
          ctime: null,
          isBlockDevice: false,
          isCharDevice: false,
          isFifo: false,
          isSocket: true, // This is a socket
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
      
      // Check if this is for a static directory
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
  }

  // Mock connect for Unix socket
  Deno.connect = ({ path, transport }: { path: string, transport: "tcp" | "unix" }) => {
    if (transport === "unix" && options.mockSocketPaths?.some(socketPath => path.includes(socketPath))) {
      // Create a mock connection object
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const mockConnection = {
        rid: 1,
        read: (buffer: Uint8Array): Promise<number | null> => {
          // Mock HTTP response
          const response = [
            "HTTP/1.1 200 OK",
            "Content-Type: text/html",
            "Content-Length: 52",
            "",
            "<html><body>Hello from domain-specific socket!</body></html>",
          ].join("\r\n");
          
          const bytes = encoder.encode(response);
          buffer.set(bytes.subarray(0, Math.min(buffer.length, bytes.length)));
          return Promise.resolve(Math.min(buffer.length, bytes.length));
        },
        write: (data: Uint8Array): Promise<number> => {
          // Log the request for debugging
          logger.debug("Mock socket received request:", decoder.decode(data));
          return Promise.resolve(data.length);
        },
        close: () => {},
      };
      
      return Promise.resolve(mockConnection as unknown as Deno.Conn);
    }
    
    return Promise.reject(new Error("Mock connection not supported for this path"));
  };

  return {
    teardown: () => {
      Deno.env.get = originals.env;
      Deno.readDir = originals.readDir;
      Deno.readTextFile = originals.readTextFile;
      Deno.stat = originals.stat;
      Deno.connect = originals.connect;
    },
  };
}

function mockReadDirWithDomains(mockDomains: string[]) {
  return (path: string): AsyncIterable<Deno.DirEntry> => {
    logger.debug(`Reading directory ${path}`);
    
    const entries: Deno.DirEntry[] = mockDomains.map((domainName) => ({
      name: domainName,
      isFile: false,
      isDirectory: true,
      isSymlink: false,
    }));
    
    return {
      [Symbol.asyncIterator]() {
        let index = 0;
        return {
          async next() {
            if (index < entries.length) {
              return { value: entries[index++], done: false };
            } else {
              return { value: undefined, done: true };
            }
          },
        };
      },
    };
  };
}

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

Deno.test("handleDomains - should handle domain-specific socket", async () => {
  // Arrange
  const { teardown } = setupTest({
    mockDomains: ["example.com"],
    mockSocketPaths: ["contentFoundry.cfsock"],
  });

  try {
    // Create a request for a domain that has a socket
    const req = new Request("https://example.com/some-path");

    // Act
    const result = await handleDomains(req);

    // Assert
    assert(result instanceof Response, `Expected Response, got ${result}`);
    if (result) {
      const text = await result.text();
      assert(
        text.includes("<html><body>Hello from domain-specific socket!</body></html>"),
        "Response should contain content from socket",
      );
    }
  } finally {
    teardown();
  }
});

Deno.test("handleDomains - should handle FORCE_DOMAIN with socket", async () => {
  // Arrange
  const { teardown } = setupTest({
    mockDomains: ["example.com", "test.org"],
    mockSocketPaths: ["contentFoundry.cfsock"],
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
        text.includes("<html><body>Hello from domain-specific socket!</body></html>"),
        "Response should contain content from socket",
      );
    }
  } finally {
    teardown();
  }
});

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

if (Deno.env.get("FORCE_DOMAIN")) {
  logger.warn("FORCE_DOMAIN is set. Tests will probably fail.");
}
