import { assertEquals } from "@std/assert";
import { rebuildCommand } from "../../commands/rebuild.ts";

Deno.test("rebuild command should have correct metadata", () => {
  assertEquals(rebuildCommand.name, "rebuild");
  assertEquals(rebuildCommand.description, "Rebuild the aibff binary");
  assertEquals(typeof rebuildCommand.run, "function");
});

Deno.test("rebuild command should handle --help flag", async () => {
  // Just verify it runs without error when help is requested
  // The actual help output goes through the logger which is harder to test
  await rebuildCommand.run(["--help"]);
  // If we get here without throwing, the test passes
});
