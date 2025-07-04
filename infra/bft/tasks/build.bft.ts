import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { genGqlTypesCommand } from "./genGqlTypes.bft.ts";
import { isoCommand } from "./iso.bft.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";
import { getConfigurationVariable } from "@bfmono/packages/get-configuration-var/get-configuration-var.ts";
import { DeploymentEnvs } from "@bfmono/infra/constants/deploymentEnvs.ts";
import {
  PRIVATE_CONFIG_KEYS,
  PUBLIC_CONFIG_KEYS,
} from "@bfmono/apps/boltFoundry/__generated__/configKeys.ts";

const logger = getLogger(import.meta);

// Environment and configuration setup for web compilation
export const ENVIRONMENT_ONLY_KEYS = [
  "CI",
  "COLORTERM",
  "DEBUG",
  "DENO_TRACE_PERMISSIONS",
  "FORCE_COLOR",
  "FORCE_DB_BACKEND",
  "NODE_ENV",
  "NODE_PG_FORCE_NATIVE",
  "REPL_HOME",
  "REPL_SLUG",
  "REPLIT_DEV_DOMAIN",
  "SQLITE_DB_PATH",
  "TEAMCITY_VERSION",
  "TERM",
  "TF_BUILD",
  "USER",
  "WS_NO_BUFFER_UTIL",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
];

export const INTERNAL_KEYS: Set<string> = new Set<string>([
  "BF_CACHE_TTL_SEC",
  "BF_CACHE_ENV",
  "BF_ENV",
  "BF_VAULT_ID",
]);

const allowedEnvironmentVariables = [
  ...ENVIRONMENT_ONLY_KEYS,
  ...INTERNAL_KEYS,
  ...PUBLIC_CONFIG_KEYS,
  ...PRIVATE_CONFIG_KEYS,
].reduce((acc, key) => acc.add(key), new Set<string>());

// Network destinations for web compilation
const DATABASE_STRING = getConfigurationVariable("DATABASE_URL") ?? "";
const DEFAULT_NETWORK_DESTINATIONS = [
  "0.0.0.0",
  "127.0.0.1",
  "localhost",
  "api.assemblyai.com",
  "openrouter.ai",
  "api.openai.com",
  "app.posthog.com",
  "bf-contacts.replit.app:443",
  "oauth2.googleapis.com:443",
  "api.github.com",
];

const allowedNetworkDestinations = [...DEFAULT_NETWORK_DESTINATIONS];

if (DATABASE_STRING) {
  try {
    const DATABASE_URL = new URL(DATABASE_STRING);
    const dbDomain = DATABASE_URL.hostname;
    const neonApiParts = dbDomain.split(".");
    neonApiParts[0] = "api";
    const neonApiDomain = neonApiParts.join(".");
    allowedNetworkDestinations.push(dbDomain, neonApiDomain);
  } catch (err) {
    logger.warn(
      "Could not parse DATABASE_URL, continuing with default network destinations",
      err,
    );
  }
}

const includableDirectories = ["static"];
const readableLocations = ["/tmp", "static/", "tmp/", "docs/"];
const writableLocations = ["/tmp", "tmp"];
const allowedBinaries = ["op"];

if (getConfigurationVariable("BF_ENV") === DeploymentEnvs.DEVELOPMENT) {
  allowedBinaries.push("sl");
}

async function _compileWebApp(): Promise<number> {
  logger.info("Compiling web application...");

  // Ensure build directory exists
  try {
    await Deno.remove("build", { recursive: true });
  } catch {
    // Ignore if directory doesn't exist
  }
  await Deno.mkdir("build", { recursive: true });
  await Deno.writeFile("build/.gitkeep", new Uint8Array());

  const denoCompilationCommand = [
    "deno",
    "compile",
    "--no-check",
    "--output=build/web",
    ...includableDirectories.map((dir) => `--include=${dir}`),
    `--allow-net=${allowedNetworkDestinations.join(",")}`,
    `--allow-env=${Array.from(allowedEnvironmentVariables).join(",")}`,
    `--allow-read=${readableLocations.join(",")}`,
    `--allow-write=${writableLocations.join(",")}`,
    ...(allowedBinaries.length > 0
      ? [`--allow-run=${allowedBinaries.join(",")}`]
      : []),
    "apps/web/web.tsx",
  ];

  const result = await runShellCommand(denoCompilationCommand);
  if (result !== 0) {
    logger.error("❌ Web compilation failed");
    return result;
  }

  logger.info("✅ Web compilation complete");
  return 0;
}

export async function buildCommand(options: Array<string>): Promise<number> {
  logger.info("Starting build pipeline...");

  try {
    // Step 1: Generate GraphQL types
    logger.info("Running genGqlTypes...");
    const gqlResult = await genGqlTypesCommand([]);
    if (gqlResult !== 0) {
      logger.error("❌ Build failed at genGqlTypes step");
      return gqlResult;
    }
    logger.info("✨ genGqlTypes complete");

    // Step 2: Run Isograph compiler
    logger.info("Running iso...");
    const isoResult = await isoCommand(options); // Pass through any options to iso
    if (isoResult !== 0) {
      logger.error("❌ Build failed at iso step");
      return isoResult;
    }
    logger.info("✨ iso complete");

    // Step 3: Web compilation temporarily disabled
    logger.info("⚠️  Web compilation skipped - will be reimplemented later");

    logger.info("🎉 Build pipeline completed successfully!");
    return 0;
  } catch (error) {
    logger.error("❌ Build pipeline failed:", error);
    return 1;
  }
}

export const bftDefinition = {
  description: "Run the build pipeline (genGqlTypes → iso)",
  fn: buildCommand,
  aiSafe: true,
} satisfies TaskDefinition;
