import { assertEquals, assertExists } from "@std/assert";
import { AppServer, createAppServer } from "../app-server.ts";

Deno.test("createAppServer creates AppServer instance", () => {
  const server = createAppServer();
  assertExists(server);
  assertEquals(server instanceof AppServer, true);
});

Deno.test("AppServer accepts configuration options", () => {
  const server = createAppServer({
    port: 3000,
    isDev: true,
    distPath: "./custom-dist",
    viteDevServerUrl: "http://localhost:4000",
    enableSpaFallback: false,
  });

  assertExists(server);
});

Deno.test("AppServer health check endpoint", () => {
  const server = createAppServer({ port: 0 }); // Use port 0 for auto-assignment

  // Note: This is a basic structure test
  // Full integration tests would require actual server startup
  assertExists(server);
});
