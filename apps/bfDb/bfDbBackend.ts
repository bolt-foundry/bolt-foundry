import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type { DatabaseBackend } from "@bfmono/apps/bfDb/backend/DatabaseBackend.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Cache instance for reuse
let cachedBackend: DatabaseBackend | null = null;
let backendPromise: Promise<DatabaseBackend> | null = null;

export async function closeBackend(): Promise<void> {
  if (cachedBackend) {
    logger.debug("Closing database backend connection");
    try {
      // First attempt to close all connections
      await cachedBackend.close();

      // Important: clear the cached backend reference after closing
      const oldBackend = cachedBackend;
      cachedBackend = null;
      backendPromise = null;

      // Add a longer delay to ensure connections are fully closed
      // This is especially important for Postgres connections
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Force garbage collection of the backend if possible
      if (oldBackend && typeof oldBackend === "object") {
        // Clear any potential circular references
        for (const key in oldBackend) {
          if (Object.prototype.hasOwnProperty.call(oldBackend, key)) {
            // @ts-ignore: Dynamically clearing properties
            oldBackend[key] = null;
          }
        }
      }

      logger.debug("Database backend connection closed successfully");
    } catch (error) {
      logger.error("Error closing database backend:", error);
      // Still clear the cached backend even if there's an error
      cachedBackend = null;
      backendPromise = null;
      throw error;
    }
  } else {
    logger.debug("No cached backend to close");
  }
}

// Update the getBackend function to ensure clean initialization
export async function getBackend(): Promise<DatabaseBackend> {
  if (cachedBackend) {
    return cachedBackend;
  }

  if (backendPromise) {
    return await backendPromise;
  }

  backendPromise = (async () => {
    const databaseUrl = getConfigurationVariable("DATABASE_URL");
    // Get the backend type from environment or determine based on DATABASE_URL
    // Allow explicit override with FORCE_DB_BACKEND for testing
    const forceBackend = getConfigurationVariable("FORCE_DB_BACKEND");
    const backendType = forceBackend ||
      (databaseUrl
        ? getConfigurationVariable("DATABASE_BACKEND") ?? "neon"
        : "sqlite");

    logger.debug(`Creating database backend of type: ${backendType}`);

    // Create a new backend instance based on the specified type
    try {
      switch (backendType.toLowerCase()) {
        case "neon": {
          const { DatabaseBackendNeon } = await import(
            "apps/bfDb/backend/DatabaseBackendNeon.ts"
          );
          cachedBackend = new DatabaseBackendNeon();
          break;
        }
        case "pg": {
          const { DatabaseBackendPg } = await import(
            "apps/bfDb/backend/DatabaseBackendPg.ts"
          );
          cachedBackend = new DatabaseBackendPg();
          break;
        }
        case "sqlite": {
          const { DatabaseBackendSqlite } = await import(
            "apps/bfDb/backend/DatabaseBackendSqlite.ts"
          );

          // For SQLite, check if we need a unique test database
          const sqliteDbPath = getConfigurationVariable("SQLITE_DB_PATH");
          if (sqliteDbPath) {
            logger.debug(`Using custom SQLite database path: ${sqliteDbPath}`);
          }

          cachedBackend = new DatabaseBackendSqlite();
          break;
        }
        default:
          throw new Error(`Unknown database backend type: ${backendType}`);
      }

      // Initialize the database schema
      await cachedBackend.initialize();
      logger.debug(`Database backend of type ${backendType} initialized`);

      return cachedBackend;
    } catch (error) {
      // If initialization fails, clear the cached backend
      cachedBackend = null;
      backendPromise = null;
      logger.error(`Failed to initialize ${backendType} backend:`, error);
      throw error;
    }
  })();

  return await backendPromise;
}
