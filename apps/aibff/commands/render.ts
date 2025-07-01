#!/usr/bin/env -S deno run --allow-read

import type { Command } from "./types.ts";
import { parse as parseTOML } from "@std/toml";
import { extractToml as extractFrontmatter } from "@std/front-matter";
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
  assistantQuestion: string; // Required field
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
  messages?: Array<SampleMessage>;
}

interface OpenAIMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: Array<string>;
    };
  };
}

interface OpenAICompletionRequest {
  messages: Array<OpenAIMessage>;
  tools?: Array<OpenAITool>;
  [key: string]: unknown; // Additional OpenAI parameters
}

// Export for testing
export function extractContextFromMarkdown(
  markdown: string,
  deckPath: string,
  tomlReferences?: Array<{ filePath: string; basePath: string }>,
): ExtractedContext {
  const extractedContext: ExtractedContext = {};

  // If tomlReferences are provided, use them (for processed markdown)
  if (tomlReferences) {
    for (const ref of tomlReferences) {
      const baseDir = path.dirname(ref.basePath);
      const absolutePath = path.isAbsolute(ref.filePath)
        ? ref.filePath
        : path.join(baseDir, ref.filePath);

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
        throw new Error(
          `Invalid TOML in file ${absolutePath}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      // Process contexts from TOML
      processTomlContexts(tomlData, absolutePath, extractedContext);
    }
    return extractedContext;
  }

  // Original logic for unprocessed markdown
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

    // Only try to parse as TOML if it has a .toml extension
    if (!filePath.endsWith(".toml")) {
      continue; // Skip non-TOML files
    }

    // Try to parse as TOML (fail immediately if invalid TOML)
    let tomlData: unknown;
    try {
      tomlData = parseTOML(fileContent);
    } catch (error) {
      throw new Error(
        `Invalid TOML in file ${absolutePath}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    // Process contexts from TOML
    processTomlContexts(tomlData, absolutePath, extractedContext);
  }

  return extractedContext;
}

// Helper function to process contexts from TOML data
function processTomlContexts(
  tomlData: unknown,
  absolutePath: string,
  extractedContext: ExtractedContext,
): void {
  // Look for [contexts.*] sections (silently ignore other sections)
  if (
    typeof tomlData === "object" && tomlData !== null && "contexts" in tomlData
  ) {
    const contexts = tomlData.contexts as Record<string, unknown>;

    for (const [varName, contextDef] of Object.entries(contexts)) {
      if (typeof contextDef !== "object" || contextDef === null) {
        continue;
      }

      // Validate required assistantQuestion field
      if (
        !("assistantQuestion" in contextDef) ||
        typeof contextDef.assistantQuestion !== "string"
      ) {
        throw new Error(
          `Context variable '${varName}' in file ${absolutePath} is missing required 'assistantQuestion' field`,
        );
      }

      // Handle duplicate context variables
      if (varName in extractedContext) {
        ui.printWarn(
          `Warning: Context variable '${varName}' is defined in multiple files:`,
        );
        ui.printWarn(
          `  - Previously defined in: ${
            extractedContext[varName].sourceFile || "unknown"
          }`,
        );
        ui.printWarn(`  - Now redefined in: ${absolutePath}`);
        ui.printWarn(`  Using definition from: ${absolutePath}`);
      }

      // Extract context definition with source file tracking
      extractedContext[varName] = {
        ...contextDef as ContextDefinition,
        sourceFile: absolutePath,
      };
    }
  }
}

// Export for use by calibrate command
export function extractSamplesFromMarkdown(
  markdown: string,
  deckPath: string,
): Array<Sample> {
  const samples: Array<Sample> = [];
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

    // Only try to parse as TOML if it has a .toml extension
    if (!filePath.endsWith(".toml")) {
      continue; // Skip non-TOML files
    }

    // Try to parse as TOML (skip if invalid)
    let tomlData: unknown;
    try {
      tomlData = parseTOML(fileContent);
    } catch (_error) {
      // Skip files that aren't valid TOML
      continue;
    }

    // Look for [samples.*] sections
    if (
      typeof tomlData === "object" && tomlData !== null && "samples" in tomlData
    ) {
      const samplesData = tomlData.samples as Record<string, unknown>;

      for (const [sampleId, sampleDef] of Object.entries(samplesData)) {
        if (typeof sampleDef !== "object" || sampleDef === null) {
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
              score: sample.score,
            });
          }
        }
      }
    }
  }

  return samples;
}

interface ProcessedMarkdown {
  content: string;
  tomlReferences: Array<{ filePath: string; basePath: string }>;
  tools: Array<OpenAITool>;
}

function processMarkdownIncludes(
  markdown: string,
  basePath: string,
): ProcessedMarkdown {
  const deckDir = path.dirname(basePath);
  const tomlReferences: Array<{ filePath: string; basePath: string }> = [];
  const tools: Array<OpenAITool> = [];

  // Replace markdown includes with their content
  const content = markdown.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, _alt, filePath) => {
      // Track TOML references with their base path
      if (filePath.endsWith(".toml")) {
        tomlReferences.push({ filePath, basePath });
        return match; // Keep TOML references in the content
      }

      // Only process .deck.md files for inclusion
      if (!filePath.endsWith(".deck.md")) {
        return ""; // Remove other non-markdown includes
      }

      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(deckDir, filePath);

      try {
        const fileContent = Deno.readTextFileSync(absolutePath);

        // Extract tools from this file's frontmatter before processing includes
        const fileTools = extractToolsFromMarkdown(fileContent);
        tools.push(...fileTools);

        // Extract content without frontmatter
        let cleanFileContent: string;
        try {
          const { body } = extractFrontmatter(fileContent);
          cleanFileContent = body;
        } catch (_error) {
          // No frontmatter, use content as-is
          cleanFileContent = fileContent;
        }

        // Recursively process includes in the included file
        const processed = processMarkdownIncludes(
          cleanFileContent,
          absolutePath,
        );
        // Merge TOML references and tools from included files
        tomlReferences.push(...processed.tomlReferences);
        tools.push(...processed.tools);
        return processed.content;
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          throw new Error(`File not found: ${absolutePath}`);
        }
        throw error;
      }
    },
  );

  return { content, tomlReferences, tools };
}

