/**
 * Deck class - minimal implementation for testing
 */
import * as path from "@std/path";
import { parse as parseToml } from "@std/toml";
import { extractToml } from "@std/front-matter";
class Deck {
  deckId: string;
  markdownContent: string;
  deckPath: string;
  frontmatter: Record<string, unknown>;

  // Processed data
  samples: Record<
    string,
    {
      messages: Array<{ role: string; content: string }>;
      score?: number;
      description?: string;
    }
  >;
  context: Record<string, { assistantQuestion: string }>;
  tools: Array<{ name: string; description: string }>;
  graders: Array<string>;

  constructor(deckId: string, markdownContent: string, deckPath: string) {
    this.deckId = deckId;
    this.deckPath = deckPath;

    // Extract frontmatter and store both
    try {
      const extracted = extractToml(markdownContent);
      this.frontmatter = extracted.attrs as Record<string, unknown>;
      this.markdownContent = extracted.body;
    } catch {
      // No frontmatter found, use original content
      this.frontmatter = {};
      this.markdownContent = markdownContent;
    }

    // Initialize processed data
    this.samples = {};
    this.context = {};
    this.tools = [];
    this.graders = (this.frontmatter.graders as Array<string>) || [];

    // Process includes to populate samples, context, and tools
    this.processIncludesForData();
  }

  render(
    _params: unknown,
    context: { context?: Record<string, unknown> } = {},
  ): {
    messages: Array<{ role: string; content: string }>;
    tools: Array<{ name: string; description: string }>;
  } {
    // Process markdown includes and collect context definitions
    const { processedContent, contextDefs } = this.processMarkdownIncludes(
      this.markdownContent,
      this.deckPath,
    );

    const messages = [
      {
        role: "system",
        content: processedContent,
      },
    ];

    // Add Q&A pairs for context variables
    for (const [varName, contextDef] of Object.entries(contextDefs)) {
      // Skip tools array when processing contexts
      if (varName === "tools") continue;

      const value = context.context?.[varName];
      if (
        value !== undefined && typeof contextDef === "object" &&
        "assistantQuestion" in contextDef
      ) {
        messages.push(
          {
            role: "assistant",
            content: contextDef.assistantQuestion,
          },
          {
            role: "user",
            content: String(value),
          },
        );
      }
    }

    return { messages, tools: contextDefs.tools || [] };
  }

  processMarkdownIncludes(content: string, basePath: string): {
    processedContent: string;
    contextDefs: Record<string, { assistantQuestion: string }> & {
      tools?: Array<{ name: string; description: string }>;
    };
  } {
    let processed = content;
    let hasIncludes = true;
    const contextDefs: Record<string, { assistantQuestion: string }> & {
      tools?: Array<{ name: string; description: string }>;
    } = {};

    // Keep processing until no more includes found
    while (hasIncludes) {
      const beforeReplace = processed;
      processed = processed.replace(
        /!\[.*?\]\((.*?)\)/g,
        (_match, filePath) => {
          try {
            // Resolve path relative to the base file's directory using proper path utilities
            const baseDir = path.dirname(basePath);
            const fullPath = path.isAbsolute(filePath)
              ? filePath
              : path.join(baseDir, filePath);
            const fileContent = Deno.readTextFileSync(fullPath);

            // Check if this is a TOML file
            if (filePath.endsWith(".toml")) {
              // Parse TOML using standard library
              const tomlData = parseToml(fileContent) as any;

              // Extract contexts
              if (tomlData.contexts) {
                Object.assign(contextDefs, tomlData.contexts);
              }

              // Extract tools
              if (tomlData.tools && Array.isArray(tomlData.tools)) {
                contextDefs.tools = (contextDefs.tools || []).concat(
                  tomlData.tools,
                );
              }

              // Remove TOML reference completely
              return "";
            } else {
              // Regular markdown include - recursively process it with correct base path
              const { processedContent, contextDefs: nestedContext } = this
                .processMarkdownIncludes(
                  fileContent,
                  fullPath,
                );
              // Merge nested context definitions
              Object.assign(contextDefs, nestedContext);
              return processedContent;
            }
          } catch (_error) {
            throw new Error(`File not found: ${filePath}`);
          }
        },
      );
      hasIncludes = processed !== beforeReplace;
    }

    // Clean up extra whitespace from TOML removals while preserving structure
    const cleanedContent = processed
      .replace(/\n\s*\n\s*\n/g, "\n\n"); // Multiple empty lines -> double newlines

    return { processedContent: cleanedContent, contextDefs };
  }

