#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

// Manual test for the MCP server
const encoder = new TextEncoder();
const decoder = new TextDecoder();

console.log("Starting MCP server test...");

const process = new Deno.Command(Deno.execPath(), {
  args: [
    "run",
    "--allow-read",
    "--allow-write",
    "--allow-run",
    "apps/denomcp/mod.ts",
  ],
  stdin: "piped",
  stdout: "piped",
  stderr: "piped",
}).spawn();

const writer = process.stdin.getWriter();

// Helper to send request and wait for response
async function sendRequest(request: unknown): Promise<unknown> {
  await writer.write(encoder.encode(JSON.stringify(request) + "\n"));

  const reader = process.stdout.getReader();
  const timeout = 5000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.trim()) {
        try {
          const msg = JSON.parse(line);
          if (msg.id === (request as any).id) {
            reader.releaseLock();
            return msg;
          }
        } catch {
          // Not JSON, skip
        }
      }
    }
  }

  reader.releaseLock();
  throw new Error("Timeout waiting for response");
}

try {
  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 1. Initialize
  console.log("\n1. Sending initialize request...");
  const initResponse = await sendRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  });
  console.log("Initialize response:", JSON.stringify(initResponse, null, 2));

  // 2. Test diagnostics with a file that has errors
  const testFile = "apps/denomcp/test-error.ts";
  await Deno.writeTextFile(
    testFile,
    `
    const x: number = "this is a type error";
    console.log(x);
  `,
  );

  console.log("\n2. Sending diagnostics request...");
  const diagResponse = await sendRequest({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "deno_diagnostics",
      arguments: {
        files: [testFile],
      },
    },
  });
  console.log("Diagnostics response:", JSON.stringify(diagResponse, null, 2));

  // Cleanup
  await Deno.remove(testFile);

  // 3. Test with non-existent file
  console.log("\n3. Testing non-existent file...");
  const errorResponse = await sendRequest({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "deno/diagnostics",
      arguments: {
        files: ["does-not-exist.ts"],
      },
    },
  });
  console.log("Error response:", JSON.stringify(errorResponse, null, 2));
} catch (e) {
  console.error("Test failed:", e);
} finally {
  await writer.close();
  process.kill();
  await process.status;
}

console.log("\nTest complete!");
