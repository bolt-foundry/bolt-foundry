# Deno MCP Server

A Model Context Protocol (MCP) server that exposes Deno's language server
diagnostics to AI assistants.

## Features

- On-demand diagnostics for TypeScript, JavaScript, JSX, TSX, JSON, and Markdown
  files
- Batch operations for checking multiple files efficiently
- Persistent Deno LSP process for fast response times
- Simple JSON-RPC over stdio communication

## Usage

Run the server:

```bash
deno run --allow-read --allow-write --allow-run apps/denomcp/mod.ts
```

The server communicates via stdio using JSON-RPC messages.

## API

### Tools

#### `deno/diagnostics`

Get diagnostics for one or more files.

**Input:**

```json
{
  "files": ["path/to/file1.ts", "path/to/file2.ts"]
}
```

**Output:**

```json
{
  "results": [
    {
      "file": "path/to/file1.ts",
      "diagnostics": [
        {
          "range": {
            "start": { "line": 0, "character": 0 },
            "end": { "line": 0, "character": 10 }
          },
          "severity": 1,
          "message": "Type 'string' is not assignable to type 'number'."
        }
      ]
    }
  ]
}
```

## Testing

Run tests:

```bash
bff test apps/denomcp/
```

## Implementation Notes

- Uses Deno's built-in `deno lsp` subprocess
- Implements minimal JSON-RPC handling without external dependencies
- Returns partial results when some files fail (e.g., file not found)
- Automatically detects file types based on extension
