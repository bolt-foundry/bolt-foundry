/**
 * Tests for BFF team command
 */

import { assertEquals } from "../../../../packages/team-status-analyzer/deps.ts";
import { teamCommand } from "../team.bff.ts";

Deno.test("team command - shows help correctly", async () => {
  const result = await teamCommand(["--help"]);
  assertEquals(result, 0);
});

Deno.test("team command - works with authentication", async () => {
  const result = await teamCommand(["--dry-run"]);
  // Should succeed with GitHub CLI authentication available
  assertEquals(result, 0);
});

Deno.test("team command - handles unknown flags gracefully", async () => {
  const result = await teamCommand(["--unknown-flag"]);
  // Should still attempt to run and succeed with authentication
  assertEquals(result, 0);
});
