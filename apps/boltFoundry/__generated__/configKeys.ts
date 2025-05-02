/* @generated */
// Source vault: "c7qk6vxetcikihgccsc2p7d37q"
// Public tag  : "bolt-foundry-frontend-public"  (6 keys)
// Private tag : "bolt-foundry-backend-private" (27 keys)

export const PUBLIC_CONFIG_KEYS = [
  "APPS_INTERNALBF_POSTHOG_API_KEY",
  "GOOGLE_OAUTH_CLIENT_ID",
  "LOG_LEVEL",
  "LOG_LOGGERS_TO_ENABLE",
  "POSTHOG_API_KEY",
  "UNIT-TEST-PUBLIC",
] as const;

export const PRIVATE_CONFIG_KEYS = [
  "APPS_COLLECTOR_POSTHOG_API_KEY",
  "ASSEMBLY_AI_KEY",
  "BF_CACHE_ENV",
  "BF_CACHE_TTL_SEC",
  "BF_ENV",
  "DATABASE_BACKEND",
  "DATABASE_URL",
  "DATABASE_URL_CONTACTS",
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
  "OPEN_ROUTER_API_KEY",
  "THANKSBOT_DISCORD_TO_NOTION_MAP_DATABASE_ID",
  "THANKSBOT_NOTION_DATABASE_ID",
  "THANKSBOT_NOTION_TOKEN",
  "UNIT-TEST-SECRET",
  "WAITLIST_API_KEY",
  "WEB_PORT",
] as const;

export type PublicConfigKey  = typeof PUBLIC_CONFIG_KEYS[number];
export type PrivateConfigKey = typeof PRIVATE_CONFIG_KEYS[number];
export type ConfigKey        = PublicConfigKey | PrivateConfigKey;

export type PublicConfigMap  = { [K in PublicConfigKey]: string };
export type PrivateConfigMap = { [K in PrivateConfigKey]: string };
export type ConfigMap        = PublicConfigMap & PrivateConfigMap;
