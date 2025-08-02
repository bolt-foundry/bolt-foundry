import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function startHostBridge() {
  const server = Deno.serve(
    { port: 8017 },
    async (req) => {
      const url = new URL(req.url);

      if (url.pathname === "/browser/open" && req.method === "POST") {
        const { url: targetUrl } = await req.json();
        logger.debug(`Opening browser: ${targetUrl}`);

        // Open browser on host
        const cmd = Deno.build.os === "darwin" ? "open" : "xdg-open";
        logger.debug(`Opening URL: ${targetUrl}`);
        const result = await new Deno.Command(cmd, { args: [targetUrl] })
          .output();
        if (!result.success) {
          logger.error(
            `Failed to open browser: ${
              new TextDecoder().decode(result.stderr)
            }`,
          );
        }

        return Response.json({ success: true });
      }

      if (url.pathname === "/pong" && req.method === "GET") {
        return Response.json({
          pong: true,
          from: "host",
          timestamp: new Date().toISOString(),
        });
      }

      // Add more endpoints as needed
      return new Response("Not Found", { status: 404 });
    },
  );

  logger.debug("🌉 Host bridge started on port 8017");
  return server;
}

// Start the host bridge if this file is run directly
if (import.meta.main) {
  startHostBridge();
}