function extractToolsFromMarkdown(markdown: string): Array<OpenAITool> {
  const tools: Array<OpenAITool> = [];

  // Extract all TOML frontmatter blocks (there might be multiple from embedded content)
  const tomlBlocks = markdown.match(/\+\+\+\n([\s\S]*?)\n\+\+\+/g);

  if (!tomlBlocks) {
    return tools;
  }

  for (const block of tomlBlocks) {
    // Remove the +++ delimiters
    const tomlContent = block.slice(4, -4);

    try {
      const tomlData = parseTOML(tomlContent);

      // Check if this TOML block contains tools
      if (tomlData.tools && Array.isArray(tomlData.tools)) {
        for (const tool of tomlData.tools) {
          if (tool.type === "function" && tool.function) {
            const openAITool: OpenAITool = {
              type: "function",
              function: {
                name: tool.function.name,
                description: tool.function.description,
                parameters: tool.function.parameters || {
                  type: "object",
                  properties: {},
                },
              },
            };
            tools.push(openAITool);
          }
        }
      }
    } catch (_error) {
      // Skip invalid TOML blocks - they might be context definitions
      continue;
    }
  }

  return tools;
}

function renderDeck(
  deckFileSystemPath: string,
  context: Record<string, unknown>,
  openAiCompletionOptions: Record<string, unknown> = {},
): OpenAICompletionRequest {
  // Read the deck file content
  const deckMarkdown = Deno.readTextFileSync(deckFileSystemPath);

  // Process markdown includes to build the full content first and extract tools
  const processed = processMarkdownIncludes(deckMarkdown, deckFileSystemPath);

  // Extract context definitions from the fully assembled markdown with proper path resolution
  const extractedContext = extractContextFromMarkdown(
    processed.content,
    deckFileSystemPath,
    processed.tomlReferences,
  );

  // Remove frontmatter and ![alt](file) embeds from markdown to get clean system message
  let systemContent: string;
  try {
    const { body } = extractFrontmatter(processed.content);
    systemContent = body;
  } catch (_error) {
    // No frontmatter, use content as-is
    systemContent = processed.content;
  }

  // Remove markdown embeds and clean up
  systemContent = systemContent
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove markdown embeds
    .trim();

  // Build messages array starting with system message
  const messages: Array<OpenAIMessage> = [
    { role: "system", content: systemContent },
  ];

  // Track which context variables were provided but not requested
  const unrequestedVars: Array<string> = [];
  const usedVars = new Set<string>();

  // Add context Q&A pairs in the order they were defined in the deck
  for (const [key, definition] of Object.entries(extractedContext)) {
    if (key in context && definition.assistantQuestion) {
      messages.push(
        { role: "assistant", content: definition.assistantQuestion },
        { role: "user", content: String(context[key]) },
      );
      usedVars.add(key);
    }
  }

  // Check for unrequested variables
  for (const key of Object.keys(context)) {
    if (!usedVars.has(key)) {
      unrequestedVars.push(key);
    }
  }

  // Warn about unrequested context variables
  if (unrequestedVars.length > 0) {
    ui.printWarn(
      `Warning: The following context variables were provided but not requested by the deck: ${
        unrequestedVars.join(", ")
      }`,
    );
  }

  // Return complete OpenAI request with options spread last
  const request: OpenAICompletionRequest = {
    messages,
    ...openAiCompletionOptions,
  };

  // Add tools if any were found
  if (processed.tools.length > 0) {
    request.tools = processed.tools;
  }

  return request;
}

// Export functions and types for use by other modules
export { processMarkdownIncludes, renderDeck };
export type { ProcessedMarkdown, Sample };

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
      const extractedContext = extractContextFromMarkdown(
        deckContent,
        deckPath,
      );

      // Build context values and warn for missing defaults
      const contextValues: Record<string, unknown> = {};
      for (const [key, definition] of Object.entries(extractedContext)) {
        if (definition.default !== undefined) {
          contextValues[key] = definition.default;
        } else {
          ui.printWarn(
            `Warning: Context variable '${key}' has no default value`,
          );
          if (definition.description) {
            ui.printWarn(`  Description: ${definition.description}`);
          }
          if (definition.type) {
            ui.printWarn(`  Type: ${definition.type}`);
          }
        }
      }

      // Render the deck with context injection
      const openAiRequest = renderDeck(deckPath, contextValues, {});

      ui.printLn(JSON.stringify(openAiRequest, null, 2));
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        ui.printErr(`Error: File not found: ${deckPath}`);
      } else {
        ui.printErr(
          `Error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      Deno.exit(1);
    }
  },
};

// Support direct execution for testing
if (import.meta.main) {
  await renderCommand.run(Deno.args);
}
