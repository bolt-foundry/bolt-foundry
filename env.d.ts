// Auto-generated from .env.example files - do not edit manually
// Run 'bft secrets generate-types' to regenerate

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

// Base types for all environments
interface BaseImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

// Client-safe variables (from .env.client.example)
interface ClientEnvVars {
  readonly POSTHOG_API_KEY?: string;
  readonly APPS_INTERNALBF_POSTHOG_API_KEY?: string;
  readonly GOOGLE_OAUTH_CLIENT_ID?: string;
  readonly LOG_LEVEL?: string;
  readonly ENABLE_SPECIFIC_LOGGERS?: string;
  readonly LOG_LOGGERS_TO_ENABLE?: string;
  readonly UNIT_TEST_PUBLIC?: string;
}

// Server-only variables (from .env.server.example)
interface ServerEnvVars {
  readonly DATABASE_URL?: string;
  readonly DATABASE_URL_CONTACTS?: string;
  readonly DATABASE_BACKEND?: string;
  readonly DB_BACKEND_TYPE?: string;
  readonly JWT_SECRET?: string;
  readonly GOOGLE_OAUTH_CLIENT_SECRET?: string;
  readonly OPENAI_API_KEY?: string;
  readonly OPENAI_BASE_URL?: string;
  readonly OPENAI_ORG_ID?: string;
  readonly OPENAI_PROJECT_ID?: string;
  readonly OPENROUTER_API_KEY?: string;
  readonly ASSEMBLY_AI_KEY?: string;
  readonly WAITLIST_API_KEY?: string;
  readonly EMAIL_HOST?: string;
  readonly EMAIL_PORT?: string;
  readonly EMAIL_USER?: string;
  readonly EMAIL_FROM?: string;
  readonly EMAIL_PASS?: string;
  readonly BF_ENV?: string;
  readonly BF_CACHE_ENV?: string;
  readonly BF_CACHE_TTL_SEC?: string;
  readonly WEB_PORT?: string;
  readonly COLLECTOR_PORT?: string;
  readonly THANKSBOT_DISCORD_TO_NOTION_MAP_DATABASE_ID?: string;
  readonly THANKSBOT_NOTION_DATABASE_ID?: string;
  readonly THANKSBOT_NOTION_TOKEN?: string;
  readonly UNIT_TEST_SECRET?: string;
  readonly EXAMPLES_NEXTJS_SAMPLE_POSTHOG_API_KEY?: string;
}

// Environment-aware typing
declare namespace ImportMetaEnv {
  // Client environment: Only client-safe + base variables
  interface Client extends BaseImportMetaEnv, ClientEnvVars {
    readonly SSR: false;
  }

  // Server environment: All variables available
  interface Server extends BaseImportMetaEnv, ClientEnvVars, ServerEnvVars {
    readonly SSR: boolean;
  }
}

// Runtime environment detection using window availability
declare interface ImportMeta {
  readonly env: typeof globalThis extends { window: unknown }
    ? ImportMetaEnv.Client // Client context (browser)
    : ImportMetaEnv.Server; // Server context (Deno)
}

// For compatibility with existing env.d.ts expectations
interface ImportMetaEnv extends ImportMetaEnv.Server {}
