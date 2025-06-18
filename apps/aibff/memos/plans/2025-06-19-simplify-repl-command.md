# Simplify aibff repl Command Implementation Plan

## Overview

This plan outlines the simplification of the aibff repl command by removing the deck injection system and replacing it with a basic chatbot that uses a hardcoded system message. The goal is to create a minimal streaming chat interface to OpenRouter without any advanced features.

## Goals

| Goal | Description | Success Criteria |
| --- | --- | --- |
| Remove deck dependencies | Eliminate all deck parsing and rendering logic | No imports from deck-related packages |
| Hardcode system message | Replace deck-based persona with simple string | System message is "You are a helpful assistant" |
| Remove all features | Strip out tools, sessions, and command flags | Basic chat only with streaming responses |
| Simplify codebase | Reduce to minimal chat implementation | ~100 lines of code total |

## Anti-Goals

| Anti-Goal | Reason |
| --- | --- |
| Change API integration | OpenRouter integration works well |
| Add any features | Keep it absolutely minimal |
| Support configuration | Everything should be hardcoded |
| Maintain backwards compatibility | This is a complete rewrite |

## Technical Approach

The simplification will focus on removing the deck system while preserving the user experience. Instead of loading and parsing markdown decks, we'll use a simple hardcoded system message. The conversation flow will remain the same, but the message construction will be much simpler.

Key changes:
1. Remove deck loading and parsing logic
2. Remove all tool definitions and handling
3. Remove session management completely
4. Remove all command line flags
5. Use only environment variable for API key
6. Hardcode model and temperature settings

## Components

| Status | Component | Purpose |
| --- | --- | --- |
| [ ] | Message Builder | Simple array with system message and user input |
| [ ] | System Message | Hardcode "You are a helpful assistant" |
| [ ] | Remove Features | Strip out tools, sessions, and flags |
| [ ] | Cleanup Code | Remove ~90% of existing code |
| [ ] | Minimal Context | Track only session ID, start time, message count |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| --- | --- | --- |
| Hardcode everything | Maximum simplicity | Config files, env vars |
| Remove all features | Minimal implementation | Keeping some features |
| No command flags | Simplest interface | Deprecation warnings |
| Env var for API key only | Standard practice | Command line flag |

## Implementation Details

### 1. Remove Deck Loading
Delete the `loadAssistantDeck()` function (lines 100-106) and the global `assistantDeck` variable:
```typescript
// Remove these lines:
let assistantDeck: DeckBuilder | null = null;

async function loadAssistantDeck(): Promise<DeckBuilder> {
  const deckPath = new URL("../decks/grader-creation-assistant.deck.md", import.meta.url).pathname;
  const deckContent = await Deno.readTextFile(deckPath);
  const basePath = dirname(deckPath);
  const { deck } = await parseMarkdownToDeck(deckContent, basePath);
  return deck;
}
```

### 2. Simplify Message Construction
Create a minimal message array:
```typescript
const messages: ChatCompletionMessageParam[] = [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: userInput }
];
```

### 3. Minimal API Call
Simple streaming request without tools:
```typescript
const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://boltfoundry.com",
      "X-Title": "Bolt Foundry REPL",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: messages,
      temperature: 0.7,
      stream: true
    }),
  },
);
```

### 4. Clean Up Files
- Remove `/apps/aibff/decks/grader-creation-assistant.deck.md`
- Remove `/apps/aibff/decks/grader-creation-assistant.deck.toml`
- Remove most imports from `repl.ts`, keeping only:
  - Basic Deno/std imports
  - OpenAI types for message format
  - Minimal utilities

### 5. Minimal Context Tracking
Keep only essential session metadata:
```typescript
const context = {
  sessionId: crypto.randomUUID(),
  startTime: new Date().toISOString(),
  messageCount: 0
};
```

### 6. Complete Rewrite Structure
The entire repl.ts should be approximately:
```typescript
// 1. Imports (~5 lines)
// 2. Type definitions (~5 lines)
// 3. Main repl function (~80 lines)
//    - Get API key from env
//    - Create readline interface
//    - Main chat loop
//    - Stream response handling
// 4. Export statement (1 line)
```

### 7. Additional Simplifications Identified

After analyzing the current implementation (1037 lines), these components should be removed:

**UI Abstraction (lines 28-66)**
- Remove the entire UI interface and TerminalUI class
- Use direct Deno.stdout/stdin operations instead

**Session Management (lines 68-252)**
- Remove SessionState interface and all session-related functions
- No persistence, no progress tracking, no conversation history

**API Key Management (lines 259-364)**
- Simplify to just reading from environment variable
- Remove verification, prompting, and .env.local saving

**Tool System (lines 597-656)**
- Remove all tool definitions and executeToolCall function
- No file operations or eval command support

**Command Line Arguments (lines 849-887)**
- Remove all flag handling (--help, --list, --resume)
- No session listing or resuming functionality

**Welcome Message Generation (lines 686-707)**
- Remove AI-generated welcome messages
- Use simple hardcoded greeting if needed

## Implementation Order

| Step | Action | Details |
| --- | --- | --- |
| 1 | Create new minimal repl.ts | Start fresh rather than editing |
| 2 | Test basic chat loop | Ensure streaming works |
| 3 | Delete old repl.ts | Replace with new version |
| 4 | Remove deck files | Clean up unused assets |
| 5 | Update tests | Minimal test coverage |

## Testing Strategy

Minimal testing approach:
1. Test that API key is read from environment
2. Test basic message construction
3. Test streaming response parsing
4. Remove all other test cases

## Expected Outcome

After implementation, the repl command will:
- Be a simple streaming chatbot (~100 lines total)
- Use "You are a helpful assistant" as the system message
- Only support basic chat with no persistence
- Have no command line flags or configuration
- Read API key from OPENROUTER_API_KEY environment variable only

## Code Reduction Summary

| Component | Current Lines | Target Lines | Reduction |
| --- | --- | --- | --- |
| Total file | 1037 | ~100 | ~90% |
| Imports | 11 | 3-4 | ~70% |
| Types/Interfaces | ~100 | ~10 | ~90% |
| Main logic | ~900 | ~80 | ~91% |
| Session management | ~200 | 0 | 100% |
| Tool system | ~100 | 0 | 100% |
| UI abstraction | ~40 | 0 | 100% |

## Minimal Implementation Skeleton

```typescript
#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net

import { TextLineStream } from "@std/streams/text-line-stream";
import type { Command } from "./types.ts";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

async function runRepl(_args: string[]): Promise<void> {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    console.log("Please set OPENROUTER_API_KEY environment variable");
    return;
  }

  console.log("Chat started. Type 'exit' to quit.\n");
  
  const messages: Message[] = [
    { role: "system", content: "You are a helpful assistant" }
  ];

  const lineStream = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  for await (const line of lineStream) {
    if (line.trim().toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    messages.push({ role: "user", content: line });

    // Keep only last 10 messages to avoid context overflow
    if (messages.length > 11) {
      messages.splice(1, messages.length - 11);
    }

    // Make API call and stream response
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://boltfoundry.com",
        "X-Title": "Bolt Foundry REPL"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: messages,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      console.log("Error: API request failed");
      continue;
    }

    let assistantMessage = "";
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices?.[0]?.delta?.content || "";
            if (content) {
              Deno.stdout.writeSync(new TextEncoder().encode(content));
              assistantMessage += content;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    console.log("\n");
    messages.push({ role: "assistant", content: assistantMessage });
  }
}

export const replCommand: Command = {
  name: "repl",
  description: "Start a simple chat session",
  run: runRepl,
};
```