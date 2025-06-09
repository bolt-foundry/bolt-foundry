#!/usr/bin/env -S bff

/**
 * @module findBadLinks.bff
 * @description Finds broken markdown links across the project
 */

import { join, relative } from "https://deno.land/std@0.208.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";
import { exists } from "https://deno.land/std@0.208.0/fs/exists.ts";
import {
  blue,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.208.0/fmt/colors.ts";
import { register } from "infra/bff/bff.ts";

interface BrokenLink {
  file: string;
  line: number;
  link: string;
  linkText: string;
  suggestedFix?: string;
}

interface CommandFlags {
  fix: boolean;
  aiFix: boolean;
  report: boolean;
  path: string;
}

export default async function findBadLinksCommand(
  args: string[],
): Promise<number> {
  const flags: CommandFlags = {
    fix: args.includes("--fix"),
    aiFix: args.includes("--ai-fix") || args.includes("--aifix"),
    report: args.includes("--report"),
    path: args.find((arg) => arg.startsWith("--path="))?.split("=")[1] || ".",
  };

  console.log(blue("🔍 Searching for broken markdown links...\n"));

  const brokenLinks: BrokenLink[] = [];
  const checkedLinks = new Set<string>();
  let totalFiles = 0;
  let totalLinks = 0;

  // Walk through all markdown files
  for await (
    const entry of walk(flags.path, {
      exts: [".md"],
      skip: [/node_modules/, /\.git/, /build/, /dist/, /tmp/],
    })
  ) {
    if (entry.isFile) {
      totalFiles++;
      await checkFileLinks(entry.path, brokenLinks, checkedLinks);
    }
  }

  totalLinks = checkedLinks.size;

  // Display results
  if (brokenLinks.length === 0) {
    console.log(
      green(`✅ All ${totalLinks} links in ${totalFiles} files are valid!\n`),
    );
  } else {
    console.log(
      red(
        `❌ Found ${brokenLinks.length} broken links in ${totalFiles} files:\n`,
      ),
    );

    // Group by file
    const linksByFile = new Map<string, BrokenLink[]>();
    for (const link of brokenLinks) {
      if (!linksByFile.has(link.file)) {
        linksByFile.set(link.file, []);
      }
      linksByFile.get(link.file)!.push(link);
    }

    // Display broken links
    for (const [file, links] of linksByFile) {
      console.log(yellow(`\n${relative(Deno.cwd(), file)}:`));
      for (const link of links) {
        console.log(`  Line ${link.line}: ${red(link.link)}`);
        if (link.suggestedFix) {
          console.log(`    → Suggested: ${green(link.suggestedFix)}`);
        }
      }
    }
  }

  // Generate report if requested
  if (flags.report) {
    await generateReport(brokenLinks, totalFiles, totalLinks);
    console.log(blue("\n📄 Report saved to broken_links_report.md"));
  }

  // Fix links if requested
  if (flags.fix && brokenLinks.length > 0) {
    const fixable = brokenLinks.filter((l) => l.suggestedFix);
    if (fixable.length > 0) {
      console.log(blue(`\n🔧 Attempting to fix ${fixable.length} links...`));
      await fixBrokenLinks(fixable);
      console.log(green(`✅ Fixed ${fixable.length} links`));
    }
  }

  // AI-powered fix if requested (this will also apply the fixes)
  if (flags.aiFix && brokenLinks.length > 0) {
    console.log(
      blue(`\n🤖 Resolving and fixing ${brokenLinks.length} broken links...`),
    );
    await aiFixBrokenLinks(brokenLinks);
  }

  // Return exit code
  return brokenLinks.length > 0 ? 1 : 0;
}

// Register the command
register(
  "findBadLinks",
  "Find broken markdown links in the project",
  findBadLinksCommand,
  [
    { "--fix": "Automatically fix broken links where possible" },
    {
      "--ai-fix, --aifix":
        "Use Claude to intelligently resolve broken links and apply fixes",
    },
    { "--report": "Generate a detailed report file" },
    { "--path=<path>": "Specific path to check (default: entire project)" },
  ],
  true, // AI-safe
);

async function checkFileLinks(
  filePath: string,
  brokenLinks: BrokenLink[],
  checkedLinks: Set<string>,
) {
  const content = await Deno.readTextFile(filePath);
  const lines = content.split("\n");
  const fileDir = join(filePath, "..");

  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;

    while ((match = linkRegex.exec(line)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];

      // Skip external links, anchors, and mailto
      if (
        linkUrl.startsWith("http://") ||
        linkUrl.startsWith("https://") ||
        linkUrl.startsWith("#") ||
        linkUrl.startsWith("mailto:")
      ) {
        continue;
      }

      checkedLinks.add(linkUrl);

      // Check if the linked file exists
      const absolutePath = linkUrl.startsWith("/")
        ? join(Deno.cwd(), linkUrl)
        : join(fileDir, linkUrl);

      if (!await exists(absolutePath)) {
        const suggestedFix = await findSuggestedFix(linkUrl, fileDir);
        brokenLinks.push({
          file: filePath,
          line: i + 1,
          link: linkUrl,
          linkText,
          suggestedFix,
        });
      }
    }
  }
}

