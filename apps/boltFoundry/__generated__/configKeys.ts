/* @generated */
// Source vault: "c7qk6vxetcikihgccsc2p7d37q"
// Public tag  : "bolt-foundry-frontend-public"  (4 keys)
// Private tag : "bolt-foundry-backend-private" (11 keys)

export const PUBLIC_CONFIG_KEYS = [
  "GOOGLE_OAUTH_CLIENT_ID",
  "LOG_LEVEL",
  "LOG_LOGGERS_TO_ENABLE",
  "UNIT-TEST-PUBLIC",
] as const;

export const PRIVATE_CONFIG_KEYS = [
  "BF_CACHE_ENV",
  "BF_ENV",
  "DATABASE_BACKEND",
  "DATABASE_URL",
  "JWT_SECRET",
  "OPENAI_API_KEY",
  "OPENAI_BASE_URL",
  "OPENAI_ORG_ID",
  "OPENAI_PROJECT_ID",
  "UNIT-TEST-SECRET",
  "WEB_PORT",
] as const;

export type PublicConfigKey  = typeof PUBLIC_CONFIG_KEYS[number];
export type PrivateConfigKey = typeof PRIVATE_CONFIG_KEYS[number];
export type ConfigKey        = PublicConfigKey | PrivateConfigKey;

export type PublicConfigMap  = { [K in PublicConfigKey]: string };
export type PrivateConfigMap = { [K in PrivateConfigKey]: string };
export type ConfigMap        = PublicConfigMap & PrivateConfigMap;
