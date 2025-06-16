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
}

async function createSession(): Promise<SessionState> {
  const sessionId = `session-${Date.now()}`;
  const sessionPath = join(Deno.cwd(), sessionId);

  await ensureDir(sessionPath);

  const state: SessionState = {
    sessionId,
    sessionPath,
    startTime: new Date().toISOString(),
    conversationCount: 0,
  };

  // Initialize progress.md with TOML frontmatter
  const progressContent = `+++
sessionId = "${state.sessionId}"
startTime = "${state.startTime}"
status = "active"
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

    // Show prompt for next input
    ui.printUser("\nYou: ");
  }
}

async function runRepl(args: Array<string>): Promise<void> {
  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    ui.println("Usage: aibff repl [options]");
    ui.println("");
    ui.println("Options:");
    ui.println("  --help, -h    Show this help message");
    ui.println("");
    ui.println(
      "The REPL creates an interactive session for building graders through conversation.",
    );
    ui.println(
      "Each session is saved in a timestamped folder with conversation history and progress tracking.",
    );
    ui.println("");
    ui.println("Examples:");
    ui.println("  aibff repl    # Start a new REPL session");
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
