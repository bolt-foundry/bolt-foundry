import { getLogger } from "../../../packages/logger/logger.ts";
import { BUILD_COMMIT, BUILD_TIME, VERSION } from "../version.ts";

const logger = getLogger(import.meta);

export async function startWebServer(port: number): Promise<void> {
  const handler = (request: Request): Response => {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static files
    if (path.startsWith("/static/")) {
      return serveStaticFile(path);
    }

    // Main page route
    if (path === "/" || path === "") {
      return serveMainPage(port);
    }

    // 404 for unknown routes
    return new Response("Not Found", { status: 404 });
  };

  logger.info(`Web server listening on http://localhost:${port}`);
  await Deno.serve({ port }, handler);
}

function serveMainPage(port: number): Response {
  // For now, serve a simple HTML page
  // Later this will server-render React
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aibff UI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #0a0a0a;
      color: #fafafa;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .version {
      font-family: monospace;
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <h1>aibff UI</h1>
  <div class="version">
    <p><strong>Version:</strong> ${VERSION}</p>
    ${BUILD_TIME ? `<p><strong>Built:</strong> ${BUILD_TIME}</p>` : ""}
    ${BUILD_COMMIT ? `<p><strong>Commit:</strong> ${BUILD_COMMIT}</p>` : ""}
    <p><strong>Status:</strong> Running on port ${port}</p>
  </div>
  <p>React UI coming soon...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function serveStaticFile(_path: string): Response {
  // Placeholder for static file serving
  // Will be implemented when we add the build system
  return new Response("Static file serving not yet implemented", {
    status: 501,
  });
}
