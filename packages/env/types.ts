// Re-export the global types so they're available from this module
export type { ImportMetaEnv } from "@bfmono/env.d.ts";

// Helper type for the env proxy
export type EnvProxy = Record<string, string | boolean | undefined> & {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
};
