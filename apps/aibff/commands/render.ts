#!/usr/bin/env -S deno run --allow-read

import type { Command } from "./types.ts";
import { parse as parseTOML } from "@std/toml";
import * as path from "@std/path";

// UI helper (to be extracted later)
const ui = {
  // deno-lint-ignore no-console
  printLn: (msg: string) => console.log(msg),
  // deno-lint-ignore no-console
  printWarn: (msg: string) => console.warn(msg),
  // deno-lint-ignore no-console
  printErr: (msg: string) => console.error(msg),
};

interface ContextDefinition {
  assistantQuestion: string;  // Required field
  default?: unknown;
  description?: string;
  type?: string;
  // Additional metadata from TOML
  [key: string]: unknown;
}

interface ExtractedContext {
  [variableName: string]: ContextDefinition & { sourceFile?: string };
}

interface Sample {
  id: string;
  input: string;
  expected: string;
  score?: number;
}

interface SampleMessage {
  role: string;
  content: string;
}

interface SampleDefinition {
  score?: number;
  messages?: SampleMessage[];
}

interface OpenAIMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

interface OpenAICompletionRequest {
  messages: Array<OpenAIMessage>;
  [key: string]: unknown;  // Additional OpenAI parameters
}

// Export for testing
export function extractContextFromMarkdown(markdown: string, deckPath: string): ExtractedContext {
  const extractedContext: ExtractedContext = {};
  const deckDir = path.dirname(deckPath);
  
  // Find external file references using regex: ![alt text](file.ext)
  const fileRefPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = fileRefPattern.exec(markdown)) !== null) {
    const filePath = match[2];
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(deckDir, filePath);
    
    // Read the file (fail immediately if file doesn't exist)
    let fileContent: string;
    try {
      fileContent = Deno.readTextFileSync(absolutePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`File not found: ${absolutePath}`);
      }
      throw error;
    }
    
    // Try to parse as TOML (fail immediately if invalid TOML)
    let tomlData: unknown;
    try {
      tomlData = parseTOML(fileContent);
    } catch (error) {
      throw new Error(`Invalid TOML in file ${absolutePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Look for [contexts.*] sections (silently ignore other sections)
    if (typeof tomlData === 'object' && tomlData !== null && 'contexts' in tomlData) {
      const contexts = tomlData.contexts as Record<string, unknown>;
      
      for (const [varName, contextDef] of Object.entries(contexts)) {
        if (typeof contextDef !== 'object' || contextDef === null) {
          continue;
        }
        
        // Validate required assistantQuestion field
        if (!('assistantQuestion' in contextDef) || typeof contextDef.assistantQuestion !== 'string') {
          throw new Error(`Context variable '${varName}' in file ${absolutePath} is missing required 'assistantQuestion' field`);
        }
        
        // Handle duplicate context variables
        if (varName in extractedContext) {
          ui.printWarn(`Warning: Context variable '${varName}' is defined in multiple files:`);
          ui.printWarn(`  - Previously defined in: ${extractedContext[varName].sourceFile || 'unknown'}`);
          ui.printWarn(`  - Now redefined in: ${absolutePath}`);
          ui.printWarn(`  Using definition from: ${absolutePath}`);
        }
        
        // Extract context definition with source file tracking
        extractedContext[varName] = {
          ...contextDef as ContextDefinition,
          sourceFile: absolutePath
        };
      }
    }
  }
  
  return extractedContext;
}

// Export for use by calibrate command
export function extractSamplesFromMarkdown(markdown: string, deckPath: string): Sample[] {
  const samples: Sample[] = [];
  const deckDir = path.dirname(deckPath);
  
  // Find external file references using regex: ![alt text](file.ext)
  const fileRefPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = fileRefPattern.exec(markdown)) !== null) {
    const filePath = match[2];
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(deckDir, filePath);
    
    // Read the file (skip if file doesn't exist)
    let fileContent: string;
    try {
      fileContent = Deno.readTextFileSync(absolutePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // Skip missing files for samples
        continue;
      }
      throw error;
    }
    
    // Try to parse as TOML (skip if invalid)
    let tomlData: unknown;
    try {
      tomlData = parseTOML(fileContent);
    } catch (error) {
      // Skip files that aren't valid TOML
      continue;
    }
    
    // Look for [samples.*] sections
    if (typeof tomlData === 'object' && tomlData !== null && 'samples' in tomlData) {
      const samplesData = tomlData.samples as Record<string, unknown>;
      
      for (const [sampleId, sampleDef] of Object.entries(samplesData)) {
        if (typeof sampleDef !== 'object' || sampleDef === null) {
          continue;
        }
        
        const sample = sampleDef as SampleDefinition;
        
        // Extract messages if available
        if (sample.messages && Array.isArray(sample.messages)) {
          // Find the last user message for input
          let lastUserMessage = "";
          let lastAssistantMessage = "";
          
          for (const message of sample.messages) {
            if (message.role === "user") {
              lastUserMessage = message.content;
            } else if (message.role === "assistant") {
              lastAssistantMessage = message.content;
            }
          }
          
          // Only add sample if we have both user and assistant messages
          if (lastUserMessage && lastAssistantMessage) {
            samples.push({
              id: sampleId,
              input: lastUserMessage,
              expected: lastAssistantMessage,
              score: sample.score
            });
          }
        }
      }
    }
  }
  
  return samples;
}

function renderDeck(
  deckMarkdown: string, 
  context: Record<string, unknown>,
  extractedContext: ExtractedContext,
  openAiCompletionOptions: Record<string, unknown> = {}
): OpenAICompletionRequest {
  // Remove all ![alt](file) embeds from markdown to get clean system message
  const systemContent = deckMarkdown.replace(/!\[.*?\]\(.*?\)/g, '').trim();
  
  // Build messages array starting with system message
  const messages: Array<OpenAIMessage> = [
    { role: "system", content: systemContent }
  ];
  
  // Add context Q&A pairs
  for (const [key, value] of Object.entries(context)) {
    const definition = extractedContext[key];
    if (definition && definition.assistantQuestion) {
      messages.push(
        { role: "assistant", content: definition.assistantQuestion },
        { role: "user", content: String(value) }
      );
    }
  }
  
  // Return complete OpenAI request with options spread last
  return {
    messages,
    ...openAiCompletionOptions
  };
}

// Export functions and types for use by other modules
export { renderDeck };
export type { Sample };

export const renderCommand: Command = {
  name: "render",
  description: "Render a deck file to see the generated prompt structure",
  run: async (args: Array<string>) => {
    if (args.length === 0) {
      ui.printLn("Usage: aibff render <deck.md>");
      Deno.exit(1);
    }
    
    const deckPath = args[0];
    
    try {
      const deckContent = await Deno.readTextFile(deckPath);
      const extractedContext = extractContextFromMarkdown(deckContent, deckPath);
      
      // Build context values and warn for missing defaults
      const contextValues: Record<string, unknown> = {};
      for (const [key, definition] of Object.entries(extractedContext)) {
        if (definition.default !== undefined) {
          contextValues[key] = definition.default;
        } else {
          ui.printWarn(`Warning: Context variable '${key}' has no default value`);
          if (definition.description) {
            ui.printWarn(`  Description: ${definition.description}`);
          }
          if (definition.type) {
            ui.printWarn(`  Type: ${definition.type}`);
          }
        }
      }
      
      // Render the deck with context injection
      const openAiRequest = renderDeck(deckContent, contextValues, extractedContext, {});
      
      ui.printLn(JSON.stringify(openAiRequest, null, 2));
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        ui.printErr(`Error: File not found: ${deckPath}`);
      } else {
        ui.printErr(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      Deno.exit(1);
    }
  }
};

// Support direct execution for testing
if (import.meta.main) {
  await renderCommand.run(Deno.args);
}
