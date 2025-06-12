#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

import { Server } from "npm:@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "npm:@modelcontextprotocol/sdk/types.js";
import { LSPClient } from "./lsp-client.ts";
// import { getLogger } from "packages/logger/logger.ts";

// const logger = getLogger(import.meta);

// Create server instance
const server = new Server(
  {
    name: "deno-lsp-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Initialize LSP client
const lspClient = new LSPClient();

// Tool: deno_diagnostics
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "deno_diagnostics",
        description: "Get diagnostics for TypeScript/JavaScript files",
        inputSchema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: { type: "string" },
              description: "Array of file paths to check",
            },
          },
          required: ["files"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "deno_diagnostics") {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}`,
    );
  }

  const args = request.params.arguments as { files: Array<string> };

  if (!args.files || !Array.isArray(args.files)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      "files parameter must be an array of strings",
    );
  }

  // logger.debug(`Getting diagnostics for ${args.files.length} files`);

  const results: Array<{
    file: string;
    diagnostics?: Array<{
      range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
      };
      severity: number;
      code?: string | number;
      source?: string;
      message: string;
    }>;
    error?: string;
  }> = [];

  for (const file of args.files) {
    try {
      // Convert relative paths to absolute
      const absolutePath = file.startsWith("/")
        ? file
        : `${Deno.cwd()}/${file}`;

      // Check if file exists
      try {
        await Deno.stat(absolutePath);
      } catch {
        results.push({
          file,
          error: "File not found",
        });
        continue;
      }

      // Read file content
      const content = await Deno.readTextFile(absolutePath);

      // Ensure LSP is initialized
      if (!await lspClient.ensureInitialized()) {
        throw new Error("Failed to initialize LSP");
      }

      // Open document in LSP
      await lspClient.openDocument(absolutePath, content);

      // Get diagnostics
      const diagnostics = await lspClient.getDiagnostics(absolutePath);

      results.push({
        file,
        diagnostics,
      });

      // Close document
      await lspClient.closeDocument(absolutePath);
    } catch (error) {
      // logger.error(`Failed to get diagnostics for ${file}:`, error);
      results.push({
        file,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ results }, null, 2),
      },
    ],
  };
});

// Handle graceful shutdown
async function shutdown() {
  await lspClient.stop();
  Deno.exit(0);
}

Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // logger.info("MCP server started");
}

main().catch((error) => {
  // logger.error("Failed to start MCP server:", error);
  Deno.exit(1);
});