  private parseToml(content: string): {
    contexts: Record<string, { assistantQuestion: string }>;
    tools: Array<{ name: string; description: string }>;
    samples: Record<
      string,
      {
        messages: Array<{ role: string; content: string }>;
        score?: number;
        description?: string;
      }
    >;
  } {
    // Simple TOML parser for [contexts.varName], [[tools]], and samples sections
    const contexts: Record<string, { assistantQuestion: string }> = {};
    const tools: Array<{ name: string; description: string }> = [];
    const samples: Record<
      string,
      {
        messages: Array<{ role: string; content: string }>;
        score?: number;
        description?: string;
      }
    > = {};

    const lines = content.split("\n");
    let currentContext = "";
    let currentTool: { name?: string; description?: string } | null = null;
    let currentSample = "";
    let currentSampleMessage: { role?: string; content?: string } = {};
    let inToolsArray = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Match [[tools]]
      if (trimmed === "[[tools]]") {
        currentTool = {};
        inToolsArray = true;
        currentContext = "";
        continue;
      }

      // Match [contexts.varName]
      const contextMatch = trimmed.match(/^\[contexts\.(\w+)\]$/);
      if (contextMatch) {
        currentContext = contextMatch[1];
        inToolsArray = false;
        currentTool = null;
        continue;
      }

      // Match [tools.parameters] or other tool sections
      if (trimmed.startsWith("[tools.")) {
        // For now, we'll handle this in a simplified way
        continue;
      }

      // Handle tool properties
      if (inToolsArray && currentTool) {
        const nameMatch = trimmed.match(/^name\s*=\s*"(.+)"$/);
        if (nameMatch) {
          currentTool.name = nameMatch[1];
        }

        const descMatch = trimmed.match(/^description\s*=\s*"(.+)"$/);
        if (descMatch) {
          currentTool.description = descMatch[1];
        }

        // When we encounter a new section or end of tool, add to tools array
        if (
          trimmed.startsWith("[") && !trimmed.startsWith("[tools.") ||
          trimmed === ""
        ) {
          if (currentTool?.name && currentTool?.description) {
            tools.push({
              name: currentTool.name,
              description: currentTool.description,
            });
          }
          currentTool = null;
          inToolsArray = false;
        }
      }

      // Handle context properties
      if (currentContext && !inToolsArray) {
        const questionMatch = trimmed.match(/^assistantQuestion\s*=\s*"(.+)"$/);
        if (questionMatch) {
          contexts[currentContext] = { assistantQuestion: questionMatch[1] };
        }
      }
    }

    // Add final tool if we were in the middle of parsing one
    if (currentTool?.name && currentTool?.description) {
      tools.push({
        name: currentTool.name,
        description: currentTool.description,
      });
    }

    return { contexts, tools, samples };
  }

  /**
   * Get all samples from TOML includes in this deck
   */
  getAllSamples(): Record<
    string,
    {
      messages: Array<{ role: string; content: string }>;
      score?: number;
      description?: string;
    }
  > {
    const allSamples: Record<
      string,
      {
        messages: Array<{ role: string; content: string }>;
        score?: number;
        description?: string;
      }
    > = {};

    // Process markdown includes to extract samples from TOML files
    this.processMarkdownIncludesForSamples(
      this.markdownContent,
      this.deckPath,
      allSamples,
    );

    return allSamples;
  }

  /**
   * Get graders array from frontmatter
   */
  getGraders(): Array<string> {
    return (this.frontmatter.graders as Array<string>) || [];
  }

  /**
   * Process markdown includes to populate samples, context, and tools properties
   */
  private processIncludesForData(): void {
    // Use the existing processMarkdownIncludes logic but extract data
    const { contextDefs } = this.processMarkdownIncludes(
      this.markdownContent,
      this.deckPath,
    );

    // Extract context and tools from contextDefs
    for (const [key, value] of Object.entries(contextDefs)) {
      if (key === "tools" && Array.isArray(value)) {
        this.tools = value;
      } else if (typeof value === "object" && "assistantQuestion" in value) {
        this.context[key] = value;
      }
    }

    // Extract samples using the existing method
    this.processMarkdownIncludesForSamples(
      this.markdownContent,
      this.deckPath,
      this.samples,
    );
  }

  /**
   * Process markdown includes specifically for extracting samples
   */
  private processMarkdownIncludesForSamples(
    content: string,
    basePath: string,
    allSamples: Record<
      string,
      {
        messages: Array<{ role: string; content: string }>;
        score?: number;
        description?: string;
      }
    >,
  ): void {
    let processed = content;
    let hasIncludes = true;

    while (hasIncludes) {
      const beforeReplace = processed;
      processed = processed.replace(
        /!\[.*?\]\((.*?)\)/g,
        (_match, filePath) => {
          try {
            const baseDir = path.dirname(basePath);
            const fullPath = path.isAbsolute(filePath)
              ? filePath
              : path.join(baseDir, filePath);
            const fileContent = Deno.readTextFileSync(fullPath);

            // Check if this is a TOML file
            if (filePath.endsWith(".toml")) {
              // Parse TOML using standard library
              const tomlData = parseToml(fileContent) as any;

              // Extract samples
              if (tomlData.samples) {
                Object.assign(allSamples, tomlData.samples);
              }
            } else {
              // Recursively process markdown includes
              this.processMarkdownIncludesForSamples(
                fileContent,
                fullPath,
                allSamples,
              );
            }

            return "";
          } catch (error) {
            console.log(
              "Error processing include:",
              error instanceof Error ? error.message : String(error),
            );
            return "";
          }
        },
      );
      hasIncludes = processed !== beforeReplace;
    }
  }
}

/**
 * Read a local deck file and return a Deck instance
 * @param path Path to the .deck.md file
 * @returns Promise<Deck> A Deck instance
 */
export async function readLocalDeck(path: string): Promise<Deck> {
  // Read the file content
  const markdownContent = await Deno.readTextFile(path);

  // Extract deckId from filename (remove path and .deck.md extension)
  const filename = path.split("/").pop() || "";
  const deckId = filename.replace(".deck.md", "");

  return new Deck(deckId, markdownContent, path);
}
