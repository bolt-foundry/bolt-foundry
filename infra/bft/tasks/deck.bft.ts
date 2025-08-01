#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { parse as parseTOML } from "@std/toml";
import * as path from "@std/path";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

interface OpenAIMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

interface OpenAICompletionRequest {
  messages: Array<OpenAIMessage>;
  [key: string]: unknown;
}

interface ContextDefinition {
  assistantQuestion: string;
  default?: unknown;
  description?: string;
  type?: string;
  [key: string]: unknown;
}

async function deck(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft deck <command> [args...]");
    ui.info("Commands:");
    ui.info(
      "  run <deck.md> [--context value]  - Run a deck with optional context",
    );
    ui.info(
      "  render <deck.md>                 - Render a deck file to OpenAI format",
    );
    ui.info("  list [path]                      - List available deck files");
    ui.info("  validate <deck.md>               - Validate deck syntax");
    return 1;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case "run":
      return await runDeck(commandArgs);
    case "render":
      return await renderDeck(commandArgs);
    case "list":
      return await listDecks(commandArgs);
    case "validate":
      return await validateDeck(commandArgs);
    default:
      ui.error(`Unknown deck command: ${command}`);
      return 1;
  }
}

async function runDeck(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft deck run <deck.md> [--key value ...]");
    ui.info(
      "Example: bft deck run grader.deck.md --userMessage 'hello' --assistantResponse 'hello world'",
    );
    return 1;
  }

  const deckPath = args[0];

  // Parse command line context arguments
  const contextValues: Record<string, string> = {};
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith("--") && i + 1 < args.length) {
      const key = args[i].slice(2);
      contextValues[key] = args[i + 1];
    }
  }

  try {
    const deckContent = await Deno.readTextFile(deckPath);

    // Extract frontmatter
    const frontmatterMatch = deckContent.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+/);
    let frontmatter: Record<string, unknown> = {};
    if (frontmatterMatch) {
      try {
        frontmatter = parseTOML(frontmatterMatch[1]);
      } catch (e) {
        ui.warn(`Failed to parse frontmatter: ${e}`);
      }
    }

    // Extract context definitions from embedded TOML files
    const contexts = await extractContextsFromDeck(deckContent, deckPath);

    // Build the OpenAI request with context injection
    const request = await buildDeckRequest(
      deckContent,
      deckPath,
      contexts,
      contextValues,
    );

    // For now, just show what would be sent
    ui.output("=== DECK EXECUTION PREVIEW ===");
    ui.output("Frontmatter: " + JSON.stringify(frontmatter, null, 2));
    ui.output("\nContext definitions found:");
    for (const [key, def] of Object.entries(contexts)) {
      ui.output(`  - ${key}: ${def.description || def.assistantQuestion}`);
      if (contextValues[key]) {
        ui.output(`    Value: ${contextValues[key]}`);
      } else if (def.default) {
        ui.output(`    Default: ${def.default}`);
      } else {
        ui.output(`    WARNING: No value provided`);
      }
    }
    ui.output("\nOpenAI Request:");
    ui.output(JSON.stringify(request, null, 2));

    ui.info("[In a real implementation, this would call the OpenAI API]");

    return 0;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      ui.error(`Deck file not found: ${deckPath}`);
    } else {
      ui.error(`${error instanceof Error ? error.message : String(error)}`);
    }
    return 1;
  }
}

async function extractContextsFromDeck(
  markdown: string,
  deckPath: string,
  visitedPaths: Set<string> = new Set(),
): Promise<Record<string, ContextDefinition>> {
  // Prevent infinite recursion
  if (visitedPaths.has(deckPath)) {
    return {};
  }
  visitedPaths.add(deckPath);

  const contexts: Record<string, ContextDefinition> = {};
  const deckDir = path.dirname(deckPath);

  // Find all file references
  const fileRefPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = fileRefPattern.exec(markdown)) !== null) {
    const filePath = match[2];
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(deckDir, filePath);

    try {
      // Handle included deck files recursively
      if (filePath.endsWith(".deck.md")) {
        const includedContent = await Deno.readTextFile(absolutePath);
        const includedContexts = await extractContextsFromDeck(
          includedContent,
          absolutePath,
          visitedPaths,
        );
        Object.assign(contexts, includedContexts);
      } // Handle TOML files with context definitions
      else if (filePath.endsWith(".toml")) {
        const tomlContent = await Deno.readTextFile(absolutePath);
        const tomlData = parseTOML(tomlContent) as Record<string, unknown>;

        // Look for contexts section
        if (tomlData.contexts && typeof tomlData.contexts === "object") {
          const contextsSection = tomlData.contexts as Record<string, unknown>;

          for (const [key, value] of Object.entries(contextsSection)) {
            if (
              typeof value === "object" && value !== null &&
              "assistantQuestion" in value
            ) {
              contexts[key] = value as ContextDefinition;
            }
          }
        }
      }
    } catch (e) {
      ui.warn(`Failed to process ${filePath}: ${e}`);
    }
  }

  return contexts;
}

