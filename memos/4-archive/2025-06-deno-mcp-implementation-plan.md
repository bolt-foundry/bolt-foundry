# Deno MCP Server Implementation Plan

## Overview

This implementation creates a minimal Model Context Protocol (MCP) server that
exposes Deno's diagnostics capabilities to AI assistants. Following "worse is
better" principles, it provides only on-demand diagnostics for TypeScript,
JavaScript, and related files, with support for batch operations to check
multiple files efficiently.

## Goals

| Goal               | Description                                              | Success Criteria                                                                       |
| ------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Expose Diagnostics | Provide on-demand type checking and linting via Deno LSP | AI can request diagnostics for multiple files and receive structured error information |
| Persistent LSP     | Maintain long-running Deno LSP process                   | Fast response times by avoiding process startup overhead                               |
| Batch Operations   | Support processing multiple files efficiently            | Can handle arrays of files in single requests with per-file results                    |

## Anti-Goals

| Anti-Goal                  | Reason                                             |
| -------------------------- | -------------------------------------------------- |
| Code formatting            | Keeping v1 minimal - diagnostics only              |
| Code completion            | Not useful for AI assistants per requirements      |
| Hover information          | Reserved for future implementation                 |
| Code actions (quick fixes) | Reserved for future implementation                 |
| Rename symbol              | Reserved for future implementation                 |
| Import completion          | Reserved for future implementation                 |
| Workspace symbols          | Reserved for future implementation                 |
| Real-time file watching    | MCP servers work on-demand, not reactively         |
| HTTP/WebSocket transport   | MCP uses stdio-based communication                 |
| Configuration management   | Let Deno LSP handle config discovery automatically |
| Complex error handling     | Simple success/error per file is sufficient        |

## Technical Approach

Minimal implementation following "worse is better":

1. Start a persistent Deno LSP subprocess on startup
2. Implement basic JSON-RPC handling for MCP (no library needed)
3. Translate diagnostic requests to LSP textDocument/diagnostic calls
4. Return results maintaining file order for easy correlation
5. Let Deno LSP handle all configuration discovery

The implementation prioritizes simplicity over features, with just enough
functionality to be useful.

## Components

| Status | Component                    | Purpose                                          |
| ------ | ---------------------------- | ------------------------------------------------ |
| [ ]    | `apps/denomcp/mod.ts`        | Main entry point - starts server and LSP process |
| [ ]    | `apps/denomcp/mcp-server.ts` | Simple JSON-RPC message handling over stdio      |
| [ ]    | `apps/denomcp/lsp-client.ts` | Minimal LSP client for diagnostics requests      |
| [ ]    | `apps/denomcp/types.ts`      | TypeScript interfaces for MCP and LSP messages   |
| [ ]    | `apps/denomcp/__tests__/`    | Test suite focusing on core functionality        |

## Technical Decisions

| Decision                 | Reasoning                                  | Alternatives Considered                   |
| ------------------------ | ------------------------------------------ | ----------------------------------------- |
| Diagnostics only in v1   | Simpler implementation, most critical need | Include formatting (more complex)         |
| Custom JSON-RPC handler  | Simple, minimal code, full control         | JSON-RPC library (unnecessary dependency) |
| Batch operations         | Common AI use case, modest complexity      | Single file only (too limiting)           |
| Order-preserving results | Easy file-to-result correlation            | Separate success/error arrays (confusing) |
| Let LSP handle config    | Simpler, already works correctly           | Manual config discovery (redundant)       |

## Next Steps

| Question                               | How to Explore                          |
| -------------------------------------- | --------------------------------------- |
| What's the minimal MCP message format? | Check MCP spec for required fields only |
| How to initialize Deno LSP quickly?    | Test minimal initialization sequence    |
| Best stdio parsing approach?           | Try line-based vs length-prefixed JSON  |
