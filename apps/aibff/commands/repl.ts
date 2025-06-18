#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { TextLineStream } from "@std/streams/text-line-stream";
import { gray } from "@std/fmt/colors";
import { renderDeck } from "./render.ts";
import type { Command } from "./types.ts";
import { streamFromOpenRouter } from "../lib/openrouter-client.ts";
import type { OpenRouterMessage } from "../lib/openrouter-client.ts";


const pirateDeck = `
You are an assistant who is helping thwart a fraudster. The fraudster is claiming to represent the powerball lottery.

	The user will give you a message from the fraudster, and your job is to keep them talking as long as they can, giving them hope that they'll get the scam to work, and that the user is an elderly man from new york named randall.
`;

async function runRepl(_args: Array<string>): Promise<void> {
  const apiKey = getConfigurationVariable("OPENROUTER_API_KEY");
  if (!apiKey) {
    await Deno.stdout.write(new TextEncoder().encode("Please set OPENROUTER_API_KEY environment variable\n"));
    return;
  }

  await Deno.stdout.write(new TextEncoder().encode("Chat started. Type 'exit' to quit.\n\n"));
  
  // Create a temporary file for the pirate deck
  const tempFile = await Deno.makeTempFile({ suffix: ".md" });
  await Deno.writeTextFile(tempFile, pirateDeck);
  
  // Use renderDeck to create the initial messages with the pirate deck
  const rendered = renderDeck(tempFile, {}, {
    model: "openai/gpt-4o-mini",
    temperature: 0.7,
    stream: true
  });
  
  const messages: Array<OpenRouterMessage> = rendered.messages as Array<OpenRouterMessage>;

  // Get initial assistant greeting
  try {
    // Show assistant prefix
    await Deno.stdout.write(new TextEncoder().encode("🤖> "));

    let assistantMessage = "";
    
    for await (const chunk of streamFromOpenRouter(rendered)) {
      Deno.stdout.writeSync(new TextEncoder().encode(chunk));
      assistantMessage += chunk;
    }

    await Deno.stdout.write(new TextEncoder().encode("\n\n"));
    messages.push({ role: "assistant", content: assistantMessage });
  } catch (error) {
    await Deno.stdout.write(new TextEncoder().encode(`\nError: ${error instanceof Error ? error.message : String(error)}\n`));
  }

  // Show initial prompt
  await Deno.stdout.write(new TextEncoder().encode(gray("> ")));

  const lineStream = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  for await (const line of lineStream) {
    if (line.trim().toLowerCase() === "exit") {
      // Move up one line to remove the prompt line, then show the dim message
      await Deno.stdout.write(new TextEncoder().encode("\x1b[A\r\x1b[K"));
      await Deno.stdout.write(new TextEncoder().encode(gray(`> ${line}\n`)));
      await Deno.stdout.write(new TextEncoder().encode("Goodbye!\n"));
      break;
    }

    // Move up one line to remove the prompt line, then show the dim message
    await Deno.stdout.write(new TextEncoder().encode("\x1b[A\r\x1b[K"));
    await Deno.stdout.write(new TextEncoder().encode(gray(`> ${line}\n`)));

    messages.push({ role: "user", content: line });

    // Keep only last 10 messages to avoid context overflow
    if (messages.length > 11) {
      messages.splice(1, messages.length - 11);
    }

    // Make API call and stream response
    try {
      // Show assistant prefix
      await Deno.stdout.write(new TextEncoder().encode("🤖> "));

      let assistantMessage = "";
      
      for await (const chunk of streamFromOpenRouter({
        model: "openai/gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        stream: true
      })) {
        Deno.stdout.writeSync(new TextEncoder().encode(chunk));
        assistantMessage += chunk;
      }

      await Deno.stdout.write(new TextEncoder().encode("\n\n"));
      messages.push({ role: "assistant", content: assistantMessage });
    } catch (error) {
      await Deno.stdout.write(new TextEncoder().encode(`\nError: ${error instanceof Error ? error.message : String(error)}\n`));
    }
    
    // Show prompt for next input
    await Deno.stdout.write(new TextEncoder().encode(gray("> ")));
  }
}

export const replCommand: Command = {
  name: "repl",
  description: "Start a simple chat session",
  run: runRepl,
};

// Support direct execution for testing
if (import.meta.main) {
  await replCommand.run(Deno.args);
  Deno.exit(0);
}
