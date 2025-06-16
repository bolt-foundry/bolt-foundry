#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";
import { join } from "@std/path";
import { exists } from "@std/fs";

/**
 * Tests for the aibff repl command
 *
 * These tests focus on:
 * 1. Conversation loop functionality (input/output, exit commands)
 * 2. File management (conversation.md, progress.md creation and content)
 */

const replScript = new URL("../../commands/repl.ts", import.meta.url).pathname;

async function runReplWithInput(input: string): Promise<{
  code: number;
  stdout: string;
  stderr: string;
  sessionPath?: string;
}> {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-write",
      replScript,
    ],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });

  const process = command.spawn();
  const writer = process.stdin.getWriter();
  await writer.write(new TextEncoder().encode(input));
  await writer.close();

  const { code, stdout, stderr } = await process.output();

  const stdoutText = new TextDecoder().decode(stdout);
  const stderrText = new TextDecoder().decode(stderr);

  // Extract session path from output
  const sessionMatch = stdoutText.match(/Session created: (.+)/);
  const sessionPath = sessionMatch ? sessionMatch[1].trim() : undefined;

  return {
    code,
    stdout: stdoutText,
    stderr: stderrText,
    sessionPath,
  };
}

// Conversation Loop Tests

Deno.test("repl should echo user input", async () => {
  const { code, stdout, sessionPath } = await runReplWithInput(
    "hello world\nexit\n",
  );

  try {
    assertEquals(code, 0);
    assertStringIncludes(stdout, "Welcome to aibff REPL!");
    assertStringIncludes(stdout, 'You said: "hello world"');
    assertStringIncludes(stdout, "Goodbye!");
  } finally {
    // Cleanup
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should exit on 'exit' command", async () => {
  const { code, stdout, sessionPath } = await runReplWithInput("exit\n");

  try {
    assertEquals(code, 0);
    assertStringIncludes(stdout, "Goodbye!");
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should exit on 'quit' command", async () => {
  const { code, stdout, sessionPath } = await runReplWithInput("quit\n");

  try {
    assertEquals(code, 0);
    assertStringIncludes(stdout, "Goodbye!");
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should handle multiple inputs before exit", async () => {
  const { code, stdout, sessionPath } = await runReplWithInput(
    "first input\nsecond input\nexit\n",
  );

  try {
    assertEquals(code, 0);
    assertStringIncludes(stdout, 'You said: "first input"');
    assertStringIncludes(stdout, 'You said: "second input"');
    assertStringIncludes(stdout, "Goodbye!");
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

// File Management Tests

Deno.test("repl should create session folder with conversation.md and progress.md", async () => {
  const { code, sessionPath } = await runReplWithInput("test\nexit\n");

  try {
    assertEquals(code, 0);

    // Verify session path exists
    if (!sessionPath) {
      throw new Error("Session path not found in output");
    }

    const sessionExists = await exists(sessionPath);
    assertEquals(sessionExists, true);

    // Check for required files
    const conversationPath = join(sessionPath, "conversation.md");
    const progressPath = join(sessionPath, "progress.md");

    assertEquals(await exists(conversationPath), true);
    assertEquals(await exists(progressPath), true);
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should write conversation history to conversation.md", async () => {
  const { code, sessionPath } = await runReplWithInput(
    "hello assistant\nexit\n",
  );

  try {
    assertEquals(code, 0);

    if (!sessionPath) {
      throw new Error("Session path not found in output");
    }

    const conversationPath = join(sessionPath, "conversation.md");
    const content = await Deno.readTextFile(conversationPath);

    // Check structure
    assertStringIncludes(content, "# Conversation History");
    assertStringIncludes(content, "## Session 1:");

    // Check user input was logged
    assertStringIncludes(content, "### User");
    assertStringIncludes(content, "hello assistant");

    // Check assistant response was logged
    assertStringIncludes(content, "### Assistant");
    assertStringIncludes(content, 'You said: "hello assistant"');
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should create progress.md with TOML frontmatter", async () => {
  const { code, sessionPath } = await runReplWithInput("test\nexit\n");

  try {
    assertEquals(code, 0);

    if (!sessionPath) {
      throw new Error("Session path not found in output");
    }

    const progressPath = join(sessionPath, "progress.md");
    const content = await Deno.readTextFile(progressPath);

    // Check TOML frontmatter
    assertStringIncludes(content, "+++");
    assertStringIncludes(content, "sessionId = ");
    assertStringIncludes(content, "startTime = ");
    assertStringIncludes(content, 'status = "active"');

    // Check markdown content
    assertStringIncludes(content, "# Session Progress");
    assertStringIncludes(content, "Session started at");
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should show help with --help flag", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-write",
      replScript,
      "--help",
    ],
  });

  const { code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(code, 0);
  assertStringIncludes(output, "Usage: aibff repl");
  assertStringIncludes(output, "interactive session for building graders");
});

// v0.2.0 Session Management Tests

Deno.test("repl should include enhanced metadata in progress.md TOML frontmatter", async () => {
  const { code, sessionPath } = await runReplWithInput("test\nexit\n");

  try {
    assertEquals(code, 0);

    if (!sessionPath) {
      throw new Error("Session path not found in output");
    }

    const progressPath = join(sessionPath, "progress.md");
    const content = await Deno.readTextFile(progressPath);

    // Check for v0.2.0 enhanced metadata
    assertStringIncludes(content, "sessionId = ");
    assertStringIncludes(content, "startTime = ");
    assertStringIncludes(content, 'status = "active"');
    assertStringIncludes(content, "lastModified = ");
    assertStringIncludes(content, "conversationCount = ");
    assertStringIncludes(content, "sessionVersion = ");
    assertStringIncludes(content, "purpose = ");
  } finally {
    if (sessionPath && await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should support resuming an existing session", async () => {
  // First, create a session
  const { sessionPath: initialPath } = await runReplWithInput("initial message\nexit\n");
  
  if (!initialPath) {
    throw new Error("Initial session path not found");
  }

  try {
    // Resume the session
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-write",
        replScript,
        "--resume",
        initialPath,
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    const process = command.spawn();
    const writer = process.stdin.getWriter();
    await writer.write(new TextEncoder().encode("resumed message\nexit\n"));
    await writer.close();

    const { code, stdout } = await process.output();
    const stdoutText = new TextDecoder().decode(stdout);

    assertEquals(code, 0);
    assertStringIncludes(stdoutText, "Resuming session");
    
    // Check that conversation history includes both messages
    const conversationPath = join(initialPath, "conversation.md");
    const conversationContent = await Deno.readTextFile(conversationPath);
    
    assertStringIncludes(conversationContent, "initial message");
    assertStringIncludes(conversationContent, "resumed message");
  } finally {
    if (await exists(initialPath)) {
      await Deno.remove(initialPath, { recursive: true });
    }
  }
});

Deno.test("repl should update session metadata on resume", async () => {
  // Create initial session
  const { sessionPath } = await runReplWithInput("first\nexit\n");
  
  if (!sessionPath) {
    throw new Error("Session path not found");
  }

  try {
    // Get initial metadata
    const progressPath = join(sessionPath, "progress.md");
    const initialContent = await Deno.readTextFile(progressPath);
    
    // Wait a bit to ensure time difference
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Resume session
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-write",
        replScript,
        "--resume",
        sessionPath,
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    const process = command.spawn();
    const writer = process.stdin.getWriter();
    await writer.write(new TextEncoder().encode("second\nexit\n"));
    await writer.close();

    await process.output();
    
    // Check updated metadata
    const updatedContent = await Deno.readTextFile(progressPath);
    
    // Should have updated lastModified
    assertStringIncludes(updatedContent, "lastModified = ");
    
    // Should have incremented conversationCount
    assertStringIncludes(updatedContent, "conversationCount = 2");
    
    // Original sessionId should be preserved
    const initialSessionId = initialContent.match(/sessionId = "(.+)"/)?.[1];
    const updatedSessionId = updatedContent.match(/sessionId = "(.+)"/)?.[1];
    assertEquals(initialSessionId, updatedSessionId);
  } finally {
    if (await exists(sessionPath)) {
      await Deno.remove(sessionPath, { recursive: true });
    }
  }
});

Deno.test("repl should error gracefully when resuming non-existent session", async () => {
  const fakePath = "/tmp/non-existent-session";
  
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-env",
      "--allow-read",
      "--allow-write",
      replScript,
      "--resume",
      fakePath,
    ],
  });

  const { code, stderr } = await command.output();
  const stderrText = new TextDecoder().decode(stderr);

  // Should exit with error code
  assertEquals(code, 1);
  assertStringIncludes(stderrText, "Session not found");
});

Deno.test("repl should list available sessions with --list flag", async () => {
  // Create a couple of test sessions
  const { sessionPath: session1 } = await runReplWithInput("session 1\nexit\n");
  const { sessionPath: session2 } = await runReplWithInput("session 2\nexit\n");

  try {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-env",
        "--allow-read",
        "--allow-write",
        replScript,
        "--list",
      ],
    });

    const { code, stdout } = await command.output();
    const output = new TextDecoder().decode(stdout);

    assertEquals(code, 0);
    assertStringIncludes(output, "Available sessions:");
    
    // Should show both session paths
    if (session1) assertStringIncludes(output, session1.split('/').pop()!);
    if (session2) assertStringIncludes(output, session2.split('/').pop()!);
  } finally {
    if (session1 && await exists(session1)) {
      await Deno.remove(session1, { recursive: true });
    }
    if (session2 && await exists(session2)) {
      await Deno.remove(session2, { recursive: true });
    }
  }
});
