import type {
  DiagnosticsParams,
  FileDiagnostic,
  MCPRequest,
  MCPResponse,
  MCPToolResult,
} from "./types.ts";
import { LSPClient } from "./lsp-client.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class MCPServer {
  private lspClient: LSPClient;
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();

  constructor() {
    this.lspClient = new LSPClient();
  }

  start(): void {
    // Start reading stdin immediately
    this.readMessages();
  }

  private async readMessages(): Promise<void> {
    const reader = Deno.stdin.readable.getReader();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += this.decoder.decode(value);

      // Try to parse JSON messages (newline-delimited)
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line) as MCPRequest;
            await this.handleRequest(message);
          } catch (e) {
            logger.error("Failed to parse MCP message:", e);
          }
        }
      }
    }
  }

  private async handleRequest(request: MCPRequest): Promise<void> {
    logger.debug(`Handling request: ${request.method}`);
    let response: MCPResponse;

    try {
      switch (request.method) {
        case "initialize": {
          logger.info("Initializing MCP server");
          // Handle MCP initialization
          response = {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {
                  "deno_diagnostics": {
                    description:
                      "Get diagnostics for TypeScript/JavaScript files",
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
                },
              },
              serverInfo: {
                name: "deno-lsp-mcp",
                version: "1.0.0",
              },
            },
          };
          break;
        }

        case "tools/list": {
          logger.info("Listing available tools");
          response = {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              tools: [
                {
                  name: "deno_diagnostics",
                  description:
                    "Get diagnostics for TypeScript/JavaScript files",
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
            },
          };
          break;
        }

        case "tools/call": {
          const toolCall = request.params as {
            name: string;
            arguments: unknown;
          };
          if (toolCall.name === "deno_diagnostics") {
            const result = await this.handleDiagnostics(
              toolCall.arguments as DiagnosticsParams,
            );
            response = {
              jsonrpc: "2.0",
              id: request.id,
              result,
            };
          } else {
            response = {
              jsonrpc: "2.0",
              id: request.id,
              error: {
                code: -32601,
                message: `Unknown tool: ${toolCall.name}`,
              },
            };
          }
          break;
        }

        default:
          response = {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`,
            },
          };
      }
    } catch (e) {
      const error = e as Error;
      response = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: `Internal error: ${error.message}`,
        },
      };
    }

    await this.sendMessage(response);
  }

  private async handleDiagnostics(
    params: DiagnosticsParams,
  ): Promise<MCPToolResult> {
    logger.debug(`Getting diagnostics for ${params.files.length} files`);
    const results: Array<FileDiagnostic> = [];

    for (const file of params.files) {
      try {
        // Convert relative paths to absolute
        const absolutePath = file.startsWith("/")
          ? file
          : `${Deno.cwd()}/${file}`;

        logger.debug(`Processing file: ${file} -> ${absolutePath}`);
        const diagnostics = await this.lspClient.getDiagnostics(absolutePath);
        logger.info(`Got ${diagnostics.length} diagnostics for ${file}`);

        results.push({
          file,
          diagnostics,
        });
      } catch (e) {
        const error = e as Error;
        logger.error(`Error getting diagnostics for ${file}: ${error.message}`);
        results.push({
          file,
          error: error.message,
        });
      }
    }

    // Return in MCP expected format
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ results }, null, 2),
        },
      ],
    };
  }

  private async sendMessage(message: unknown): Promise<void> {
    const json = JSON.stringify(message) + "\n";
    await Deno.stdout.write(this.encoder.encode(json));
  }

  async close(): Promise<void> {
    await this.lspClient.close();
  }
}