async function buildDeckRequest(
  markdown: string,
  deckPath: string,
  contexts: Record<string, ContextDefinition>,
  contextValues: Record<string, string>,
): Promise<OpenAICompletionRequest> {
  // First, process markdown includes (deck files)
  const processedMarkdown = await processMarkdownIncludes(markdown, deckPath);

  // Remove embedded file references and frontmatter
  const systemContent = processedMarkdown
    .replace(/^\+\+\+[\s\S]*?\+\+\+\n/, "") // Remove frontmatter
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove file embeds
    .trim();

  const messages: Array<OpenAIMessage> = [
    { role: "system", content: systemContent },
  ];

  // Add context Q&A pairs
  for (const [key, def] of Object.entries(contexts)) {
    const value = contextValues[key] || def.default;
    if (value && def.assistantQuestion) {
      messages.push(
        { role: "assistant", content: def.assistantQuestion },
        { role: "user", content: String(value) },
      );
    }
  }

  return { messages };
}

async function processMarkdownIncludes(
  markdown: string,
  basePath: string,
): Promise<string> {
  const deckDir = path.dirname(basePath);

  // Replace markdown includes with their content
  const content = await replaceAsync(
    markdown,
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    async (_match: string, _alt: string, filePath: string) => {
      // Only process .deck.md files for inclusion
      if (!filePath.endsWith(".deck.md")) {
        return ""; // Remove non-deck includes from system content
      }

      const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(deckDir, filePath);

      try {
        const fileContent = await Deno.readTextFile(absolutePath);
        // Recursively process includes in the included file
        return await processMarkdownIncludes(fileContent, absolutePath);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          ui.warn(`Included deck not found: ${absolutePath}`);
          return "";
        }
        throw error;
      }
    },
  );

  return content;
}

// Helper function for async string replacement
async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: (match: string, ...args: Array<string>) => Promise<string>,
): Promise<string> {
  const promises: Array<Promise<string>> = [];
  const replacements: Array<{ start: number; end: number; text: string }> = [];

  let match;
  while ((match = regex.exec(str)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    promises.push(
      asyncFn(match[0], ...match.slice(1)).then((text) => {
        replacements.push({ start, end, text });
        return text;
      }),
    );
  }

  await Promise.all(promises);

  // Apply replacements in reverse order to maintain indices
  replacements.sort((a, b) => b.start - a.start);
  let result = str;
  for (const { start, end, text } of replacements) {
    result = result.slice(0, start) + text + result.slice(end);
  }

  return result;
}

async function renderDeck(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft deck render <deck.md>");
    return 1;
  }

  const deckPath = args[0];

  try {
    const deckContent = await Deno.readTextFile(deckPath);

    // Simple deck rendering - just extract system content
    // In a full implementation, this would handle includes, context injection, etc.
    const systemContent = deckContent
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove file embeds
      .trim();

    const request: OpenAICompletionRequest = {
      messages: [
        { role: "system", content: systemContent },
      ],
    };

    ui.output(JSON.stringify(request, null, 2));
    return 0;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      ui.error(`Deck file not found: ${deckPath}`);
    } else {
      ui.error(`${error instanceof Error ? error.message : String(error)}`);
    }
    return 1;
  }
}

async function listDecks(args: Array<string>): Promise<number> {
  const searchPath = args[0] || ".";

  ui.info(`Searching for deck files in: ${searchPath}`);
  ui.output("");

  let foundDecks = false;

  async function searchDirectory(dir: string, prefix = ""): Promise<void> {
    try {
      for await (const entry of Deno.readDir(dir)) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory && !entry.name.startsWith(".")) {
          await searchDirectory(fullPath, prefix + "  ");
        } else if (entry.isFile && entry.name.endsWith(".deck.md")) {
          ui.output(`${prefix}${fullPath}`);
          foundDecks = true;
        }
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.PermissionDenied)) {
        throw error;
      }
    }
  }

  try {
    await searchDirectory(searchPath);

    if (!foundDecks) {
      ui.info("No deck files found.");
    }

    return 0;
  } catch (error) {
    ui.error(`${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

async function validateDeck(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft deck validate <deck.md>");
    return 1;
  }

  const deckPath = args[0];

  try {
    const deckContent = await Deno.readTextFile(deckPath);

    // Basic validation checks
    const issues: Array<string> = [];

    // Check for proper markdown structure
    if (!deckContent.includes("#")) {
      issues.push("No headers found in deck");
    }

    // Check for file references
    const fileRefs = deckContent.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];
    for (const ref of fileRefs) {
      const match = ref.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const filePath = match[2];
        const absolutePath = path.isAbsolute(filePath)
          ? filePath
          : path.join(path.dirname(deckPath), filePath);

        try {
          await Deno.stat(absolutePath);
        } catch {
          issues.push(`Referenced file not found: ${filePath}`);
        }
      }
    }

    if (issues.length === 0) {
      ui.output(`✓ Deck is valid: ${deckPath}`);
      return 0;
    } else {
      ui.error(`✗ Deck has issues:`);
      for (const issue of issues) {
        ui.error(`  - ${issue}`);
      }
      return 1;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      ui.error(`Deck file not found: ${deckPath}`);
    } else {
      ui.error(`${error instanceof Error ? error.message : String(error)}`);
    }
    return 1;
  }
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Work with AI deck files",
  fn: deck,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2); // Skip "run" and script name
  Deno.exit(await deck(scriptArgs));
}
