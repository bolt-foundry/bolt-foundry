#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/tui/tui.ts";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import { parse as parseTOML } from "@std/toml";

interface ClaudeCommand {
  name: string;
  description: string;
  content: string;
}

async function claudify(_args: Array<string>): Promise<number> {
  ui.info("Generating Claude commands for all BFT tasks...");

  const tasksDir = join(import.meta.dirname!, ".");
  const claudeCommandsDir = join(
    import.meta.dirname!,
    "../../../.claude/commands/bft",
  );

  // Ensure the .claude/commands/bft directory exists
  await ensureDir(claudeCommandsDir);

  // Clean out existing files to avoid orphans
  try {
    for await (const entry of Deno.readDir(claudeCommandsDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        await Deno.remove(join(claudeCommandsDir, entry.name));
      }
    }
    ui.debug("Cleaned existing Claude command files");
  } catch (error) {
    ui.warn(`Failed to clean existing files: ${error}`);
  }

  const commands: Array<ClaudeCommand> = [];
  let generatedCount = 0;

  try {
    // Scan for all .bft.ts and .bft.deck.md files
    for await (const entry of Deno.readDir(tasksDir)) {
      if (entry.isFile) {
        if (entry.name.endsWith(".bft.ts")) {
          const taskName = entry.name.slice(0, -7); // Remove .bft.ts

          // Skip claudify itself to avoid recursion
          if (taskName === "claudify") {
            continue;
          }

          try {
            // Import the task to get its definition
            const modulePath = join(tasksDir, entry.name);
            const module = await import(modulePath);
            const taskDef = module.bftDefinition;

            if (taskDef && taskDef.description) {
              const command = generateCommandForTask(taskName, taskDef);
              commands.push(command);

              // Write the command file
              const commandPath = join(claudeCommandsDir, `${taskName}.md`);
              await Deno.writeTextFile(
                commandPath,
                formatClaudeCommand(command),
              );
              ui.output(`✓ Generated command for: ${taskName}`);
              generatedCount++;
            }
          } catch (error) {
            ui.warn(`Failed to process ${entry.name}: ${error}`);
          }
        } else if (entry.name.endsWith(".bft.deck.md")) {
          const taskName = entry.name.slice(0, -12); // Remove .bft.deck.md

          try {
            const deckPath = join(tasksDir, entry.name);
            const deckContent = await Deno.readTextFile(deckPath);

            // Extract frontmatter to get purpose
            const frontmatterMatch = deckContent.match(
              /^\+\+\+\n([\s\S]*?)\n\+\+\+/,
            );
            let purpose = `Run ${taskName} AI deck`;

            if (frontmatterMatch) {
              try {
                const frontmatter = parseTOML(frontmatterMatch[1]) as Record<
                  string,
                  unknown
                >;
                if (
                  frontmatter.meta && typeof frontmatter.meta === "object" &&
                  "purpose" in frontmatter.meta
                ) {
                  purpose = String(frontmatter.meta.purpose);
                }
              } catch (e) {
                ui.debug(`Failed to parse frontmatter for ${entry.name}: ${e}`);
              }
            }

            const command = await generateCommandForDeck(
              taskName,
              purpose,
              deckPath,
            );
            commands.push(command);

            // Write the command file
            const commandPath = join(claudeCommandsDir, `${taskName}.md`);
            await Deno.writeTextFile(commandPath, formatClaudeCommand(command));
            ui.output(`✓ Generated command for deck: ${taskName}`);
            generatedCount++;
          } catch (error) {
            ui.warn(`Failed to process deck ${entry.name}: ${error}`);
          }
        }
      }
    }

    // Also generate a help command
    const helpCommand: ClaudeCommand = {
      name: "bft-help",
      description: "Show all available BFT tasks",
      content: "Show all available BFT tasks",
    };

    const helpPath = join(claudeCommandsDir, "help.md");
    await Deno.writeTextFile(helpPath, formatClaudeCommand(helpCommand));
    ui.output("✓ Generated command for: help");
    generatedCount++;

    ui.info(
      `\nSuccessfully generated ${generatedCount} Claude commands in ${claudeCommandsDir}`,
    );
    return 0;
  } catch (error) {
    ui.error(`Failed to generate Claude commands: ${error}`);
    return 1;
  }
}

