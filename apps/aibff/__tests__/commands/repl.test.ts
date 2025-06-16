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
