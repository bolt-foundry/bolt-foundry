import type * as esbuild from "esbuild";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { createCache } from "@deno/cache-dir";

const logger = getLogger(import.meta);

// Create cache instance
const cache = createCache();

export const denoFileResolver: esbuild.Plugin = {
  name: "deno-file-resolver",
  setup(build) {
    logger.info("Setting up deno-file-resolver plugin");

    // Add loader for HTTPS URLs - read from Deno's cache
    build.onLoad({ filter: /.*/, namespace: "https" }, async (args) => {
      logger.info(`Loading HTTPS resource from cache: ${args.path}`);

      try {
        // Use @deno/cache-dir to load from cache
        const cached = await cache.load(args.path);

        if (!cached || cached.kind === "redirect") {
          throw new Error(`File not found in cache: ${args.path}`);
        }

        // Convert content to string if it's a Uint8Array
        let contents: string;
        if (cached.kind === "module") {
          if (typeof cached.content === "string") {
            contents = cached.content;
          } else {
            contents = new TextDecoder().decode(cached.content);
          }
        } else {
          throw new Error(`Unexpected cache kind: ${cached.kind}`);
        }
        logger.debug(`Loaded from cache: ${args.path}`);

        return {
          contents,
          loader: args.path.endsWith(".ts") || args.path.endsWith(".tsx")
            ? "ts"
            : "js",
        };
      } catch (error) {
        logger.error(`Failed to load ${args.path} from cache: ${error}`);
        throw error;
      }
    });

    build.onResolve(
      {
        filter:
          /^(?:@bolt-foundry.*|@std\/.*|\S+\.(?:ts|js|tsx|jsx|md|mdx|ipynb))$/,
      },
      async (args) => {
        if (args.kind === "entry-point") return;

        logger.debug(`Resolving: ${args.path}`);
        const resolved = import.meta.resolve(args.path);
        logger.debug(`Resolved to: ${resolved}`);

        // Handle JSR imports
        if (resolved.startsWith("jsr:")) {
          // Simple conversion: jsr:/@std/fmt@^1.0.8/colors -> https://jsr.io/@std/fmt/1.0.8/colors.ts
          const jsrPath = resolved.slice(4); // Remove "jsr:"

          // Replace @version with /version and add .ts extension
          const httpsUrl = jsrPath
            .replace(/^\//, "") // Remove leading slash if present
            .replace(/@(\^?~?[\d.]+)/, "/$1") // Replace @version with /version
            .replace(/\^|~/, ""); // Remove semver prefixes

          const finalUrl = `https://jsr.io/${httpsUrl}.ts`;
          logger.info(`Resolved JSR import: ${args.path} -> ${finalUrl}`);
          return { path: finalUrl, external: false };
        }

        // Handle HTTPS URLs (including JSR)
        if (resolved.startsWith("https://")) {
          logger.info(`Resolved HTTPS import: ${args.path} -> ${resolved}`);
          return { path: resolved, namespace: "https", external: false };
        }

        // Handle file:// URLs
        if (resolved.startsWith("file://")) {
          const filePath = resolved.slice(7); // Remove "file://"
          const fileExists = await Deno.lstat(filePath).then(() => true).catch(
            () => false,
          );
          logger.debug(filePath);
          if (fileExists) {
            return { path: filePath };
          }
        }

        return null;
      },
    );
  },
};
