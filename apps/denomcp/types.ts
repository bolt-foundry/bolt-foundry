// MCP (Model Context Protocol) types
export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: unknown;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface DiagnosticsParams {
  files: Array<string>;
}

export interface DiagnosticsResult {
  results: Array<FileDiagnostic>;
}

export interface MCPContent {
  type: string;
  text: string;
}

export interface MCPToolResult {
  content: Array<MCPContent>;
}

export interface FileDiagnostic {
  file: string;
  diagnostics?: Array<Diagnostic>;
  error?: string;
}

export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  code?: string | number;
  source?: string;
  message: string;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

// LSP (Language Server Protocol) types we need
export interface LSPMessage {
  jsonrpc: "2.0";
  id?: string | number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
}

export interface InitializeParams {
  processId: number | null;
  rootUri: string | null;
  capabilities: object;
}

export interface TextDocumentItem {
  uri: string;
  languageId: string;
  version: number;
  text: string;
}

export interface DidOpenTextDocumentParams {
  textDocument: TextDocumentItem;
}

export interface PublishDiagnosticsParams {
  uri: string;
  diagnostics: Array<Diagnostic>;
}
