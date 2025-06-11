# Deno MCP Server Implementation Plan

## Overview

This implementation creates a Model Context Protocol (MCP) server that exposes
Deno's built-in language server capabilities to AI assistants. The server
provides on-demand diagnostics and code formatting for all file types supported
by Deno's language server, enabling AI assistants to check code quality and
apply consistent formatting across TypeScript, JavaScript, JSX, TSX, JSON, and
Markdown files.

## Goals

| Goal               | Description                                              | Success Criteria                                                                              |
| ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Expose Diagnostics | Provide on-demand type checking and linting via Deno LSP | AI can request diagnostics for single/multiple files and receive structured error information |
| Expose Formatting  | Enable code formatting through Deno's formatter          | AI can format files individually or in batches with Deno's standard formatting rules          |
| Auto-configuration | Automatically discover and use deno.json/deno.jsonc      | Server finds and applies workspace configuration without manual setup                         |
| Persistent LSP     | Maintain long-running Deno LSP process                   | Fast response times by avoiding process startup overhead                                      |
| Batch Operations   | Support processing multiple files efficiently            | Can handle arrays of files in single requests                                                 |

## Anti-Goals

| Anti-Goal                  | Reason                                        |
| -------------------------- | --------------------------------------------- |
| Code completion            | Not useful for AI assistants per requirements |
| Hover information          | Reserved for future implementation            |
| Code actions (quick fixes) | Reserved for future implementation            |
| Rename symbol              | Reserved for future implementation            |
| Import completion          | Reserved for future implementation            |
| Workspace symbols          | Reserved for future implementation            |
| Real-time file watching    | MCP servers work on-demand, not reactively    |
| HTTP/WebSocket transport   | MCP uses stdio-based communication            |

## Technical Approach

The MCP server will act as a bridge between MCP clients and Deno's built-in
language server. It will:

1. Start a persistent Deno language server subprocess using `deno lsp`
2. Translate MCP requests into Language Server Protocol (LSP) messages
3. Handle stdio-based JSON-RPC communication for MCP
4. Manage LSP initialization and workspace configuration
5. Return partial results for batch operations when some files fail

The server follows Bolt Foundry's patterns by living in the `apps/` directory
and using Deno's built-in capabilities. Unlike the HTTP-based services in the
codebase, this will use stdio for MCP compliance.

## Components

| Status | Component                              | Purpose                                         |
| ------ | -------------------------------------- | ----------------------------------------------- |
| [ ]    | `apps/denomcp/mod.ts`                  | Main entry point that initializes MCP server    |
| [ ]    | `apps/denomcp/server.ts`               | MCP server implementation with stdio handling   |
| [ ]    | `apps/denomcp/lsp-client.ts`           | Manages Deno LSP subprocess and communication   |
| [ ]    | `apps/denomcp/handlers/diagnostics.ts` | Handles diagnostic requests and formats results |
| [ ]    | `apps/denomcp/handlers/format.ts`      | Handles formatting requests                     |
| [ ]    | `apps/denomcp/types.ts`                | TypeScript interfaces for MCP and LSP types     |
| [ ]    | `apps/denomcp/config.ts`               | Configuration discovery and management          |
| [ ]    | `apps/denomcp/__tests__/`              | Test suite for all components                   |

## Technical Decisions

| Decision                   | Reasoning                                   | Alternatives Considered              |
| -------------------------- | ------------------------------------------- | ------------------------------------ |
| stdio-based JSON-RPC       | MCP specification requirement               | HTTP transport (not MCP compliant)   |
| Persistent LSP process     | Better performance, avoids startup overhead | Spawn per request (too slow)         |
| Subprocess for LSP         | Deno LSP requires separate process          | In-process LSP (not available)       |
| Batch operations supported | Efficient for multi-file operations         | Single file only (limiting)          |
| Partial results on error   | More useful for AI workflows                | Fail entire batch (less flexible)    |
| On-demand diagnostics      | Efficient for AI use cases                  | File watching (unnecessary overhead) |

## Next Steps

| Question                                   | How to Explore                                       |
| ------------------------------------------ | ---------------------------------------------------- |
| What's the exact MCP message format?       | Research MCP specification and examples              |
| How to handle LSP initialization properly? | Study Deno LSP docs and test initialization sequence |
| Best way to manage subprocess lifecycle?   | Test different subprocess management approaches      |
| How to map LSP diagnostics to MCP format?  | Define clear mapping between formats                 |
| Optimal batch size for operations?         | Performance testing with various file counts         |
