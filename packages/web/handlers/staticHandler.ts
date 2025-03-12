import { serveDir } from "@std/http";

/**
 * Serves static files with appropriate caching headers
 */
export function serveStaticFiles(req: Request): Response {
  return serveDir(req, {
    headers: [
      "Cache-Control: public, must-revalidate",
      "ETag: true",
    ],
  });
}