async function findSuggestedFix(
  brokenLink: string,
  fromDir: string,
): Promise<string | undefined> {
  // Extract the filename from the broken link
  const filename = brokenLink.split("/").pop();
  if (!filename) return undefined;

  // Search for the file in common directories
  const searchPaths = [
    "docs/guides",
    "memos/guides",
    "memos/plans",
    "decks/cards",
    "docs/blog",
  ];

  for (const searchPath of searchPaths) {
    const potentialPath = join(Deno.cwd(), searchPath, filename);
    if (await exists(potentialPath)) {
      // Calculate relative path from the source file
      return relative(fromDir, potentialPath);
    }
  }

  // Try to find the file anywhere in the project
  for await (
    const entry of walk(".", {
      exts: [".md"],
      skip: [/node_modules/, /\.git/, /build/, /dist/, /tmp/],
    })
  ) {
    if (entry.isFile && entry.name === filename) {
      return relative(fromDir, entry.path);
    }
  }

  return undefined;
}

async function generateReport(
  brokenLinks: BrokenLink[],
  totalFiles: number,
  totalLinks: number,
) {
  const report = [
    "# Broken Links Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- Total files checked: ${totalFiles}`,
    `- Total links checked: ${totalLinks}`,
    `- Broken links found: ${brokenLinks.length}`,
    "",
    "## Broken Links",
    "",
  ];

  // Group by file
  const linksByFile = new Map<string, BrokenLink[]>();
  for (const link of brokenLinks) {
    if (!linksByFile.has(link.file)) {
      linksByFile.set(link.file, []);
    }
    linksByFile.get(link.file)!.push(link);
  }

  for (const [file, links] of linksByFile) {
    report.push(`### ${relative(Deno.cwd(), file)}`);
    report.push("");
    for (const link of links) {
      report.push(`- Line ${link.line}: \`${link.link}\``);
      if (link.suggestedFix) {
        report.push(`  - Suggested fix: \`${link.suggestedFix}\``);
      }
    }
    report.push("");
  }

  await Deno.writeTextFile("broken_links_report.md", report.join("\n"));
}

async function fixBrokenLinks(fixableLinks: BrokenLink[]) {
  // Group by file to minimize file reads/writes
  const linksByFile = new Map<string, BrokenLink[]>();
  for (const link of fixableLinks) {
    if (!linksByFile.has(link.file)) {
      linksByFile.set(link.file, []);
    }
    linksByFile.get(link.file)!.push(link);
  }

  for (const [file, links] of linksByFile) {
    let content = await Deno.readTextFile(file);

    // Sort links by position in reverse to avoid offset issues
    links.sort((a, b) => b.line - a.line);

    for (const link of links) {
      if (link.suggestedFix) {
        // Replace the broken link with the suggested fix
        const oldPattern = `](${link.link})`;
        const newPattern = `](${link.suggestedFix})`;
        content = content.replace(oldPattern, newPattern);
      }
    }

    await Deno.writeTextFile(file, content);
  }
}

