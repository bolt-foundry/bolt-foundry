/* @generated */

// Source vault: "c7qk6vxetcikihgccsc2p7d37q"
// Public tag  : "bolt-foundry-frontend-public"  (7 keys)
// Private tag : "bolt-foundry-backend-private" (28 keys)

export const PUBLIC_CONFIG_KEYS = [
  "APPS_INTERNALBF_POSTHOG_API_KEY",
  "ENABLE_SPECIFIC_LOGGERS",
  "GOOGLE_OAUTH_CLIENT_ID",
  "LOG_LEVEL",
  "LOG_LOGGERS_TO_ENABLE",
  "POSTHOG_API_KEY",
  "UNIT_TEST_PUBLIC",
] as const;

export const PRIVATE_CONFIG_KEYS = [
  "ASSEMBLY_AI_KEY",
  "BF_CACHE_ENV",
  "BF_CACHE_TTL_SEC",
  "BF_ENV",
  "COLLECTOR_PORT",
  "DATABASE_BACKEND",
  "DATABASE_URL",
  "DATABASE_URL_CONTACTS",
  "DB_BACKEND_TYPE",
  "EMAIL_FROM",
  "EMAIL_HOST",
  "EMAIL_PASS",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EXAMPLES_NEXTJS_SAMPLE_POSTHOG_API_KEY",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "JWT_SECRET",
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPENAI_ORG_ID",
  "OPENAI_PROJECT_ID",
  "OPENROUTER_API_KEY",
  "THANKSBOT_DISCORD_TO_NOTION_MAP_DATABASE_ID",
  "THANKSBOT_NOTION_DATABASE_ID",
  "THANKSBOT_NOTION_TOKEN",
  "UNIT_TEST_SECRET",
  "WAITLIST_API_KEY",
  "WEB_PORT",
] as const;

// All keys (public + private) – do *not* ship private values to the client!
export const CONFIG_KEYS = [
  ...PUBLIC_CONFIG_KEYS,
  ...PRIVATE_CONFIG_KEYS,
] as const;

export type PublicConfigKey  = typeof PUBLIC_CONFIG_KEYS[number];
export type PrivateConfigKey = typeof PRIVATE_CONFIG_KEYS[number];
export type ConfigKey        = typeof CONFIG_KEYS[number];

export type PublicConfigMap  = { [K in PublicConfigKey]: string };
export type PrivateConfigMap = { [K in PrivateConfigKey]: string };
export type ConfigMap        = PublicConfigMap & PrivateConfigMap;

// Shape of globalThis.__ENVIRONMENT__ on the browser:
export type ClientEnvironment = {
  [K in PublicConfigKey]?: string | boolean;
};
