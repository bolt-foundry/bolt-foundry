import { assert, assertEquals, assertExists } from "@std/assert";
import { dirname, join } from "@std/path";
import type { exists } from "@std/fs";
import type * as esbuild from "esbuild";
import type { parse } from "@std/jsonc";

// Import functions to test
import {
  generatePackageJson,
  loadDenoJsonc,
  processImports,
  type validatePackageImports,
} from "../packageBuild.ts";

// Setup test directory
const TEST_FIXTURES_DIR = join(dirname(import.meta.url), "fixtures");

// Mock functions and data
const mockDenoJsonc = {
  name: "@bolt-foundry/test-package",
  version: "0.1.0",
  imports: {
    "posthog-node": "npm:posthog-node@^4.11.2",
    "@bolt-foundry/logger": "jsr:@bolt-foundry/logger@^0.0.0-dev.0",
  },
  exports: {
    "./test-package.ts": "./test-package.ts",
  },
};

Deno.test("packageBuild - loadDenoJsonc parses JSONC files", async () => {
  // Mock the filesystem functions
  const originalReadTextFile = Deno.readTextFile;

  try {
    // Override readTextFile to return our mock data
    Deno.readTextFile = async () => {
      return JSON.stringify(mockDenoJsonc, null, 2);
    };

    const result = await loadDenoJsonc("fake/path");
    assertExists(result);
    assertEquals(result.name, "@bolt-foundry/test-package");
    assertEquals(result.version, "0.1.0");
    assertExists(result.imports);
    assertEquals(Object.keys(result.imports).length, 2);
  } finally {
    // Restore original function
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("packageBuild - loadDenoJsonc handles parsing errors", async () => {
  // Mock the filesystem functions
  const originalReadTextFile = Deno.readTextFile;

  try {
    // Override readTextFile to return invalid JSON
    Deno.readTextFile = async () => {
      return "{invalid json";
    };

    const result = await loadDenoJsonc("fake/path");
    assertEquals(result, null);
  } finally {
    // Restore original function
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("packageBuild - processImports handles JSR dependencies", () => {
  const imports = {
    "@bolt-foundry/logger": "jsr:@bolt-foundry/logger@^0.1.0",
    "external-package": "jsr:external/package@^2.0.0",
    "npm-package": "npm:some-package@^1.0.0",
  };

  const dependencies = processImports(imports);

  // Check bolt-foundry package is correctly formatted
  assertEquals(
    dependencies["@bolt-foundry/logger"],
    "npm:@jsr/bolt-foundry__logger@^0.1.0",
  );

  // Check external JSR package is correctly formatted
  assertEquals(
    dependencies["external-package"],
    "npm:@jsr/external__package@^2.0.0",
  );

  // Check npm package is correctly handled
  assertEquals(dependencies["npm-package"], "^1.0.0");
});

Deno.test("packageBuild - generatePackageJson creates correct package.json structure", async () => {
  const originalMkdir = Deno.mkdir;
  const originalWriteTextFile = Deno.writeTextFile;
  const originalReadTextFile = Deno.readTextFile;

  let writtenContent = "";
  let writtenPath = "";
  const writtenFiles: Record<string, string> = {};

  try {
    // Mock filesystem functions
    Deno.mkdir = () => {};
    Deno.writeTextFile = (path, content) => {
      writtenPath = path;
      writtenContent = content;
      writtenFiles[path] = content;
      return Promise.resolve();
    };
    Deno.readTextFile = async () => {
      return JSON.stringify(mockDenoJsonc, null, 2);
    };

    await generatePackageJson("packages/test-package/test-package.ts", {
      skipNpmrc: true,
    });

    // Check that package.json was written
    assert(
      writtenPath.endsWith("package.json"),
      `Expected package.json, got ${writtenPath}`,
    );

    // Parse the written content
    const packageJson = JSON.parse(writtenContent);
    assertEquals(packageJson.name, "@bolt-foundry/test-package");
    assertEquals(packageJson.version, "0.1.0");
    assertExists(packageJson.dependencies);
    assertExists(packageJson.dependencies["@bolt-foundry/logger"]);
    assertEquals(
      packageJson.dependencies["@bolt-foundry/logger"],
      "npm:@jsr/bolt-foundry__logger@^0.0.0-dev.0",
    );
  } finally {
    // Restore original functions
    Deno.mkdir = originalMkdir;
    Deno.writeTextFile = originalWriteTextFile;
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("packageBuild - generatePackageJson creates .npmrc file by default", async () => {
  const originalMkdir = Deno.mkdir;
  const originalWriteTextFile = Deno.writeTextFile;
  const originalReadTextFile = Deno.readTextFile;

  const writtenFiles: Record<string, string> = {};

  try {
    // Mock filesystem functions
    Deno.mkdir = async () => {};
    Deno.writeTextFile = async (path, content) => {
      writtenFiles[path] = content;
    };
    Deno.readTextFile = async () => {
      return JSON.stringify(mockDenoJsonc, null, 2);
    };

    await generatePackageJson("packages/test-package/test-package.ts");

    // Check that .npmrc was created
    const npmrcPath = Object.keys(writtenFiles).find((path) =>
      path.endsWith(".npmrc")
    );
    assertExists(npmrcPath, ".npmrc should be created by default");
    assertEquals(writtenFiles[npmrcPath!], "@jsr:registry=https://npm.jsr.io");
  } finally {
    // Restore original functions
    Deno.mkdir = originalMkdir;
    Deno.writeTextFile = originalWriteTextFile;
    Deno.readTextFile = originalReadTextFile;
  }
});

Deno.test("packageBuild - generatePackageJson with skipNpmrc option", async () => {
  const originalMkdir = Deno.mkdir;
  const originalWriteTextFile = Deno.writeTextFile;
  const originalReadTextFile = Deno.readTextFile;

  const writtenFiles: Record<string, string> = {};

  try {
    // Mock filesystem functions
    Deno.mkdir = async () => {};
    Deno.writeTextFile = async (path, content) => {
      writtenFiles[path] = content;
    };
    Deno.readTextFile = async () => {
      return JSON.stringify(mockDenoJsonc, null, 2);
    };

    // Test with skipNpmrc option
    await generatePackageJson("packages/test-package/test-package.ts", {
      skipNpmrc: true,
    });

    // Check that package.json was written
    const packageJsonPath = Object.keys(writtenFiles).find((path) =>
      path.endsWith("package.json")
    );
    assertExists(packageJsonPath, "package.json should be created");

    // Check that .npmrc was NOT created
    const npmrcPath = Object.keys(writtenFiles).find((path) =>
      path.endsWith(".npmrc")
    );
    assertEquals(
      npmrcPath,
      undefined,
      ".npmrc should not be created when skipNpmrc is true",
    );
  } finally {
    // Restore original functions
    Deno.mkdir = originalMkdir;
    Deno.writeTextFile = originalWriteTextFile;
    Deno.readTextFile = originalReadTextFile;
  }
});
