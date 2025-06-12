#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

// Test script to send MCP messages to the server

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Start the MCP server
const server = new Deno.Command("deno", {
  args: [
    "run",
    "--allow-read",
    "--allow-write",
    "--allow-run",
    "--allow-env",
    "apps/denomcp/mod.ts",
  ],
  stdin: "piped",
  stdout: "piped",
  stderr: "piped",
}).spawn();

const writer = server.stdin.getWriter();
const reader = server.stdout.getReader();
const errorReader = server.stderr.getReader();

// Read stderr in background
(async () => {
  while (true) {
    const { done, value } = await errorReader.read();
    if (done) break;
    console.error("STDERR:", decoder.decode(value));
  }
})();

// Read responses
async function readResponse(): Promise<string> {
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value);
    const lines = buffer.split("\n");

    // Check if we have a complete JSON line
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          JSON.parse(line);
          return line;
        } catch {
          // Not valid JSON, continue
        }
      }
    }

    // Keep the last incomplete line in buffer
    buffer = lines[lines.length - 1];
  }

  throw new Error("Server closed without response");
}

// Send a message
async function sendMessage(message: any) {
  const json = JSON.stringify(message) + "\n";
  console.log("SENDING:", json);
  await writer.write(encoder.encode(json));
}

try {
  // Test 1: Initialize
  console.log("\n=== Test 1: Initialize ===");
  await sendMessage({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  });

  const initResponse = await readResponse();
  console.log("RESPONSE:", initResponse);

  // Test 2: List tools
  console.log("\n=== Test 2: List Tools ===");
  await sendMessage({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });

  const toolsResponse = await readResponse();
  console.log("RESPONSE:", toolsResponse);

  // Test 3: Call diagnostics tool
  console.log("\n=== Test 3: Call Diagnostics ===");
  await sendMessage({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "deno_diagnostics",
      arguments: {
        files: ["apps/denomcp/test-diagnostics.ts"],
      },
    },
  });

  const diagnosticsResponse = await readResponse();
  console.log("RESPONSE:", diagnosticsResponse);
} catch (e) {
  console.error("ERROR:", e);
} finally {
  // Close the server
  try {
    await writer.close();
  } catch {}

  server.kill();
  await server.status;
}