function generateCommandForTask(
  taskName: string,
  taskDef: TaskDefinition,
): ClaudeCommand {
  const name = `bft-${taskName}`;
  const description = taskDef.description;

  let content = `${description}\n\n`;

  // Add specific guidance for known tasks
  switch (taskName) {
    case "deck":
      content += `Available subcommands:
- run <deck.md> [--context value] - Run a deck with optional context
- render <deck.md> - Render a deck file to OpenAI format  
- list [path] - List available deck files
- validate <deck.md> - Validate deck syntax`;
      break;

    case "echo":
      content += `Echo command - outputs provided arguments`;
      break;

    case "run":
      content += `Execute a .bft.ts script file.`;
      break;

    default:
      content += `Execute bft ${taskName} command`;
  }

  return { name, description, content };
}

async function generateCommandForDeck(
  taskName: string,
  purpose: string,
  deckPath: string,
): Promise<ClaudeCommand> {
  const name = `bft-${taskName}`;
  const description = purpose;

  // Use aibff render to get the full deck content in markdown format
  let deckContent = "";
  try {
    const renderProcess = new Deno.Command("bft", {
      args: ["aibff", "render", deckPath, "--format", "markdown"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await renderProcess.output();

    if (code === 0) {
      deckContent = new TextDecoder().decode(stdout);
    } else {
      const errorText = new TextDecoder().decode(stderr);
      ui.warn(`Failed to render deck ${deckPath}: ${errorText}`);
      // Fall back to simple parameter extraction
      deckContent = await fallbackDeckContent(taskName, deckPath);
    }
  } catch (error) {
    ui.warn(`Failed to run aibff render for ${deckPath}: ${error}`);
    // Fall back to simple parameter extraction
    deckContent = await fallbackDeckContent(taskName, deckPath);
  }

  const content = `${description}\n\n${deckContent}`;

  return { name, description, content };
}

async function fallbackDeckContent(
  taskName: string,
  deckPath: string,
): Promise<string> {
  // Try to extract context parameters from TOML file
  const contextParams = await getContextParamsForDeck(taskName, deckPath);

  let content = "";
  if (contextParams.length > 0) {
    content += `This deck accepts the following parameters:\n`;
    for (const param of contextParams) {
      content += `- ${param.name}: ${param.description}\n`;
    }
    content += `\nAsk the user for any needed context parameters.`;
  }

  return content;
}

interface ContextParam {
  name: string;
  description: string;
  required: boolean;
}

async function getContextParamsForDeck(
  _taskName: string,
  deckPath: string,
): Promise<Array<ContextParam>> {
  // Try to find associated context TOML file
  const possibleTomlPaths = [
    deckPath.replace(".bft.deck.md", "-context.toml"),
    deckPath.replace(".bft.deck.md", ".toml"),
  ];

  for (const tomlPath of possibleTomlPaths) {
    try {
      const tomlContent = await Deno.readTextFile(tomlPath);
      const tomlData = parseTOML(tomlContent) as Record<string, unknown>;

      if (tomlData.contexts && typeof tomlData.contexts === "object") {
        const contexts = tomlData.contexts as Record<string, unknown>;
        const params: Array<ContextParam> = [];

        for (const [key, value] of Object.entries(contexts)) {
          if (typeof value === "object" && value !== null) {
            const ctx = value as Record<string, unknown>;
            params.push({
              name: key,
              description: String(
                ctx.description || ctx.assistantQuestion || key,
              ),
              required: !("default" in ctx),
            });
          }
        }

        return params;
      }
    } catch {
      // File doesn't exist or can't be parsed, continue
    }
  }

  return [];
}

function formatClaudeCommand(command: ClaudeCommand): string {
  return `---
name: ${command.name}
description: ${command.description}
---

${command.content}
`;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Generate Claude commands for all BFT tasks",
  aiSafe: true,
  fn: claudify,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2); // Skip "run" and script name
  Deno.exit(await claudify(scriptArgs));
}
