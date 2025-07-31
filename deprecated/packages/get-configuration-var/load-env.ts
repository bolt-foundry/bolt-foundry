/**
 * Simple environment loader for Deno that populates import.meta.env
 *
 * Usage:
 * ```typescript
 * import { loadEnv } from "@bolt-foundry/get-configuration-var/load-env";
 *
 * // At the top of your module
 * await loadEnv(import.meta);
 *
 * // Then use import.meta.env normally
 * console.log(import.meta.env.API_KEY);
 * ```
 */

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
  BASE_URL: string;
}

let envLoaded = false;

/**
 * Load environment variables into import.meta.env
 *
 * @param importMeta - The import.meta object from the calling module
 * @param options - Configuration options
 * @returns The populated import.meta.env object
 */
export async function loadEnv(
  importMeta: ImportMeta,
  options: {
    envPath?: string;
    debug?: boolean;
    override?: boolean;
  } = {},
): Promise<ImportMetaEnv> {
  const {
    envPath = ".env.local",
    debug = false,
    override = false,
  } = options;

  // Skip if already loaded (unless override is true)
  if (envLoaded && !override && importMeta.env) {
    return importMeta.env as ImportMetaEnv;
  }

  // Load .env file if it exists
  try {
    if (typeof Deno !== "undefined") {
      const { load } = await import("jsr:@std/dotenv@0.225.0");
      await load({ envPath, export: true });
      if (debug) {
        console.log(`[loadEnv] Loaded ${envPath}`);
      }
    }
  } catch (error) {
    if (debug && !(error instanceof Deno.errors.NotFound)) {
      console.error(`[loadEnv] Error loading ${envPath}:`, error);
    }
  }

  // Create the env object with all current environment variables
  const env: ImportMetaEnv = {} as ImportMetaEnv;

  // Add all environment variables
  if (typeof Deno !== "undefined") {
    const allEnvVars = Deno.env.toObject();
    for (const [key, value] of Object.entries(allEnvVars)) {
      env[key] = value;
    }
  } else if (typeof process !== "undefined") {
    // @ts-ignore - Node.js compatibility
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        env[key] = value;
      }
    }
  }

  // Add Vite-compatible standard environment variables
  env.MODE = env.NODE_ENV || "development";
  env.DEV = env.MODE !== "production";
  env.PROD = env.MODE === "production";
  env.SSR = false;
  env.BASE_URL = env.BASE_URL || "/";

  // Attach to import.meta
  if (!importMeta.env || override) {
    // @ts-ignore - We're intentionally modifying import.meta
    importMeta.env = env;
  } else {
    // Merge with existing env
    Object.assign(importMeta.env, env);
  }

  envLoaded = true;

  if (debug) {
    const keys = Object.keys(env).sort();
    console.log(`[loadEnv] Loaded ${keys.length} environment variables`);
    if (env.DEBUG === "true") {
      console.log(
        "[loadEnv] Variables:",
        keys.map((k) =>
          k.includes("SECRET") || k.includes("KEY") || k.includes("TOKEN") ||
            k.includes("PASSWORD")
            ? `${k}=***`
            : `${k}=${String(env[k]).substring(0, 20)}${
              String(env[k]).length > 20 ? "..." : ""
            }`
        ).join(", "),
      );
    }
  }

  return importMeta.env as ImportMetaEnv;
}

/**
 * Synchronous version that only sets up Vite-compatible env vars
 * without loading .env files
 */
export function loadEnvSync(
  importMeta: ImportMeta,
  options: {
    debug?: boolean;
    override?: boolean;
  } = {},
): ImportMetaEnv {
  const { debug = false, override = false } = options;

  // Skip if already loaded (unless override is true)
  if (envLoaded && !override && importMeta.env) {
    return importMeta.env as ImportMetaEnv;
  }

  // Create the env object
  const env: ImportMetaEnv = {} as ImportMetaEnv;

  // Add all current environment variables (already in Deno.env)
  if (typeof Deno !== "undefined") {
    const allEnvVars = Deno.env.toObject();
    for (const [key, value] of Object.entries(allEnvVars)) {
      env[key] = value;
    }
  }

  // Add Vite-compatible standard environment variables
  env.MODE = env.NODE_ENV || "development";
  env.DEV = env.MODE !== "production";
  env.PROD = env.MODE === "production";
  env.SSR = false;
  env.BASE_URL = env.BASE_URL || "/";

  // Attach to import.meta
  // @ts-ignore - We're intentionally modifying import.meta
  importMeta.env = env;

  if (debug) {
    console.log(
      `[loadEnvSync] Set up environment with ${
        Object.keys(env).length
      } variables`,
    );
  }

  return env;
}

// Re-export the type for convenience
export type { ImportMetaEnv };
