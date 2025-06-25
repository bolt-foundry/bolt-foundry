#!/usr/bin/env -S deno test -A

import { assertEquals, assertExists } from "@std/assert";
import { delay } from "@std/async";

Deno.test("aibff gui --dev loads successfully", async () => {
  // Start GUI dev server
  const command = new Deno.Command("aibff", {
    args: ["gui", "--dev", "--port", "3006", "--no-open"],
    stdout: "piped",
    stderr: "piped",
  });

  const process = command.spawn();

  try {
    // Wait for server to be ready
    const maxRetries = 50; // 5 seconds with 100ms delay
    let serverReady = false;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch("http://localhost:3006/health");
        await response.body?.cancel();
        if (response.ok) {
          serverReady = true;
          break;
        }
      } catch {
        // Server not ready yet
      }
      await delay(100);
    }

    assertEquals(serverReady, true, "Server should start successfully");

    // Test that the main page loads
    const pageResponse = await fetch("http://localhost:3006/");
    assertEquals(pageResponse.status, 200);

    const html = await pageResponse.text();

    // Verify basic page structure
    assertExists(html.match(/<div id="root">/), "Should have root div");
    assertExists(html.match(/aibff GUI/), "Should have page title");

    // Test that App.tsx loads without errors
    const appResponse = await fetch("http://localhost:3006/src/App.tsx");
    assertEquals(appResponse.status, 200);

    // Verify BfDsLiteButton import is in the transformed code
    const appCode = await appResponse.text();
    assertExists(
      appCode.match(/BfDsLiteButton/),
      "Should include BfDsLiteButton component",
    );
  } finally {
    // Cleanup
    try {
      process.kill();

      // Close the streams to prevent leaks
      if (process.stdout) {
        await process.stdout.cancel();
      }
      if (process.stderr) {
        await process.stderr.cancel();
      }

      await process.status;
    } catch {
      // Process may have already exited
    }
  }
});
