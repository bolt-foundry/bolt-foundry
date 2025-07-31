#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Example usage of injectEnvironment
 */

import { injectEnvironment } from "./inject-environment.ts";

// Inject environment variables at the top of your module
await injectEnvironment(import.meta, { debug: true });

// Now you can use import.meta.env just like in Vite!
console.log("\n=== Environment Variables ===");
console.log("MODE:", import.meta.env.MODE);
console.log("DEV:", import.meta.env.DEV);
console.log("PROD:", import.meta.env.PROD);
console.log("SSR:", import.meta.env.SSR);
console.log("BASE_URL:", import.meta.env.BASE_URL);

// Access any environment variable
console.log("\n=== Custom Variables ===");
// In server context, DATABASE_URL would be available
// For dynamic access to variables not in the type definitions,
// we need to extend with Record<string, any>
const env = import.meta.env as ImportMetaEnv.Server & Record<string, any>;
console.log("DATABASE_URL:", env.DATABASE_URL || "(not set)");
console.log("API_KEY:", env.API_KEY || "(not set)");

// TypeScript knows about these!
const config = {
  isDev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  apiUrl: env.API_URL || "http://localhost:3000",
};

console.log("\n=== Config ===");
console.log(config);
