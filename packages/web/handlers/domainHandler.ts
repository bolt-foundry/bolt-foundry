import { getLogger } from "packages/logger.ts";
import { compile } from "@mdx-js/mdx";
import { renderToReadableStream } from "react-dom/server";
import React from "react";
import { safeExtractFrontmatter } from "packages/bfDb/utils/contentUtils.ts";
import { serveDir } from "@std/http";

const logger = getLogger(import.meta);

/**
 * Gets available domains from content directory structure
 * Returns a Set of domain names found in the content directory
 */
async function getAvailableDomains(): Promise<Set<string>> {
  const domains = new Set<string>();

  try {
    // Scan content directory for domain folders
    for await (const entry of Deno.readDir("content")) {
      if (entry.isDirectory) {
        // Check if the directory name looks like a domain (contains a dot)
        if (entry.name.includes(".")) {
          domains.add(entry.name);
        }
      }
    }

    if (domains.size === 0) {
      logger.warn("No domains found in content directory");
    } else {
      logger.info(`Found domains: ${Array.from(domains).join(", ")}`);
    }
  } catch (error) {
    logger.error("Error reading content directories:", error);
  }

  return domains;
}

/**
 * Handles domain-specific static file requests
 */
async function handleDomainStaticFiles(
  req: Request,
  domain: string,
): Promise<Response | null> {
  const reqUrl = new URL(req.url);
  const pathname = reqUrl.pathname;

  // Check if this is a static file request
  if (!pathname.startsWith("/_static/")) {
    return null;
  }

  logger.info(`Handling static file request for domain ${domain}: ${pathname}`);

  // Serve from the domain's _static directory
  const staticRoot = `content/${domain}`;

  try {
    // Make sure the static directory exists
    const staticDirInfo = await Deno.stat(staticRoot);
    if (!staticDirInfo.isDirectory) {
      logger.warn(
        `Static directory for ${domain} exists but is not a directory`,
      );
      return null;
    }

    // Use serveDir to handle the static file
    return await serveDir(req, {
      fsRoot: staticRoot,
      headers: [
        "Cache-Control: public, max-age=3600",
        "ETag: true",
      ],
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      logger.info(`Static directory does not exist for ${domain}`);
      return null;
    }

    logger.error(`Error serving static file for ${domain}:`, error);
    return null;
  }
}

/**
 * Handles domain-specific routing
 */
export async function handleDomains(
  req: Request,
): Promise<Response | null> {
  const reqUrl = new URL(req.url);
  const domain = Deno.env.get("FORCE_DOMAIN") ?? reqUrl.hostname;

  // Get available domains from content directory
  const availableDomains = await getAvailableDomains();
  logger.info(`trying to handle request for`, domain);

  if (availableDomains.has(domain)) {
    // First, check if this is a static file request
    const staticResponse = await handleDomainStaticFiles(req, domain);
    if (staticResponse) {
      return staticResponse;
    }

    logger.info(`Handling request for domain: ${domain}`);
    const contentUrl = new URL(
      import.meta.resolve(`content/${domain}/page.md`),
    );
    try {
      const text = await Deno.readTextFile(contentUrl);
      const { body } = safeExtractFrontmatter(text);
      const rendered = await compile(body);
      const compiledLocation = await Deno.makeTempFile({
        prefix: `${domain}-page`,
        suffix: "tsx",
      });
      await Deno.writeTextFile(
        compiledLocation,
        String(rendered),
      );
      const { default: Content } = await import(compiledLocation.toString());

      // Create full HTML with stylesheet link
      const htmlStream = await renderToReadableStream(
        React.createElement(Content),
      );
      const htmlContent = await new Response(htmlStream).text();

      // Create complete HTML with proper doctype and stylesheet link
      const completeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/_static/base.css">
</head>
<body>
  ${htmlContent}
</body>
</html>`;

      return new Response(completeHtml, {
        headers: {
          "content-type": "text/html",
        },
      });
    } catch {
      // lol
    }
  }

  return null;
}
