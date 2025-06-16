#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run

import type { Command } from "./types.ts";
import { TextLineStream } from "@std/streams/text-line-stream";
import { ensureDir } from "@std/fs";
import { join } from "@std/path";
import { gray, white } from "@std/fmt/colors";

// Minimal UI abstraction
interface UI {
  print(message: string): void;
  println(message: string): void;
  printUser(message: string): void;
  printAssistant(message: string): void;
  printInfo(message: string): void;
  getInputStream(): ReadableStream<string>;
}

class TerminalUI implements UI {
  print(message: string): void {
    Deno.stdout.writeSync(new TextEncoder().encode(message));
  }

  println(message: string): void {
    this.print(message + "\n");
  }

  printUser(message: string): void {
    this.print(gray(message));
  }

  printAssistant(message: string): void {
    this.println(white(message));
  }

  printInfo(message: string): void {
    this.println(gray(message));
  }

  getInputStream(): ReadableStream<string> {
    return Deno.stdin.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
  }
}

const ui = new TerminalUI();

interface SessionState {
  sessionId: string;
  sessionPath: string;
  startTime: string;
  conversationCount: number;
  lastModified: string;
  sessionVersion: string;
  purpose: string;
  status: "active" | "completed";
}

async function createSession(): Promise<SessionState> {
  const sessionId = `session-${Date.now()}`;
  const sessionPath = join(Deno.cwd(), sessionId);

  await ensureDir(sessionPath);

  const now = new Date().toISOString();
  const state: SessionState = {
    sessionId,
    sessionPath,
    startTime: now,
    conversationCount: 0,
    lastModified: now,
    sessionVersion: "0.2.0",
    purpose: "",
    status: "active",
  };

  // Initialize progress.md with TOML frontmatter
  const progressContent = `+++
sessionId = "${state.sessionId}"
startTime = "${state.startTime}"
status = "${state.status}"
lastModified = "${state.lastModified}"
conversationCount = ${state.conversationCount}
sessionVersion = "${state.sessionVersion}"
purpose = "${state.purpose}"
+++

# Session Progress

Session started at ${new Date().toLocaleString()}
`;

  await Deno.writeTextFile(join(sessionPath, "progress.md"), progressContent);

  // Initialize conversation.md
  const conversationContent = `# Conversation History

## Session 1: ${new Date().toLocaleDateString()}

`;

  await Deno.writeTextFile(
    join(sessionPath, "conversation.md"),
    conversationContent,
  );

  return state;
}

async function appendToConversation(
  sessionPath: string,
  speaker: "User" | "Assistant",
  message: string,
): Promise<void> {
  const conversationPath = join(sessionPath, "conversation.md");
  const content = `### ${speaker}

${message}

`;

  await Deno.writeTextFile(conversationPath, content, { append: true });
}

async function loadSessionState(
  sessionPath: string,
): Promise<SessionState | null> {
  try {
    const progressPath = join(sessionPath, "progress.md");
    const content = await Deno.readTextFile(progressPath);

    // Parse TOML frontmatter
    const frontmatterMatch = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];
    const lines = frontmatter.split("\n");
    const metadata: Record<string, string> = {};

    for (const line of lines) {
      const match = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const [_, key, value] = match;
        metadata[key] = value.replace(/^["']|["']$/g, "");
      }
    }

    return {
      sessionId: metadata.sessionId || "",
      sessionPath,
      startTime: metadata.startTime || "",
      conversationCount: parseInt(metadata.conversationCount || "0"),
      lastModified: metadata.lastModified || "",
      sessionVersion: metadata.sessionVersion || "0.2.0",
      purpose: metadata.purpose || "",
      status: (metadata.status as "active" | "completed") || "active",
    };
  } catch {
    return null;
  }
}

async function updateSessionState(state: SessionState): Promise<void> {
  const progressPath = join(state.sessionPath, "progress.md");

  // Update lastModified and write new progress.md
  state.lastModified = new Date().toISOString();

  const progressContent = `+++
sessionId = "${state.sessionId}"
startTime = "${state.startTime}"
status = "${state.status}"
lastModified = "${state.lastModified}"
conversationCount = ${state.conversationCount}
sessionVersion = "${state.sessionVersion}"
purpose = "${state.purpose}"
+++

# Session Progress

Session started at ${new Date(state.startTime).toLocaleString()}
Last modified at ${new Date(state.lastModified).toLocaleString()}
`;

  await Deno.writeTextFile(progressPath, progressContent);
}

