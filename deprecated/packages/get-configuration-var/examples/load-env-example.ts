#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Test the simpler loadEnv approach
 * No --preload flag needed!
 */

import { loadEnv } from "@bfmono/deprecated/packages/get-configuration-var/load-env.ts";

// Load environment variables at the top of the module
await loadEnv(import.meta, { debug: true });

console.log("\n=== Testing Simple loadEnv Approach ===\n");

// Now we can use import.meta.env just like in Vite!
console.log("1. Standard Vite env vars:");
console.log(`   import.meta.env.MODE: ${import.meta.env.MODE}`);
console.log(`   import.meta.env.DEV: ${import.meta.env.DEV}`);
console.log(`   import.meta.env.PROD: ${import.meta.env.PROD}`);
console.log(`   import.meta.env.SSR: ${import.meta.env.SSR}`);
console.log(`   import.meta.env.BASE_URL: ${import.meta.env.BASE_URL}`);

console.log("\n2. Custom env vars from .env.local:");
console.log(
  `   import.meta.env.TEST_VAR_FROM_ENV_LOCAL: ${import.meta.env.TEST_VAR_FROM_ENV_LOCAL}`,
);
console.log(`   import.meta.env.CUSTOM_VAR: ${import.meta.env.CUSTOM_VAR}`);
console.log(
  `   import.meta.env.TEST_API_TOKEN: ${
    import.meta.env.TEST_API_TOKEN ? "[FOUND]" : "[NOT FOUND]"
  }`,
);

console.log("\n3. Type safety test:");
// TypeScript would know about these properties if we had proper types
const config = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  apiToken: import.meta.env.TEST_API_TOKEN,
  customVar: import.meta.env.CUSTOM_VAR,
};
console.log(
  "   Config created successfully:",
  Object.keys(config).length === 4,
);

console.log("\n=== Test Complete ===\n");

// Demonstrate that it persists in the same module
console.log("4. Persistence check:");
function checkEnvLater() {
  console.log(
    `   Still available: ${import.meta.env.CUSTOM_VAR ? "YES" : "NO"}`,
  );
}
checkEnvLater();
