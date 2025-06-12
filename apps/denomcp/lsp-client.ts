import type {
  Diagnostic,
  DidOpenTextDocumentParams,
  InitializeParams,
  LSPMessage,
  PublishDiagnosticsParams,
} from "./types.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class LSPClient {
  private process: Deno.ChildProcess;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private messageId = 0;
  private pendingRequests = new Map<number, {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }>();
  private diagnosticsMap = new Map<string, Array<Diagnostic>>();
  private initialized = false;
  private initPromise: Promise<void>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;

  constructor() {
    this.process = new Deno.Command("deno", {
      args: ["lsp"],
      stdin: "piped",
      stdout: "piped",
      stderr: "null",
    }).spawn();

    this.writer = this.process.stdin.getWriter();
    this.initPromise = this.initialize();
    this.startReading();
  }

  private async initialize(): Promise<void> {
    const initParams: InitializeParams = {
      processId: Deno.pid,
      rootUri: `file://${Deno.cwd()}`,
      capabilities: {
        textDocument: {
          publishDiagnostics: {
            relatedInformation: true,
            versionSupport: false,
            codeDescriptionSupport: true,
            dataSupport: true,
          },
          synchronization: {
            didOpen: true,
            didClose: true,
          },
        },
        workspace: {
          configuration: true,
        },
      },
    };

    const initResult = await this.sendRequest("initialize", initParams);
    logger.debug("LSP initialized:", JSON.stringify(initResult, null, 2));

    await this.sendNotification("initialized", {});
    this.initialized = true;
  }

  private async startReading(): Promise<void> {
    const reader = this.process.stdout.getReader();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += this.decoder.decode(value);

      // Parse LSP messages (header + content)
      while (true) {
        const headerEnd = buffer.indexOf("\r\n\r\n");
        if (headerEnd === -1) break;

        const header = buffer.slice(0, headerEnd);
        const contentLengthMatch = header.match(/Content-Length: (\d+)/);
        if (!contentLengthMatch) {
          buffer = buffer.slice(headerEnd + 4);
          continue;
        }

        const contentLength = parseInt(contentLengthMatch[1]);
        const contentStart = headerEnd + 4;

        if (buffer.length < contentStart + contentLength) break;

        const content = buffer.slice(
          contentStart,
          contentStart + contentLength,
        );
        buffer = buffer.slice(contentStart + contentLength);

        try {
          const message = JSON.parse(content) as LSPMessage;
          this.handleMessage(message);
        } catch (e) {
          logger.error("Failed to parse LSP message:", e);
        }
      }
    }
  }

  private handleMessage(message: LSPMessage): void {
    // Debug log
    if (message.method) {
      logger.debug("LSP notification:", message.method);
    }

    // Handle responses to our requests
    if (message.id !== undefined && message.method === undefined) {
      const pending = this.pendingRequests.get(message.id as number);
      if (pending) {
        this.pendingRequests.delete(message.id as number);
        if (message.error) {
          pending.reject(message.error);
        } else {
          pending.resolve(message.result);
        }
      }
    }

    // Handle server requests that need responses
    if (message.id !== undefined && message.method !== undefined) {
      this.handleServerRequest(message);
    }

    // Handle notifications from server
    if (message.method === "textDocument/publishDiagnostics") {
      const params = message.params as PublishDiagnosticsParams;
      logger.info(
        "Got diagnostics for:",
        params.uri,
        "count:",
        params.diagnostics.length,
      );
      this.diagnosticsMap.set(params.uri, params.diagnostics);
    }
  }

  private async handleServerRequest(message: LSPMessage): Promise<void> {
    logger.debug("Server request:", message.method, message.id);

    switch (message.method) {
      case "workspace/configuration": {
        // Return empty configuration
        const response: LSPMessage = {
          jsonrpc: "2.0",
          id: message.id,
          result: [{}, {}, {}], // Return empty configs
        };
        await this.sendMessage(response);
        break;
      }
      default: {
        // Send error for unhandled requests
        const errorResponse: LSPMessage = {
          jsonrpc: "2.0",
          id: message.id,
          error: {
            code: -32601,
            message: `Method not found: ${message.method}`,
          },
        };
        await this.sendMessage(errorResponse);
      }
    }
  }

  private async sendMessage(message: LSPMessage): Promise<void> {
    const content = JSON.stringify(message);
    const header = `Content-Length: ${content.length}\r\n\r\n`;
    const fullMessage = this.encoder.encode(header + content);

    await this.writer.write(fullMessage);
  }

  private async sendRequest(
    method: string,
    params?: unknown,
  ): Promise<unknown> {
    const id = ++this.messageId;
    const message: LSPMessage = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    const promise = new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
    });

    await this.sendMessage(message);
    return promise;
  }

  private async sendNotification(
    method: string,
    params?: unknown,
  ): Promise<void> {
    const message: LSPMessage = {
      jsonrpc: "2.0",
      method,
      params,
    };
    await this.sendMessage(message);
  }

  async getDiagnostics(filePath: string): Promise<Array<Diagnostic>> {
    // Ensure initialization is complete
    await this.initPromise;

    const uri = `file://${filePath}`;
    logger.debug(`Getting diagnostics for: ${uri}`);

    // Read file content
    let content: string;
    try {
      content = await Deno.readTextFile(filePath);
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to read file: ${error.message}`);
    }

    // Clear existing diagnostics
    this.diagnosticsMap.delete(uri);

    // Open document to trigger diagnostics
    const params: DidOpenTextDocumentParams = {
      textDocument: {
        uri,
        languageId: this.getLanguageId(filePath),
        version: 1,
        text: content,
      },
    };

    logger.debug(`Sending textDocument/didOpen for ${uri}`);
    await this.sendNotification("textDocument/didOpen", params);

    // Wait for diagnostics (with timeout)
    const timeout = 5000;
    const startTime = Date.now();

    // Give LSP some time to process
    await new Promise((resolve) => setTimeout(resolve, 200));

    while (Date.now() - startTime < timeout) {
      const diagnostics = this.diagnosticsMap.get(uri);
      if (diagnostics !== undefined) {
        logger.debug(
          `Got diagnostics for ${uri}, count: ${diagnostics.length}`,
        );
        // Close document
        await this.sendNotification("textDocument/didClose", {
          textDocument: { uri },
        });
        return diagnostics;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Timeout - check one more time
    const finalCheck = this.diagnosticsMap.get(uri);
    logger.warn(
      `Timeout waiting for diagnostics for ${uri}, final check: ${
        finalCheck?.length || 0
      }`,
    );

    // Close document
    await this.sendNotification("textDocument/didClose", {
      textDocument: { uri },
    });

    return finalCheck || [];
  }

  private getLanguageId(filePath: string): string {
    const ext = filePath.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
        return "typescript";
      case "tsx":
        return "typescriptreact";
      case "js":
        return "javascript";
      case "jsx":
        return "javascriptreact";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  }

  async close(): Promise<void> {
    try {
      await this.sendNotification("shutdown");
    } catch {
      // Ignore errors during shutdown
    }
    try {
      await this.writer.close();
    } catch {
      // Ignore close errors
    }
    try {
      await this.process.stdout.cancel();
    } catch {
      // Ignore cancel errors
    }
    try {
      this.process.kill();
      await this.process.status;
    } catch {
      // Process might already be terminated
    }
  }
}
