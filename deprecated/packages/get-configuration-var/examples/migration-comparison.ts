#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Comparison of different approaches for environment variable access
 */

console.log("=== Environment Variable Access Approaches ===\n");

console.log("1. OLD APPROACH - getConfigurationVariable:");
console.log("```typescript");
console.log(
  'import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";',
);
console.log("");
console.log('const apiKey = getConfigurationVariable("API_KEY");');
console.log('const dbUrl = getConfigurationVariable("DATABASE_URL");');
console.log("```");
console.log("❌ Verbose syntax");
console.log("❌ No type safety");
console.log("❌ No autocomplete");

console.log("\n2. PRELOAD APPROACH - Complex setup:");
console.log("```bash");
console.log("# Must include --preload flag everywhere");
console.log("deno run --preload=infra/preload/env-preload.ts script.ts");
console.log("```");
console.log("```typescript");
console.log(
  'import { env } from "@bolt-foundry/get-configuration-var/preload-adapter";',
);
console.log("");
console.log("const apiKey = env.API_KEY;");
console.log("```");
console.log("✅ Better syntax");
console.log("❌ Requires --preload flag on every run");
console.log("❌ Complex setup with global proxies");

console.log("\n3. NEW APPROACH - Simple loadEnv:");
console.log("```typescript");
console.log(
  'import { loadEnv } from "@bolt-foundry/get-configuration-var/load-env";',
);
console.log("");
console.log("// Just one line at the top of your module");
console.log("await loadEnv(import.meta);");
console.log("");
console.log("// Then use import.meta.env like in Vite!");
console.log("const apiKey = import.meta.env.API_KEY;");
console.log("const dbUrl = import.meta.env.DATABASE_URL;");
console.log("");
console.log("// Works with destructuring");
console.log("const { API_KEY, DATABASE_URL } = import.meta.env;");
console.log("```");
console.log("✅ Standard Vite-compatible syntax");
console.log("✅ No special flags needed");
console.log("✅ Simple one-line setup");
console.log("✅ Type safety potential");
console.log("✅ Works with existing tooling");

console.log("\n4. GRADUAL MIGRATION:");
console.log("```typescript");
console.log(
  'import { loadEnv } from "@bolt-foundry/get-configuration-var/load-env";',
);
console.log(
  'import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";',
);
console.log("");
console.log("await loadEnv(import.meta);");
console.log("");
console.log("// Both work during migration!");
console.log("const apiKey1 = import.meta.env.API_KEY;");
console.log('const apiKey2 = getConfigurationVariable("API_KEY");');
console.log("console.log(apiKey1 === apiKey2); // true");
console.log("```");

console.log("\n=== Recommendation ===");
console.log("\nUse the new loadEnv approach because:");
console.log("1. It's the simplest - just one function call");
console.log("2. It uses standard import.meta.env syntax");
console.log("3. No command-line flags to remember");
console.log("4. Compatible with Vite and other tools");
console.log("5. Easy gradual migration path");
