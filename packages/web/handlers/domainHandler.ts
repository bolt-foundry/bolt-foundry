import { getLogger } from "packages/logger.ts";
import { compile } from "@mdx-js/mdx";
import { renderToReadableStream } from "react-dom/server";
import React from "react";
import { safeExtractFrontmatter } from "packages/bfDb/utils/contentUtils.ts";
import { serveDir } from "@std/http";

const logger = getLogger(import.meta);

/**
 * Gets available domains from content and sites directory structure
 * Returns a Set of domain names found in the content and sites directories
 */
// async function getAvailableDomains(): Promise<Set<string>> {
//   const domains = new Set<string>();

//   try {
//     // Scan content directory for domain folders
//     for await (const entry of Deno.readDir("content")) {
//       if (entry.isDirectory) {
//         // Check if the directory name looks like a domain (contains a dot)
//         if (entry.name.includes(".")) {
//           domains.add(entry.name);
//         }
//       }
//     }

//     // Also scan sites directory for domain folders
//     for await (const entry of Deno.readDir("sites")) {
//       if (entry.isDirectory) {
//         // Check if the directory name looks like a domain (contains a dot)
//         if (entry.name.includes(".")) {
//           domains.add(entry.name);
//         }
//       }
//     }

//     if (domains.size === 0) {
//       logger.warn("No domains found in content or sites directories");
//     } else {
//       logger.info(`Found domains: ${Array.from(domains).join(", ")}`);
//     }
//   } catch (error) {
//     logger.error("Error reading directory structure:", error);
//   }

//   return domains;
// }

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
 * Forward an HTTP request to a Unix domain socket
 */
async function forwardToUnixSocket(
  req: Request,
  socketPath: string,
): Promise<Response | null> {
  const reqUrl = new URL(req.url);

  try {
    // Create a Unix socket connection
    const conn = await Deno.connect({
      path: socketPath,
      transport: "unix",
    });

    // Prepare the HTTP request to send over the socket
    const method = req.method;
    const path = `${reqUrl.pathname}${reqUrl.search}`;
    const headers = [...req.headers.entries()].map(([k, v]) => `${k}: ${v}`);

    // Build the HTTP request string
    let httpRequest = `${method} ${path} HTTP/1.1\r\n${
      headers.join("\r\n")
    }\r\n\r\n`;

    // Add the body if it exists
    let body = null;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const clonedReq = req.clone();
      body = await clonedReq.arrayBuffer();
      httpRequest += new TextDecoder().decode(body);
    }

    // Send the request
    const encoder = new TextEncoder();
    await conn.write(encoder.encode(httpRequest));

    // Read the response
    const buf = new Uint8Array(1024 * 64); // 64KB buffer
    const n = await conn.read(buf);
    if (n === null) {
      logger.error("Empty response from socket");
      conn.close();
      return null;
    }

    const responseText = new TextDecoder().decode(buf.subarray(0, n));

    // Parse the HTTP response
    const [responseHead, ...responseParts] = responseText.split("\r\n\r\n");
    const responseBody = responseParts.join("\r\n\r\n");

    const [statusLine, ...headerLines] = responseHead.split("\r\n");
    const [_, statusCode, statusText] =
      statusLine.match(/HTTP\/\d\.\d (\d+) (.*)/) || [];

    // Parse headers
    const responseHeaders = new Headers();
    for (const line of headerLines) {
      const [name, value] = line.split(": ");
      if (name && value) {
        responseHeaders.append(name, value);
      }
    }

    conn.close();

    // Create and return a Response object
    return new Response(responseBody, {
      status: parseInt(statusCode) || 500,
      statusText: statusText || "Internal Server Error",
      headers: responseHeaders,
    });
  } catch (error) {
    logger.debug(`Error connecting to Unix socket:`, error);
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
  // const availableDomains = await getAvailableDomains();
  logger.info(`trying to handle request for`, domain);

  try {
    logger.info(`trying to handle request for`, domain);
    const domainSocketPath = `sites/${domain}/contentFoundry.cfsock`;
    const socketStats = await Deno.stat(domainSocketPath);
    if (socketStats.isSocket) {
      logger.info(
        `Found domain-specific socket for ${domain}: ${domainSocketPath}`,
      );
      const socketResponse = await forwardToUnixSocket(
        req,
        domainSocketPath,
      );
      if (socketResponse) {
        logger.info(
          `Successfully forwarded request to domain-specific socket for ${domain}`,
        );
        return socketResponse;
      }
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      logger.error(
        `Error checking domain-specific socket for ${domain}:`,
        error,
      );
    } else {
      logger.debug(
        `No domain-specific socket found for ${domain} in sites directory`,
      );
    }
  }

  //   // Continue with original domain handling if socket request fails
  //   if (availableDomains.has(domain)) {
  //     // First, check if this is a static file request
  //     const staticResponse = await handleDomainStaticFiles(req, domain);
  //     if (staticResponse) {
  //       return staticResponse;
  //     }

  //     logger.info(`Handling request for domain: ${domain}`);
  //     const contentUrl = new URL(
  //       import.meta.resolve(`content/${domain}/page.md`),
  //     );
  //     const text = await Deno.readTextFile(contentUrl);
  //     const { body } = safeExtractFrontmatter(text);
  //     const rendered = await compile(body);
  //     const compiledLocation = await Deno.makeTempFile({
  //       prefix: `${domain}-page`,
  //       suffix: "tsx",
  //     });
  //     await Deno.writeTextFile(
  //       compiledLocation,
  //       String(rendered),
  //     );
  //     const { default: Content } = await import(compiledLocation.toString());

  //     // Create full HTML with stylesheet link
  //     const htmlStream = await renderToReadableStream(
  //       React.createElement(Content),
  //     );
  //     const htmlContent = await new Response(htmlStream).text();

  //     // Create complete HTML with proper doctype and stylesheet link
  //     const completeHtml = `<!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <link rel="stylesheet" href="/_static/base.css">
  // </head>
  // <body>
  //   ${htmlContent}
  // </body>
  // </html>`;

  //     return new Response(completeHtml, {
  //       headers: {
  //         "content-type": "text/html",
  //       },
  //     });
  //   }

  return null;
}
