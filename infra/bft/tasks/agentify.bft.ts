#!/usr/bin/env -S bft run

import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { ensureDir } from "@std/fs";
import { parse as parseTOML } from "@std/toml";

interface AgentCommand {
  name: string;
  description: string;
  content: string;
}

async function agentify(_args: Array<string>): Promise<number> {
  ui.info("Generating agent commands and configuration...");

  const tasksDir =
    new URL(import.meta.resolve("@bfmono/infra/bft/tasks/")).pathname;
  const agentsDir =
    new URL(import.meta.resolve("@bfmono/.agents/commands/bft/")).pathname;
  const claudeDir =
    new URL(import.meta.resolve("@bfmono/.claude/commands/bft/")).pathname;
  const claudeTasksDir =
    new URL(import.meta.resolve("@bfmono/.claude/commands/bft-tasks/"))
      .pathname;

  // Clean up old infrastructure
  try {
    await Deno.remove(claudeDir, { recursive: true });
    ui.debug("Removed existing .claude/commands/bft directory");
  } catch {
    // Directory doesn't exist, which is fine
  }

  try {
    await Deno.remove(claudeTasksDir, { recursive: true });
    ui.debug("Removed existing .claude/commands/bft-tasks directory");
  } catch {
    // Directory doesn't exist, which is fine
  }

  // Ensure the .agents/commands/bft directory exists
  await ensureDir(agentsDir);

  // Clean out existing files to avoid orphans
  try {
    for await (const entry of Deno.readDir(agentsDir)) {
      if (entry.isFile) {
        await Deno.remove(new URL(entry.name, `file://${agentsDir}`).pathname);
      }
    }
    ui.debug("Cleaned existing agent command files");
  } catch (error) {
    ui.warn(`Failed to clean existing files: ${error}`);
  }

  const commands: Array<AgentCommand> = [];
  let generatedCount = 0;

  try {
    // Scan for all .bft.ts and .bft.deck.md files
    for await (const entry of Deno.readDir(tasksDir)) {
      if (entry.isFile) {
        if (entry.name.endsWith(".bft.ts")) {
          const taskName = entry.name.slice(0, -7); // Remove .bft.ts

          // Skip agentify itself to avoid recursion
          if (taskName === "agentify") {
            continue;
          }

          try {
            // Import the task to get its definition
            const modulePath = new URL(
              import.meta.resolve(`@bfmono/infra/bft/tasks/${entry.name}`),
            ).pathname;
            const module = await import(modulePath);
            const taskDef = module.bftDefinition;

            if (taskDef && taskDef.description) {
              const command = generateCommandForTask(taskName, taskDef);
              commands.push(command);

              // Write the command file
              const commandPath =
                new URL(`${taskName}.md`, `file://${agentsDir}`).pathname;
              await Deno.writeTextFile(
                commandPath,
                formatAgentCommand(command),
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
            const deckPath = new URL(
              import.meta.resolve(`@bfmono/infra/bft/tasks/${entry.name}`),
            ).pathname;
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
            const commandPath =
              new URL(`${taskName}.md`, `file://${agentsDir}`).pathname;
            await Deno.writeTextFile(commandPath, formatAgentCommand(command));
            ui.output(`✓ Generated command for deck: ${taskName}`);
            generatedCount++;
          } catch (error) {
            ui.warn(`Failed to process deck ${entry.name}: ${error}`);
          }
        }
      }
    }

    // Generate AGENTS.md file
    await generateAgentsMd(agentsDir);
    ui.output("✓ Generated AGENTS.md");

    // Also generate a help command
    const helpCommand: AgentCommand = {
      name: "bft-help",
      description: "Show all available BFT tasks",
      content: "Show all available BFT tasks",
    };

    const helpPath = new URL("help.md", `file://${agentsDir}`).pathname;
    await Deno.writeTextFile(helpPath, formatAgentCommand(helpCommand));
    ui.output("✓ Generated command for: help");
    generatedCount++;

    // Create symlinks
    await createSymlinks(agentsDir);

    ui.info(
      `\nSuccessfully generated ${
        generatedCount + 1
      } agent commands in ${agentsDir}`,
    );
    return 0;
  } catch (error) {
    ui.error(`Failed to generate agent commands: ${error}`);
    return 1;
  }
}

function generateCommandForTask(
  taskName: string,
  taskDef: TaskDefinition,
): AgentCommand {
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
): Promise<AgentCommand> {
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

async function generateAgentsMd(agentsDir: string): Promise<void> {
  const agentsMdPath =
    new URL(import.meta.resolve("@bfmono/AGENTS.md")).pathname;
  const agentsMdContent = await Deno.readTextFile(agentsMdPath);

  const targetPath = new URL("AGENTS.md", `file://${agentsDir}`).pathname;
  await Deno.writeTextFile(targetPath, agentsMdContent);
}

async function createSymlinks(agentsDir: string): Promise<void> {
  const repoRoot = new URL(import.meta.resolve("@bfmono/")).pathname;

  // Create .claude/commands/bft symlink
  const claudeDir =
    new URL(".claude/commands/bft", `file://${repoRoot}`).pathname;
  try {
    await Deno.symlink(agentsDir, claudeDir);
    ui.output("✓ Created symlink: .claude/commands/bft → .agents/commands/bft");
  } catch (error) {
    ui.warn(`Failed to create .claude symlink: ${error}`);
  }

  // Create AGENTS.md symlink
  const agentsMdSource = new URL("AGENTS.md", `file://${agentsDir}`).pathname;
  const agentsMdTarget = new URL("AGENTS.md", `file://${repoRoot}`).pathname;
  try {
    await Deno.remove(agentsMdTarget);
  } catch {
    // File doesn't exist, which is fine
  }
  try {
    await Deno.symlink(agentsMdSource, agentsMdTarget);
    ui.output("✓ Created symlink: AGENTS.md → .agents/commands/bft/AGENTS.md");
  } catch (error) {
    ui.warn(`Failed to create AGENTS.md symlink: ${error}`);
  }

  // Create CLAUDE.md symlink
  const claudeMdTarget = new URL("CLAUDE.md", `file://${repoRoot}`).pathname;
  try {
    await Deno.remove(claudeMdTarget);
  } catch {
    // File doesn't exist, which is fine
  }
  try {
    await Deno.symlink(agentsMdSource, claudeMdTarget);
    ui.output("✓ Created symlink: CLAUDE.md → .agents/commands/bft/AGENTS.md");
  } catch (error) {
    ui.warn(`Failed to create CLAUDE.md symlink: ${error}`);
  }
}

function formatAgentCommand(command: AgentCommand): string {
  return `---
name: ${command.name}
description: ${command.description}
---

${command.content}
`;
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Generate agent commands and configuration for all BFT tasks",
  aiSafe: true,
  fn: agentify,
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2); // Skip "run" and script name
  Deno.exit(await agentify(scriptArgs));
}
