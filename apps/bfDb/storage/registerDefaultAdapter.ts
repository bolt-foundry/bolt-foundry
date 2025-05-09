// =====================================================
// Chooses and registers the default backend adapter once
// per process based on env var DB_BACKEND_TYPE.
// =====================================================
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { AdapterRegistry } from "./AdapterRegistry.ts";
import { InMemoryAdapter } from "./InMemoryAdapter.ts";
import { DatabaseBackendPg } from "../backend/DatabaseBackendPg.ts";
import { DatabaseBackendSqlite } from "../backend/DatabaseBackendSqlite.ts";
import { getLogger } from "packages/logger/logger.ts";
import { DatabaseBackendNeon } from "apps/bfDb/backend/DatabaseBackendNeon.ts";

const logger = getLogger(import.meta);

let registered = false; // guard so we don't double‑register accidentally

export function registerDefaultAdapter() {
  if (registered) return; // idempotent

  try {
    AdapterRegistry.get();
    registered = true; // Something already registered elsewhere
    return;
  } catch (_) {
    // fallthrough – nothing registered yet
  }

  const env = getConfigurationVariable("DB_BACKEND_TYPE")?.toLowerCase() ??
    "memory";
  logger.info(`registerDefaultAdapter → selecting '${env}' backend`);

  switch (env) {
    case "neon": {
      const neon = new DatabaseBackendNeon();
      neon.initialize();
      AdapterRegistry.register(neon);
      break;
    }
    case "pg":
    case "postgres": {
      const pg = new DatabaseBackendPg();
      pg.initialize();
      AdapterRegistry.register(pg);
      break;
    }
    case "sqlite": {
      const sqlite = new DatabaseBackendSqlite();
      sqlite.initialize();
      AdapterRegistry.register(sqlite);
      break;
    }
    default: {
      const mem = new InMemoryAdapter();
      mem.initialize();
      AdapterRegistry.register(mem);
    }
  }

  registered = true;
}
