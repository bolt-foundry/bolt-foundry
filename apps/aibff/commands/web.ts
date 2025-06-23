import { parseArgs } from "@std/cli";
import { getLogger } from "../../../packages/logger/logger.ts";
import type { Command } from "./types.ts";

const logger = getLogger(import.meta);

export const web: Command = {
  name: "web",
  description: "Start the aibff web UI server",
  async run(args: Array<string>) {
    const flags = parseArgs(args, {
      boolean: ["help"],
      string: ["port"],
      default: {
        port: "9999",
      },
    });

    if (flags.help) {
      console.log(`
Usage: aibff web [OPTIONS]

Start the aibff web UI server

Options:
  --port <PORT>    Port to run the server on (default: 9999)
  --help           Show this help message
`);
      return;
    }

    const port = parseInt(flags.port as string);
    if (isNaN(port)) {
      logger.printErr(`Invalid port: ${flags.port}`);
      Deno.exit(1);
    }

    logger.info(`Starting aibff web server on port ${port}...`);

    try {
      // Import and start the web server
      const { startWebServer } = await import("../web/server.ts");
      await startWebServer(port);
    } catch (error) {
      logger.printErr(`Failed to start web server: ${error}`);
      Deno.exit(1);
    }
  },
};