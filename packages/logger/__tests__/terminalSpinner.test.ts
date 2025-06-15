import { assertEquals } from "@std/assert";
import { startSpinner } from "../logger.ts";

Deno.test("startSpinner is exported from logger module", () => {
  assertEquals(typeof startSpinner, "function");
});

Deno.test("startSpinner returns a stop function", () => {
  const stop = startSpinner();
  assertEquals(typeof stop, "function");
  stop(); // Clean up
});

Deno.test("startSpinner accepts single message", () => {
  const stop = startSpinner("Loading data...");
  assertEquals(typeof stop, "function");
  stop(); // Clean up
});

Deno.test("startSpinner accepts array of messages", () => {
  const messages = [
    "Collecting dependencies...",
    "Analyzing code...",
    "Building project...",
  ];
  const stop = startSpinner(messages);
  assertEquals(typeof stop, "function");
  stop(); // Clean up
});
