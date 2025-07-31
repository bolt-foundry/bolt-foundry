import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

/**
 * Logger specific to GitHub
 */
export const loggerGithub = {
  info: (...args: Array<unknown>) => logger.info(...args),
  debug: (...args: Array<unknown>) => logger.debug(...args),
  trace: (...args: Array<unknown>) => logger.trace(...args),
  warn: (...args: Array<unknown>) => logger.warn(...args),
  error: (...args: Array<unknown>) => logger.error(...args),
  notice: (message: string) => {
    // GitHub Actions notice format
    // deno-lint-ignore no-console
    console.log(`::notice::${message}`);
  },
  warning: (message: string) => {
    // GitHub Actions warning format
    // deno-lint-ignore no-console
    console.log(`::warning::${message}`);
  },
};
