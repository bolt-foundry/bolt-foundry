import { assertEquals } from "@std/assert";

Deno.test("RLHF Testing page loads", async () => {
  const response = await fetch("http://localhost:3000/rlhf-test");

  assertEquals(response.status, 200);

  const html = await response.text();

  // Check that the page contains expected content
  assertEquals(html.includes("RLHF Testing"), true);
  assertEquals(html.includes("Organization:"), true);
  assertEquals(html.includes("Decks"), true);
});
