/**
 * Tests for BFF team command
 */

import { assertEquals } from "packages/team-status-analyzer/deps.ts";
import { teamCommand } from "../team.bff.ts";

Deno.test("team command - shows help correctly", async () => {
  const result = await teamCommand(["--help"]);
  assertEquals(result, 0);
});
