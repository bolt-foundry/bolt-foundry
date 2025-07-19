/**
 * Deck class - minimal implementation for testing
 */
class Deck {
  deckId: string;
  markdownContent: string;
  deckPath: string;

  constructor(deckId: string, markdownContent: string, deckPath: string) {
    this.deckId = deckId;
    this.markdownContent = markdownContent;
    this.deckPath = deckPath;
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

  private processMarkdownIncludes(content: string, basePath: string): {
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
            // Resolve path relative to the base file's directory
            const baseDir = basePath.substring(0, basePath.lastIndexOf("/"));
            const fullPath = `${baseDir}/${filePath}`;
            const fileContent = Deno.readTextFileSync(fullPath);

            // Check if this is a TOML file
            if (filePath.endsWith(".toml")) {
              // Parse TOML and extract context definitions and tools
              const tomlData = this.parseToml(fileContent);
              if (tomlData.contexts) {
                Object.assign(contextDefs, tomlData.contexts);
              }
              if (tomlData.tools) {
                contextDefs.tools = (contextDefs.tools || []).concat(
                  tomlData.tools,
                );
              }
              // Remove TOML reference from content (return empty, whitespace will be cleaned up)
              return "";
            } else {
              // Regular markdown include
              return fileContent;
            }
          } catch (_error) {
            throw new Error(`File not found: ${filePath}`);
          }
        },
      );
      hasIncludes = processed !== beforeReplace;
    }

    // Clean up extra whitespace from removed TOML references
    const cleanedContent = processed.replace(/\n\s*\n\s*\n/g, "\n\n");

    return { processedContent: cleanedContent, contextDefs };
  }

  private parseToml(content: string): {
    contexts: Record<string, { assistantQuestion: string }>;
    tools: Array<{ name: string; description: string }>;
  } {
    // Simple TOML parser for [contexts.varName] and [[tools]] sections
    const contexts: Record<string, { assistantQuestion: string }> = {};
    const tools: Array<{ name: string; description: string }> = [];

    const lines = content.split("\n");
    let currentContext = "";
    let currentTool: { name?: string; description?: string } | null = null;
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

    return { contexts, tools };
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
