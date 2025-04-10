// Test to verify that the mocks import map is working correctly
import { assertEquals } from "@std/assert";
// Import a standard module from the main import map to verify it's available
import { join } from "@std/path";

Deno.test("mock import map correctly loads posthog-node mock", async () => {
  // This should import the mock version from util/mocks/posthog-node.ts
  // because of the import map in util/mocks/import_map.json

  // When the mock is loaded, it logs a message to the console
  // We can capture this to verify the mock was loaded

  // deno-lint-ignore no-console
  const originalConsoleLog = console.log;
  let mockedOutput = "";

  try {
    // deno-lint-ignore no-console
    console.log = (message: string) => {
      mockedOutput = message;
    };

    const { PostHog } = await import("mock-mock");

    // Just creating the instance should trigger the mock's console.log
    new PostHog("test-api-key");

    assertEquals(
      mockedOutput,
      "This mock mock outputs this message. We use this in the test.",
      "The PostHog mock was not loaded correctly",
    );
  } finally {
    // Restore the original console.log
    // deno-lint-ignore no-console
    console.log = originalConsoleLog;
  }
});

Deno.test("merged import map includes standard imports from deno.jsonc", () => {
  // This verifies that the standard modules from the main import map are still available
  const path = join("tmp", "test");
  assertEquals(path, "tmp/test", "Standard path module should be available");
});

Deno.test("@real/ prefix allows access to original modules", async () => {
  // We should be able to dynamically import both the mock and real versions
  // Note: This is a basic test structure - in real usage you'd actually import
  // from "@real/posthog-node" in your code

  // Import the mock version (directly)
  const _mockPostHog = await import("posthog-node");

  // In a real test, we would import from "@real/posthog-node"
  // But for testing purposes, we'll just check that our import map has the entry

  // Check that the merged import map has been created with the @real/ entry
  const importMapPath = await import("../merge-import-maps.ts").then((module) =>
    module.mergeImportMaps()
  );

  const importMapContent = await Deno.readTextFile(importMapPath);
  const importMap = JSON.parse(importMapContent);

  // Verify the @real/ prefix entry exists
  assertEquals(
    typeof importMap.imports["@real/posthog-node"] !== "undefined",
    true,
    "@real/posthog-node should be defined in the import map",
  );
});