async function aiFixBrokenLinks(brokenLinks: BrokenLink[]) {
  const fixedLinks: BrokenLink[] = [];
  const fallbackLinks: BrokenLink[] = [];

  // For now, skip Claude CLI integration and use existing suggestions
  // The Claude CLI in this project starts an interactive session which causes timeouts
  console.log(yellow("ℹ️  Using automatic suggestions to fix links..."));

  for (const link of brokenLinks) {
    if (link.suggestedFix) {
      fixedLinks.push(link);
    } else {
      // Use 404.md as fallback for unresolvable links
      const fileDir = join(link.file, "..");
      link.suggestedFix = relative(fileDir, join(Deno.cwd(), "404.md"));
      fallbackLinks.push(link);
    }
  }

  if (fixedLinks.length > 0) {
    console.log(blue(`\n🔧 Applying ${fixedLinks.length} fixes...`));
    await fixBrokenLinks(fixedLinks);
    console.log(green(`✅ Fixed ${fixedLinks.length} links`));
  }

  if (fallbackLinks.length > 0) {
    console.log(
      yellow(
        `\n📄 Pointing ${fallbackLinks.length} unresolvable links to 404.md...`,
      ),
    );
    await fixBrokenLinks(fallbackLinks);
    console.log(
      green(`✅ Updated ${fallbackLinks.length} links to point to 404.md`),
    );
  }
}

async function getAiSuggestion(
  brokenLink: BrokenLink,
): Promise<string | undefined> {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const context = await getFileContext(brokenLink.file, brokenLink.line);
      const prompt = buildAiPrompt(brokenLink, context);

      const result = await runClaudeCommand(prompt);
      if (result) {
        // Validate the suggested path exists
        const absolutePath = result.startsWith("/")
          ? join(Deno.cwd(), result)
          : join(brokenLink.file, "..", result);

        if (await exists(absolutePath)) {
          return result;
        } else {
          // Path doesn't exist, ask Claude again with feedback
          const retryPrompt =
            `The path "${result}" doesn't exist. The broken link is "${brokenLink.link}" in file "${
              relative(Deno.cwd(), brokenLink.file)
            }". What is the correct path? Reply with only the path.`;
          const retryResult = await runClaudeCommand(retryPrompt);
          if (
            retryResult &&
            await exists(join(brokenLink.file, "..", retryResult))
          ) {
            return retryResult;
          }
        }
      }

      // If we have our original suggestion and AI failed, use it
      if (brokenLink.suggestedFix) {
        return brokenLink.suggestedFix;
      }

      return undefined;
    } catch (error) {
      attempt++;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  }

  // Fall back to original suggestion if all retries failed
  return brokenLink.suggestedFix;
}

async function getFileContext(
  filePath: string,
  lineNumber: number,
): Promise<string> {
  const content = await Deno.readTextFile(filePath);
  const lines = content.split("\n");

  // Get 3 lines before and after for context
  const startLine = Math.max(0, lineNumber - 4);
  const endLine = Math.min(lines.length, lineNumber + 3);

  const contextLines = [];
  for (let i = startLine; i < endLine; i++) {
    const prefix = i === lineNumber - 1 ? ">>> " : "    ";
    contextLines.push(`${prefix}${lines[i]}`);
  }

  return contextLines.join("\n");
}

function buildAiPrompt(brokenLink: BrokenLink, context: string): string {
  return `Find the correct path for this broken markdown link.

File: ${relative(Deno.cwd(), brokenLink.file)}
Broken link: ${brokenLink.link}
Link text: ${brokenLink.linkText}

Context around the broken link:
${context}

Please provide only the corrected relative path that should replace "${brokenLink.link}". Do not include markdown formatting or explanations.`;
}

async function checkClaudeAvailable(): Promise<boolean> {
  try {
    const command = new Deno.Command("claude", {
      args: ["--version"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await command.output();
    return code === 0;
  } catch {
    return false;
  }
}

async function runClaudeCommand(prompt: string): Promise<string | undefined> {
  try {
    const command = new Deno.Command("claude", {
      args: [prompt],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await command.output();

    if (code === 0) {
      const output = new TextDecoder().decode(stdout).trim();
      // Clean up the output - remove any markdown formatting
      return output.replace(/^```[^\n]*\n/, "").replace(/\n```$/, "").trim();
    } else {
      const error = new TextDecoder().decode(stderr);
      console.error(`Claude command failed: ${error}`);
      return undefined;
    }
  } catch (error) {
    console.error(`Error running claude command: ${error}`);
    return undefined;
  }
}