function printWelcome(): void {
  ui.println("");
  ui.printAssistant("Welcome to aibff REPL!");
  ui.printInfo("Type 'exit' or 'quit' to end the session.\n");
}

async function conversationLoop(state: SessionState): Promise<void> {
  const lineStream = ui.getInputStream();

  for await (const line of lineStream) {
    const input = line.trim();

    // Check for exit commands
    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      ui.println("");
      ui.printAssistant("Goodbye!");
      break;
    }

    // Log user input
    await appendToConversation(state.sessionPath, "User", input);
    state.conversationCount++;

    // Simple echo response for v0.1.0
    const response = `You said: "${input}"`;
    ui.printAssistant(response);

    // Log assistant response
    await appendToConversation(state.sessionPath, "Assistant", response);

    // Update session state
    await updateSessionState(state);

    // Show prompt for next input
    ui.printUser("\nYou: ");
  }
}

async function listSessions(): Promise<void> {
  const cwd = Deno.cwd();
  const entries = [];

  for await (const entry of Deno.readDir(cwd)) {
    if (entry.isDirectory && entry.name.startsWith("session-")) {
      const sessionPath = join(cwd, entry.name);
      const state = await loadSessionState(sessionPath);
      if (state) {
        entries.push({
          name: entry.name,
          startTime: state.startTime,
          lastModified: state.lastModified,
          status: state.status,
        });
      }
    }
  }

  if (entries.length === 0) {
    ui.println("No sessions found.");
    return;
  }

  ui.println("Available sessions:");
  ui.println("");

  for (
    const entry of entries.sort((a, b) =>
      b.lastModified.localeCompare(a.lastModified)
    )
  ) {
    ui.println(`  ${entry.name}`);
    ui.printInfo(`    Started: ${new Date(entry.startTime).toLocaleString()}`);
    ui.printInfo(
      `    Last modified: ${new Date(entry.lastModified).toLocaleString()}`,
    );
    ui.printInfo(`    Status: ${entry.status}`);
    ui.println("");
  }
}

async function runRepl(args: Array<string>): Promise<void> {
  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    ui.println("Usage: aibff repl [options]");
    ui.println("");
    ui.println("Options:");
    ui.println("  --help, -h          Show this help message");
    ui.println("  --resume <path>     Resume an existing session");
    ui.println("  --list              List available sessions");
    ui.println("");
    ui.println(
      "The REPL creates an interactive session for building graders through conversation.",
    );
    ui.println(
      "Each session is saved in a timestamped folder with conversation history and progress tracking.",
    );
    ui.println("");
    ui.println("Examples:");
    ui.println(
      "  aibff repl                         # Start a new REPL session",
    );
    ui.println(
      "  aibff repl --resume session-123    # Resume an existing session",
    );
    ui.println("  aibff repl --list                  # List all sessions");
    return;
  }

  // Handle list flag
  if (args.includes("--list")) {
    await listSessions();
    return;
  }

  // Handle resume flag
  const resumeIndex = args.indexOf("--resume");
  if (resumeIndex !== -1) {
    const sessionPath = args[resumeIndex + 1];
    if (!sessionPath) {
      ui.println("Error: --resume requires a session path");
      Deno.exit(1);
    }

    try {
      const state = await loadSessionState(sessionPath);
      if (!state) {
        throw new Error("Session not found or invalid");
      }

      // Show welcome message
      printWelcome();
      ui.printInfo(`Resuming session: ${state.sessionPath}\n`);

      // Start conversation loop
      ui.printUser("You: ");
      await conversationLoop(state);
    } catch (_error) {
      Deno.stderr.writeSync(
        new TextEncoder().encode(
          `Error: Session not found or invalid: ${sessionPath}\n`,
        ),
      );
      Deno.exit(1);
    }
    return;
  }

  try {
    // Create new session
    const state = await createSession();

    // Show welcome message
    printWelcome();
    ui.printInfo(`Session created: ${state.sessionPath}\n`);

    // Start conversation loop
    ui.printUser("You: ");
    await conversationLoop(state);
  } catch (error) {
    ui.println(`Error running REPL: ${error}`);
    Deno.exit(1);
  }
}

export const replCommand: Command = {
  name: "repl",
  description: "Start an interactive REPL session for building graders",
  run: runRepl,
};

// Support direct execution for testing
if (import.meta.main) {
  await replCommand.run(Deno.args);
  Deno.exit(0);
}
