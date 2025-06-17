#!/usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import { replCommand } from "../../commands/repl.ts";

Deno.test("repl command - help", async () => {
  // Capture output
  let output = "";
  const originalWrite = Deno.stdout.writeSync;
  Deno.stdout.writeSync = (p: Uint8Array): number => {
    output += new TextDecoder().decode(p);
    return p.length;
  };

  try {
    await replCommand.run(["--help"]);
  } finally {
    Deno.stdout.writeSync = originalWrite;
  }

  // Check help output
  assertEquals(output.includes("Usage: aibff repl [options]"), true);
  assertEquals(output.includes("--help"), true);
  assertEquals(output.includes("--resume"), true);
  assertEquals(output.includes("--list"), true);
});

Deno.test("repl command - session creation", async () => {
  // Create a temporary directory for the test
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    // Change to temp directory
    Deno.chdir(tempDir);

    // Mock stdin to simulate user input
    const encoder = new TextEncoder();
    const originalStdin = Deno.stdin.readable;
    
    // Create a simple readable stream that sends "exit" command
    const inputStream = new ReadableStream({
      start(controller) {
        // Skip API key prompt
        controller.enqueue(encoder.encode("\n"));
        // Exit command
        controller.enqueue(encoder.encode("exit\n"));
        controller.close();
      },
    });

    // Replace stdin
    Object.defineProperty(Deno.stdin, "readable", {
      value: inputStream,
      configurable: true,
    });

    // Capture output
    let output = "";
    const originalWrite = Deno.stdout.writeSync;
    Deno.stdout.writeSync = (p: Uint8Array): number => {
      output += new TextDecoder().decode(p);
      return p.length;
    };

    try {
      await replCommand.run([]);
    } finally {
      // Restore original stdin and stdout
      Object.defineProperty(Deno.stdin, "readable", {
        value: originalStdin,
        configurable: true,
      });
      Deno.stdout.writeSync = originalWrite;
    }

    // Check that session was created
    const entries = [];
    for await (const entry of Deno.readDir(tempDir)) {
      if (entry.isDirectory && entry.name.startsWith("session-")) {
        entries.push(entry.name);
      }
    }

    assertEquals(entries.length, 1, "Should create one session directory");

    // Check session files
    const sessionDir = join(tempDir, entries[0]);
    const progressFile = join(sessionDir, "progress.md");
    const conversationFile = join(sessionDir, "conversation.md");

    assertExists(await Deno.stat(progressFile), "progress.md should exist");
    assertExists(await Deno.stat(conversationFile), "conversation.md should exist");

    // Check progress.md content
    const progressContent = await Deno.readTextFile(progressFile);
    assertEquals(progressContent.includes("sessionId"), true);
    assertEquals(progressContent.includes("currentStep = \"initial\""), true);

    // Check conversation.md content
    const conversationContent = await Deno.readTextFile(conversationFile);
    assertEquals(conversationContent.includes("# Conversation History"), true);

  } finally {
    // Clean up
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("repl command - list sessions", async () => {
  // Create a temporary directory with mock sessions
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();

  try {
    Deno.chdir(tempDir);

    // Create mock session directories
    const session1 = join(tempDir, "session-123");
    const session2 = join(tempDir, "session-456");
    
    await ensureDir(session1);
    await ensureDir(session2);

    // Create progress.md files
    const progressContent1 = `+++
sessionId = "session-123"
startTime = "2025-01-01T00:00:00Z"
status = "active"
lastModified = "2025-01-01T00:00:00Z"
conversationCount = 5
sessionVersion = "0.2.0"
purpose = "Test session 1"
+++

# Session Progress`;

    const progressContent2 = `+++
sessionId = "session-456"
startTime = "2025-01-02T00:00:00Z"
status = "completed"
lastModified = "2025-01-02T00:00:00Z"
conversationCount = 10
sessionVersion = "0.2.0"
purpose = "Test session 2"
+++

# Session Progress`;

    await Deno.writeTextFile(join(session1, "progress.md"), progressContent1);
    await Deno.writeTextFile(join(session2, "progress.md"), progressContent2);

    // Capture output
    let output = "";
    const originalWrite = Deno.stdout.writeSync;
    Deno.stdout.writeSync = (p: Uint8Array): number => {
      output += new TextDecoder().decode(p);
      return p.length;
    };

    try {
      await replCommand.run(["--list"]);
    } finally {
      Deno.stdout.writeSync = originalWrite;
    }

    // Check output
    assertEquals(output.includes("Available sessions:"), true);
    assertEquals(output.includes("session-123"), true);
    assertEquals(output.includes("session-456"), true);
    assertEquals(output.includes("Status: active"), true);
    assertEquals(output.includes("Status: completed"), true);

  } finally {
    Deno.chdir(originalCwd);
    await Deno.remove(tempDir, { recursive: true });
  }
});
