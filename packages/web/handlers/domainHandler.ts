import { getLogger } from "packages/logger.ts";
import type { Handler } from "packages/web/web.tsx";
import { matchRoute } from "packages/web/handlers/requestHandler.ts";

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
 * Handles domain-specific routing
 */
export async function handleDomains(
  req: Request,
): Promise<Response | null> {
  const reqUrl = new URL(req.url);
  const domain = Deno.env.get("FORCE_DOMAIN") ?? reqUrl.hostname;
  
  // Get available domains from content directory
  const availableDomains = await getAvailableDomains();
  
  if (availableDomains.has(domain)) {
    logger.info(`Handling request for domain: ${domain}`);
    return new Response(domain)
  }

  return null;
}
