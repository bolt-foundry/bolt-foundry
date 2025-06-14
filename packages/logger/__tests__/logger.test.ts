import { assertEquals } from "@std/assert";
import { getLogger } from "../logger.ts";

Deno.test("Logger has println and printErr methods", () => {
  const logger = getLogger(import.meta);
  assertEquals(typeof logger.println, "function");
  assertEquals(typeof logger.printErr, "function");
});

Deno.test("Logger println and printErr work correctly", () => {
  const logger = getLogger(import.meta);

  // Test that methods don't throw
  logger.println("Test message");
  logger.printErr("Error message");
  logger.println("Colored message", true);
  logger.printErr("Colored error", true);

  // If we got here without throwing, the test passes
  assertEquals(true, true);
});

Deno.test("Logger still works as a regular logger", () => {
  const logger = getLogger(import.meta);

  // Test that standard log methods still exist
  assertEquals(typeof logger.info, "function");
  assertEquals(typeof logger.error, "function");
  assertEquals(typeof logger.warn, "function");
  assertEquals(typeof logger.debug, "function");
});
