#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run --allow-net

import type { Command } from "./types.ts";
import { TextLineStream } from "@std/streams/text-line-stream";
import { ensureDir } from "@std/fs";
import { join, dirname } from "@std/path";
import { gray, white, yellow, green, red } from "@std/fmt/colors";
import { parseMarkdownToDeck } from "packages/bolt-foundry/builders/markdown/markdownToDeck.ts";
import type { DeckBuilder, JSONValue } from "packages/bolt-foundry/builders/builders.ts";
import { getConfigurationVariable } from "packages/get-configuration-var/get-configuration-var.ts";

// Type definition for OpenAI-compatible chat completion params
interface ChatCompletionCreateParams {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  stream?: boolean;
  tools?: Array<{
    type: string;
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  }>;
}

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
  currentStep?: string;
  graderName?: string;
  evaluationDomain?: string;
}

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ToolCall {
  name: string;
  parameters: Record<string, unknown>;
}

interface LLMResponse {
  content: string;
  toolCalls?: Array<ToolCall>;
}

// Load the grader assistant deck
let assistantDeck: DeckBuilder | null = null;

async function loadAssistantDeck(): Promise<DeckBuilder> {
  const deckPath = new URL("../decks/grader-assistant.deck.md", import.meta.url).pathname;
  const deckContent = await Deno.readTextFile(deckPath);
  const basePath = dirname(deckPath);
  const { deck } = await parseMarkdownToDeck(deckContent, basePath);
  return deck;
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
currentStep = "initial"
graderName = ""
evaluationDomain = ""
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
      currentStep: metadata.currentStep || "initial",
      graderName: metadata.graderName || "",
      evaluationDomain: metadata.evaluationDomain || "",
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
currentStep = "${state.currentStep || 'initial'}"
graderName = "${state.graderName || ''}"
evaluationDomain = "${state.evaluationDomain || ''}"
+++

# Session Progress

Session started at ${new Date(state.startTime).toLocaleString()}
Last modified at ${new Date(state.lastModified).toLocaleString()}

## Current Status
- Step: ${state.currentStep || 'initial'}
- Grader: ${state.graderName || 'Not yet defined'}
- Domain: ${state.evaluationDomain || 'Not yet specified'}
`;

  await Deno.writeTextFile(progressPath, progressContent);
}

function printWelcome(): void {
  ui.println("");
  ui.printAssistant("Welcome to aibff REPL!");
  ui.printInfo("Type 'exit' or 'quit' to end the session.\n");
}

async function checkApiKey(): Promise<string | null> {
  const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  if (apiKey) return apiKey;

  ui.println("");
  ui.printInfo("No OpenRouter API key found.");
  ui.println("To use the AI assistant, you'll need an OpenRouter API key.");
  ui.println("You can get one at: https://openrouter.ai/keys");
  ui.println("");
  ui.print("Enter your API key (or press Enter to skip): ");

  const lineStream = ui.getInputStream();
  for await (const line of lineStream) {
    const input = line.trim();
    if (!input) {
      ui.printInfo("Skipping API key setup. You can set OPENROUTER_API_KEY later.");
      return null;
    }
    
    // Optionally save to .env.local
    ui.print("Save to .env.local for future sessions? (y/n): ");
    const saveStream = ui.getInputStream();
    for await (const saveLine of saveStream) {
      if (saveLine.trim().toLowerCase() === 'y') {
        const envPath = join(Deno.cwd(), ".env.local");
        let envContent = "";
        try {
          envContent = await Deno.readTextFile(envPath);
        } catch {
          // File doesn't exist yet
        }
        
        if (!envContent.includes("OPENROUTER_API_KEY")) {
          envContent += `\nOPENROUTER_API_KEY=${input}\n`;
          await Deno.writeTextFile(envPath, envContent);
          ui.printInfo("API key saved to .env.local");
        }
      }
      break;
    }
    
    return input;
  }
  
  return null;
}

async function getConversationHistory(sessionPath: string, limit: number = 10): Promise<Array<ConversationMessage>> {
  try {
    const conversationPath = join(sessionPath, "conversation.md");
    const content = await Deno.readTextFile(conversationPath);
    
    // Parse the conversation history
    const messages: Array<ConversationMessage> = [];
    const lines = content.split('\n');
    let currentSpeaker: "user" | "assistant" | null = null;
    let currentContent: Array<string> = [];
    
    for (const line of lines) {
      if (line.startsWith("### User")) {
        if (currentSpeaker && currentContent.length > 0) {
          messages.push({
            role: currentSpeaker,
            content: currentContent.join('\n').trim()
          });
        }
        currentSpeaker = "user";
        currentContent = [];
      } else if (line.startsWith("### Assistant")) {
        if (currentSpeaker && currentContent.length > 0) {
          messages.push({
            role: currentSpeaker,
            content: currentContent.join('\n').trim()
          });
        }
        currentSpeaker = "assistant";
        currentContent = [];
      } else if (currentSpeaker && line.trim() !== '') {
        currentContent.push(line);
      }
    }
    
    // Add the last message
    if (currentSpeaker && currentContent.length > 0) {
      messages.push({
        role: currentSpeaker,
        content: currentContent.join('\n').trim()
      });
    }
    
    // Return only the last N messages
    return messages.slice(-limit);
  } catch {
    return [];
  }
}

async function callLLM(
  messages: Array<ConversationMessage>,
  sessionState: SessionState,
  apiKey: string
): Promise<LLMResponse> {
  if (!assistantDeck) {
    assistantDeck = await loadAssistantDeck();
  }

  // Prepare context for the deck
  const recentHistory = await getConversationHistory(sessionState.sessionPath);
  const context: Record<string, unknown> = {
    session_id: sessionState.sessionId,
    session_path: sessionState.sessionPath,
    current_step: sessionState.currentStep || "initial",
    user_goal: sessionState.purpose || "",
    evaluation_domain: sessionState.evaluationDomain || "",
    grader_name: sessionState.graderName || "",
    sample_count: 0, // TODO: Track this
    conversation_history: { 
      messages: recentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    },
    last_command_result: ""
  };

  // Render the deck with context
  const rendered = assistantDeck.render({
    messages: messages as any, // Type conversion for compatibility
    model: "anthropic/claude-3.5-sonnet",
    temperature: 0.7,
    context: context as Record<string, JSONValue>
  }) as ChatCompletionCreateParams;

  // Call OpenRouter API
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
        ...rendered,
        stream: true, // Enable streaming
        tools: [
          {
            type: "function",
            function: {
              name: "create_file",
              description: "Create a new file in the session directory",
              parameters: {
                type: "object",
                properties: {
                  filename: { type: "string", description: "Name of the file to create" },
                  content: { type: "string", description: "Content to write to the file" }
                },
                required: ["filename", "content"]
              }
            }
          },
          {
            type: "function", 
            function: {
              name: "read_file",
              description: "Read a file from the session directory",
              parameters: {
                type: "object",
                properties: {
                  filename: { type: "string", description: "Name of the file to read" }
                },
                required: ["filename"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "run_eval",
              description: "Run aibff eval command to test the grader",
              parameters: {
                type: "object",
                properties: {
                  grader_file: { type: "string", description: "Path to the grader deck file" },
                  samples_file: { type: "string", description: "Path to samples file" },
                  output_folder: { type: "string", description: "Output folder for results" }
                },
                required: ["grader_file"]
              }
            }
          }
        ]
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
  }

  // Handle streaming response
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let fullContent = "";
  let toolCalls: Array<ToolCall> = [];
  let currentToolCall: any = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;

          if (delta?.content) {
            fullContent += delta.content;
            ui.print(delta.content); // Stream to terminal
          }

          if (delta?.tool_calls) {
            for (const toolCall of delta.tool_calls) {
              if (toolCall.index !== undefined) {
                if (!currentToolCall || currentToolCall.index !== toolCall.index) {
                  if (currentToolCall) {
                    toolCalls.push({
                      name: currentToolCall.function.name,
                      parameters: JSON.parse(currentToolCall.function.arguments)
                    });
                  }
                  currentToolCall = {
                    index: toolCall.index,
                    function: { name: "", arguments: "" }
                  };
                }
                if (toolCall.function?.name) {
                  currentToolCall.function.name = toolCall.function.name;
                }
                if (toolCall.function?.arguments) {
                  currentToolCall.function.arguments += toolCall.function.arguments;
                }
              }
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
  }

  // Add the last tool call if any
  if (currentToolCall) {
    toolCalls.push({
      name: currentToolCall.function.name,
      parameters: JSON.parse(currentToolCall.function.arguments)
    });
  }

  if (fullContent) {
    ui.println(""); // New line after streaming
  }

  return {
    content: fullContent,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined
  };
}

async function executeToolCall(
  tool: ToolCall,
  sessionState: SessionState
): Promise<string> {
  ui.printInfo(`\nExecuting tool: ${tool.name}`);

  switch (tool.name) {
    case "create_file": {
      const { filename, content } = tool.parameters as { filename: string; content: string };
      const filePath = join(sessionState.sessionPath, filename);
      await Deno.writeTextFile(filePath, content);
      return `Created file: ${filename}`;
    }

    case "read_file": {
      const { filename } = tool.parameters as { filename: string };
      const filePath = join(sessionState.sessionPath, filename);
      try {
        const content = await Deno.readTextFile(filePath);
        return content;
      } catch {
        return `Error: File not found: ${filename}`;
      }
    }

    case "run_eval": {
      const { grader_file, samples_file, output_folder } = tool.parameters as {
        grader_file: string;
        samples_file?: string;
        output_folder?: string;
      };
      
      // Run the eval command
      const args = ["eval", grader_file];
      if (samples_file) args.push(samples_file);
      if (output_folder) args.push("--output", output_folder);

      const evalCommand = new Deno.Command("aibff", {
        args,
        cwd: sessionState.sessionPath,
        stdout: "piped",
        stderr: "piped",
      });

      const { code, stdout, stderr } = await evalCommand.output();
      const output = new TextDecoder().decode(stdout);
      const error = new TextDecoder().decode(stderr);

      if (code !== 0) {
        return `Error running eval: ${error || output}`;
      }

      return output;
    }

    default:
      return `Unknown tool: ${tool.name}`;
  }
}

async function conversationLoop(state: SessionState, apiKey: string | null): Promise<void> {
  const lineStream = ui.getInputStream();
  const conversationMessages: Array<ConversationMessage> = [];

  // Add initial assistant message
  const welcomeMessage = "Welcome! I'm here to help you create a grader for evaluating AI outputs. Could you tell me what kind of AI responses you'd like to evaluate? For example, are you working with customer support responses, code generation, content creation, or something else?";
  ui.printAssistant(welcomeMessage);
  await appendToConversation(state.sessionPath, "Assistant", welcomeMessage);
  ui.printUser("\nYou: ");

  for await (const line of lineStream) {
    const input = line.trim();

    // Check for exit commands
    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      ui.println("");
      ui.printAssistant("Goodbye! Your session has been saved.");
      break;
    }

    // Log user input
    await appendToConversation(state.sessionPath, "User", input);
    state.conversationCount++;

    if (!apiKey) {
      // Fallback to simple echo if no API key
      const response = `I need an API key to help you. You said: "${input}"`;
      ui.printAssistant(response);
      await appendToConversation(state.sessionPath, "Assistant", response);
    } else {
      try {
        // Add user message to conversation
        conversationMessages.push({ role: "user", content: input });

        // Keep conversation history manageable
        if (conversationMessages.length > 20) {
          conversationMessages.splice(0, conversationMessages.length - 20);
        }

        // Call LLM
        const llmResponse = await callLLM(conversationMessages, state, apiKey);

        // Log assistant response
        if (llmResponse.content) {
          await appendToConversation(state.sessionPath, "Assistant", llmResponse.content);
          conversationMessages.push({ role: "assistant", content: llmResponse.content });
        }

        // Execute any tool calls
        if (llmResponse.toolCalls) {
          for (const toolCall of llmResponse.toolCalls) {
            const toolResult = await executeToolCall(toolCall, state);
            
            // Log tool execution
            await appendToConversation(
              state.sessionPath,
              "Assistant",
              `\`\`\`toml
tool = "${toolCall.name}"
parameters = ${JSON.stringify(toolCall.parameters, null, 2)}
result = """
${toolResult}
"""
\`\`\``
            );

            // Show result to user
            ui.printInfo(`Tool result: ${toolResult.substring(0, 200)}${toolResult.length > 200 ? '...' : ''}`);
            
            // Add tool result to conversation for follow-up
            conversationMessages.push({
              role: "assistant",
              content: `I executed ${toolCall.name} and got: ${toolResult}`
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        ui.printInfo(`\nError: ${errorMessage}`);
        
        // Provide helpful error message
        if (errorMessage.includes("API request failed")) {
          ui.printAssistant("I'm having trouble connecting to the AI service. Please check your API key and try again.");
        } else {
          ui.printAssistant("I encountered an error. Let's continue with our conversation.");
        }
      }
    }

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

  // Check for API key early
  const apiKey = await checkApiKey();

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
      await conversationLoop(state, apiKey);
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
    await conversationLoop(state, apiKey);
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
