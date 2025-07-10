#! /usr/bin/env -S bff

// File: infra/bff/githubLogger.ts
import { getLogger } from "@bfmono/packages/logger/logger.ts";

export interface GithubAnnotationMeta {
  file?: string;
  line?: number;
  col?: number;
}

function escapeGithubData(str: string): string {
  return str.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

export function annotationLine(
  type: "error" | "warning" | "notice",
  message: string,
  meta?: GithubAnnotationMeta,
): string {
  const { file, line, col } = meta || {};
  let lineOut = `::${type}`;
  if (file) {
    lineOut += ` file=${file}`;
  }
  if (typeof line === "number") {
    lineOut += `,line=${line}`;
  }
  if (typeof col === "number") {
    lineOut += `,col=${col}`;
  }
  lineOut += `::${escapeGithubData(message)}`;
  return lineOut;
}

const baseLogger = getLogger("github_annotations");
const realError = baseLogger.error.bind(baseLogger);
const realWarn = baseLogger.warn.bind(baseLogger);
const realInfo = baseLogger.info.bind(baseLogger);

export const loggerGithub = {
  ...baseLogger,

  error(message: string, meta?: GithubAnnotationMeta) {
    // deno-lint-ignore no-console
    console.log(annotationLine("error", message, meta));
    realError(message);
  },

  warn(message: string, meta?: GithubAnnotationMeta) {
    // deno-lint-ignore no-console
    console.log(annotationLine("warning", message, meta));
    realWarn(message);
  },

  info(message: string, meta?: GithubAnnotationMeta) {
    // deno-lint-ignore no-console
    console.log(annotationLine("notice", message, meta));
    realInfo(message);
  },
};
