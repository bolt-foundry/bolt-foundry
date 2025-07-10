#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

// Direct test of LSP client
import { LSPClient } from "./lsp-client.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);
const client = new LSPClient();

try {
  // Create test file
  const testFile = `${Deno.cwd()}/apps/denomcp/test-debug.ts`;
  await Deno.writeTextFile(
    testFile,
    `
const x: number = "this should be an error";
console.log(x);
  `,
  );

  logger.info("Getting diagnostics for:", testFile);
  const diagnostics = await client.getDiagnostics(testFile);

  logger.info("Diagnostics count:", diagnostics.length);
  logger.info("Diagnostics:", JSON.stringify(diagnostics, null, 2));

  // Cleanup
  await Deno.remove(testFile);
} finally {
  await client.close();
}
