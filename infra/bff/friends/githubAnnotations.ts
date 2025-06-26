#! /usr/bin/env -S bff

// infra/bff/friends/githubAnnotations.ts

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runShellCommandWithOutput } from "@bfmono/infra/bff/shellBase.ts";

const logger = getLogger(import.meta);

/**
 * Print a GitHub Actions annotation line.
 * See: https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
 */
export function printGitHubAnnotation(
  type: "error" | "warning",
  msg: string,
  file?: string,
  line?: number,
  col?: number,
) {
  const escape = (s: string) =>
    s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  let annotation = `::${type}`;
  if (file) annotation += ` file=${file}`;
  // GitHub annotations are 1-indexed, ensure our numbers are as well
  if (typeof line === "number") annotation += `,line=${line}`;
  if (typeof col === "number") annotation += `,col=${col}`;
  annotation += `::${escape(msg)}`;
  // deno-lint-ignore no-console
  console.log(annotation);
}

/**
 * Remove lines that begin with "↱", as they clutter your annotation messages.
 */
function stripArrowLines(msg: string): string {
  return msg
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("↱"))
    .join("\n")
    .trim();
}

/**
 * Strip `file://` prefix and, if GITHUB_WORKSPACE is set, make it relative.
 */
function normalizeFilePath(filename?: string): string {
  if (!filename) return "unknown.ts";

  let out = filename.replace(/^file:\/\//, "");
  const workspace = getConfigurationVariable("GITHUB_WORKSPACE");
  // In Replit, use the workspace directory structure
  const replWorkspace = "/home/runner/workspace";

  if (workspace && out.startsWith(workspace)) {
    // Remove leading slash after the workspace path, e.g. "/home/runner/work/... -> infra/bff/..."
    out = out.slice(workspace.length).replace(/^\/+/, "");
  } else if (out.startsWith(replWorkspace)) {
    // For Replit environments
    out = out.slice(replWorkspace.length).replace(/^\/+/, "");
  }

  // Ensure we're not returning an empty string
  return out || filename || "unknown.ts";
}

/**
 * Run `deno lint --json`, parse the JSON (which is a single object),
 * and emit GitHub Annotations for each diagnostic + error.
 */
export async function runLintWithGithubAnnotations(): Promise<number> {
  let code = 0;
  try {
    const { stdout: output } = await runShellCommandWithOutput(
      ["deno", "lint", "--json"],
      {},
      /* useSpinner= */ false,
      /* silent= */ true,
    );
    const parsed = JSON.parse(output); // shape: { diagnostics: [...], errors: [...], ... }

    // 1) diagnostics
    for (const diag of parsed.diagnostics ?? []) {
      const filePath = normalizeFilePath(diag.location?.filename);
      const start = diag.location?.range?.start;
      const line = (typeof start?.line === "number")
        ? start.line + 1
        : undefined;
      const col = (typeof start?.character === "number")
        ? start.character + 1
        : undefined;
      const message = stripArrowLines(diag.message);
      printGitHubAnnotation("error", message, filePath, line, col);
      code = 1;
    }

    // 2) errors
    for (const err of parsed.errors ?? []) {
      const filePath = normalizeFilePath(err.location?.filename);
      const start = err.location?.range?.start;
      const line = (typeof start?.line === "number")
        ? start.line + 1
        : undefined;
      const col = (typeof start?.character === "number")
        ? start.character + 1
        : undefined;
      const message = stripArrowLines(err.message ?? "Unknown lint error");
      printGitHubAnnotation("error", message, filePath, line, col);
      code = 1;
    }
  } catch (err) {
    logger.error("Error parsing deno lint --json output:", err);
    code = 1;
  }
  return code;
}

/**
 * Run `deno test --json` line-by-line and emit GitHub Annotations for failing tests.
 */
export async function runTestWithGithubAnnotations(): Promise<number> {
  let code = 0;
  try {
    const cmd = ["deno", "test", "-A", "--json"];
    const { stdout: rawOutput } = await runShellCommandWithOutput(
      cmd,
      {},
      false,
      true,
    );
    const lines = rawOutput.split("\n").filter(Boolean);

    for (const line of lines) {
      const event = JSON.parse(line);

      // "testEnd" event => single test completed
      if (event.event === "testEnd" && event.result?.passed === false) {
        code = 1;
        const testName = event.result.name ?? "unknown test";
        const errorMsg = stripArrowLines(
          event.result.error?.message ?? "Test failed",
        );
        printGitHubAnnotation(
          "error",
          `[TEST FAIL] ${testName}: ${errorMsg}`,
        );
      }
    }
  } catch (err) {
    logger.error("Error parsing deno test --json output:", err);
    code = 1;
  }
  return code;
}
