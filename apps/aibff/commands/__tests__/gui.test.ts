#!/usr/bin/env -S deno test -A

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assert, assertEquals, assertExists } from "@std/assert";
import { delay } from "@std/async";

// Test basic command structure
Deno.test("gui command exists with correct properties", async () => {
  // This will fail until we create the command
  const { guiCommand } = await import("../gui.ts");
  assertExists(guiCommand);
  assertEquals(guiCommand.name, "gui");
  assertEquals(guiCommand.description, "Launch the aibff GUI web interface");
});

Deno.test("gui command starts server and responds to health check", async () => {
  // Helper to start GUI command in subprocess
  function startGuiCommand(
    args: Array<string>,
  ): Deno.ChildProcess {
    // Try to find aibff in PATH or use relative path
    const aibffPath = getConfigurationVariable("GITHUB_WORKSPACE")
      ? `${getConfigurationVariable("GITHUB_WORKSPACE")}/infra/bin/aibff`
      : new URL(import.meta.resolve("../../../../infra/bin/aibff")).pathname;

    const command = new Deno.Command(aibffPath, {
      args: [
        "gui",
        ...args,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    return command.spawn();
  }

  // Helper to wait for server to be ready
  async function waitForServer(
    url: string,
    maxRetries = 30,
    delayMs = 100,
    process?: Deno.ChildProcess,
  ): Promise<void> {
    // Collect stderr output for debugging
    let stderrOutput = "";
    if (process?.stderr) {
      const reader = process.stderr.getReader();
      const decoder = new TextDecoder();
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            stderrOutput += decoder.decode(value);
          }
        } catch {
          // Reader closed
        }
      })();
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        // Consume the body to prevent leaks
        await response.body?.cancel();
        if (response.ok) return;
      } catch {
        // Server not ready yet
      }
      await delay(delayMs);
    }
    throw new Error(
      `Server did not start at ${url} after ${maxRetries} retries. Stderr: ${stderrOutput}`,
    );
  }

  // Start server in test mode on port 3001
  const process = startGuiCommand(["--port", "3001", "--no-open"]);

  try {
    // Wait for server to be ready
    await waitForServer("http://localhost:3001/health", 30, 100, process);

    // Assert health check responds
    const response = await fetch("http://localhost:3001/health");
    assertEquals(response.status, 200);

    const body = await response.json();
    assertEquals(body.status, "OK");
    assert(body.timestamp);
    assert(
      ["production", "development"].includes(body.mode),
      `Expected mode to be "production" or "development", got "${body.mode}"`,
    );
    assertEquals(body.port, 3001);
    assert(body.uptime);
  } finally {
    // Cleanup - ensure process is killed and streams are closed
    try {
      // Kill the process group to ensure bash script and its children are terminated
      process.kill("SIGTERM");

      // Give it a moment to terminate gracefully
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force kill if still running
      try {
        process.kill("SIGKILL");
      } catch {
        // Already terminated
      }

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

Deno.test("gui command --build runs vite build", async () => {
  // Since the build actually works, let's just test that it runs without error
  // and check that the dist directory exists afterward
  const guiPath = new URL("../../gui", import.meta.url).pathname;
  const distPath = `${guiPath}/dist`;

  // Run the build command
  const { guiCommand } = await import("../gui.ts");
  await guiCommand.run(["--build"]);

  // Check that dist directory was created
  const distExists = await Deno.stat(distPath).then(() => true).catch(() =>
    false
  );
  assert(distExists, "dist directory should exist after build");
});

Deno.test("gui command --dev starts vite dev server and proxies requests", async () => {
  // Helper to start GUI command in subprocess
  function startGuiDevCommand(
    args: Array<string>,
  ): Deno.ChildProcess {
    // Try to find aibff in PATH or use relative path
    const aibffPath = getConfigurationVariable("GITHUB_WORKSPACE")
      ? `${getConfigurationVariable("GITHUB_WORKSPACE")}/infra/bin/aibff`
      : new URL(import.meta.resolve("../../../../infra/bin/aibff")).pathname;

    const command = new Deno.Command(aibffPath, {
      args: [
        "gui",
        "--dev",
        ...args,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    return command.spawn();
  }

  // Helper to wait for dev server to be ready
  async function waitForDevServer(
    url: string,
    maxRetries = 50,
    delayMs = 100,
  ): Promise<void> {
    // Do NOT read stderr during wait - it causes resource leaks
    // The --dev server outputs a lot to stderr which can cause timing issues
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        await response.body?.cancel();
        if (response.ok) return;
      } catch {
        // Server not ready yet
      }
      await delay(delayMs);
    }
    throw new Error(
      `Dev server did not start at ${url} after ${maxRetries} retries.`,
    );
  }

  // Start dev server on port 3002
  const process = startGuiDevCommand(["--port", "3002", "--no-open"]);

  try {
    // Wait for server to be ready
    await waitForDevServer("http://localhost:3002/health", 50, 100);

    // Test that health endpoint still works
    const healthResponse = await fetch("http://localhost:3002/health");
    assertEquals(healthResponse.status, 200);
    const healthBody = await healthResponse.json();
    assertEquals(healthBody.status, "OK");
    assert(healthBody.timestamp);
    assertEquals(healthBody.mode, "development");
    assertEquals(healthBody.port, 3002);
    assert(healthBody.uptime);

    // Test that root path proxies to Vite (should return HTML)
    const rootResponse = await fetch("http://localhost:3002/");
    assertEquals(rootResponse.status, 200);
    const contentType = rootResponse.headers.get("content-type");
    assert(
      contentType?.includes("text/html"),
      "Root should return HTML from Vite",
    );
    await rootResponse.body?.cancel();
  } finally {
    // Cleanup - ensure process is killed and streams are closed
    try {
      // Kill the process group to ensure bash script and its children are terminated
      process.kill("SIGTERM");

      // Give it a moment to terminate gracefully
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force kill if still running
      try {
        process.kill("SIGKILL");
      } catch {
        // Already terminated
      }

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
