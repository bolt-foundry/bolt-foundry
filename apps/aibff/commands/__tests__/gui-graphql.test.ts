#!/usr/bin/env -S deno test -A

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { assertEquals, assertExists } from "@std/assert";
import { delay } from "@std/async";

Deno.test(
  "gui command serves GraphQL endpoint with hello query",
  {},
  async () => {
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

    // Start server in test mode on port 3003
    const process = startGuiCommand(["--port", "3003", "--no-open"]);

    try {
      // Wait for server to be ready
      await waitForServer("http://localhost:3003/health", 30, 100, process);

      // Test GraphQL endpoint exists
      const response = await fetch("http://localhost:3003/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query {
            hello
          }
        `,
        }),
      });

      assertEquals(response.status, 200);
      const contentType = response.headers.get("content-type");
      assertExists(contentType);
      assertEquals(contentType?.startsWith("application/json"), true);

      const result = await response.json();
      assertEquals(result.data.hello, "Hello from aibff GUI!");
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
  },
);

Deno.test(
  "gui command --dev mode serves GraphiQL interface",
  async () => {
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
          await response.body?.cancel();
          if (response.ok) return;
        } catch {
          // Server not ready yet
        }
        await delay(delayMs);
      }
      throw new Error(
        `Dev server did not start at ${url} after ${maxRetries} retries. Stderr: ${stderrOutput}`,
      );
    }

    // Start dev server on port 3004
    const process = startGuiDevCommand(["--port", "3004", "--no-open"]);

    try {
      // Wait for server to be ready
      await waitForDevServer("http://localhost:3004/health", 50, 100, process);

      // Test that GraphiQL is available in dev mode
      const response = await fetch("http://localhost:3004/graphql", {
        method: "GET",
        headers: {
          "Accept": "text/html",
        },
      });

      assertEquals(response.status, 200);
      const contentType = response.headers.get("content-type");
      assertExists(contentType);
      // GraphiQL should return HTML
      assertEquals(contentType?.includes("text/html"), true);

      await response.body?.cancel();
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
  },
);
