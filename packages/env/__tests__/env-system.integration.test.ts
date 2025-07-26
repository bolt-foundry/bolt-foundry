import { assertEquals, assertExists } from "@std/assert";
import { parseEnvFile, formatEnvFile } from "../utils.ts";
import { join } from "@std/path";

// Create a test directory for isolated testing
const testDir = await Deno.makeTempDir({ prefix: "env-test-" });

// Helper to create test files
async function createTestFile(filename: string, content: string) {
  await Deno.writeTextFile(join(testDir, filename), content);
}

// Helper to read test files
async function readTestFile(filename: string): Promise<string> {
  return await Deno.readTextFile(join(testDir, filename));
}

// Helper to run commands in test directory
async function runCommand(cmd: string[], cwd = testDir): Promise<{ stdout: string; stderr: string; code: number }> {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    cwd,
    stdout: "piped",
    stderr: "piped",
    env: {
      ...Deno.env.toObject(),
      // Override to use test directory
      DENO_DIR: join(testDir, ".deno"),
    },
  });

  const child = command.spawn();
  const output = await child.output();
  
  return {
    stdout: new TextDecoder().decode(output.stdout),
    stderr: new TextDecoder().decode(output.stderr),
    code: output.code,
  };
}

Deno.test("Environment System Integration Tests", async (t) => {
  // Set up test environment files
  await t.step("setup test environment", async () => {
    await createTestFile(".env.client.example", `# Client variables
POSTHOG_API_KEY=phc_test_key
LOG_LEVEL=debug
GOOGLE_OAUTH_CLIENT_ID=test.apps.googleusercontent.com
`);

    await createTestFile(".env.server.example", `# Server variables
DATABASE_URL=postgresql://test:test@localhost:5432/test
JWT_SECRET=test_secret_key_at_least_32_chars_long
OPENAI_API_KEY=sk-test-key
EMAIL_HOST=smtp.test.com
`);
  });

  await t.step("parseEnvFile correctly parses environment files", async () => {
    const content = `# Comment line
KEY1=value1
KEY2="quoted value"
KEY3='single quoted'
EMPTY=
MULTIWORD=hello world
SPECIAL_CHARS=test@example.com
WITH_EQUALS=key=value
ESCAPED="line1\\nline2"
`;
    
    const parsed = parseEnvFile(content);
    
    assertEquals(parsed.KEY1, "value1");
    assertEquals(parsed.KEY2, "quoted value");
    assertEquals(parsed.KEY3, "single quoted");
    assertEquals(parsed.EMPTY, "");
    assertEquals(parsed.MULTIWORD, "hello world");
    assertEquals(parsed.SPECIAL_CHARS, "test@example.com");
    assertEquals(parsed.WITH_EQUALS, "key=value");
    assertEquals(parsed.ESCAPED, "line1\nline2");
  });

  await t.step("formatEnvFile correctly formats variables", () => {
    const vars = {
      SIMPLE: "value",
      WITH_SPACE: "hello world",
      WITH_QUOTE: 'value with "quotes"',
      WITH_NEWLINE: "line1\nline2",
      EMPTY: "",
    };
    
    const formatted = formatEnvFile(vars);
    
    assertEquals(formatted.includes('SIMPLE=value'), true);
    assertEquals(formatted.includes('WITH_SPACE="hello world"'), true);
    assertEquals(formatted.includes('WITH_QUOTE="value with \\"quotes\\""'), true);
    assertEquals(formatted.includes('WITH_NEWLINE="line1\\nline2"'), true);
    assertEquals(formatted.includes('EMPTY='), true);
  });

  await t.step("polyfill loads environment variables in correct order", async () => {
    // Create test env files
    await createTestFile(".env.client", "TEST_VAR=client_value\nCLIENT_ONLY=true");
    await createTestFile(".env.server", "TEST_VAR=server_value\nSERVER_ONLY=true");
    await createTestFile(".env.local", "TEST_VAR=local_value\nLOCAL_ONLY=true");

    // Create a test script that uses the polyfill
    const testScript = `
import "${Deno.cwd()}/packages/env/polyfill.ts";

// Should have loaded env vars with correct precedence
console.log(JSON.stringify({
  TEST_VAR: import.meta.env.TEST_VAR,
  CLIENT_ONLY: import.meta.env.CLIENT_ONLY,
  SERVER_ONLY: import.meta.env.SERVER_ONLY,
  LOCAL_ONLY: import.meta.env.LOCAL_ONLY,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  SSR: import.meta.env.SSR,
}));
`;

    await createTestFile("test-polyfill.ts", testScript);
    
    const result = await runCommand(["deno", "run", "--allow-read", "--allow-env", "test-polyfill.ts"]);
    assertEquals(result.code, 0, `Script failed: ${result.stderr}`);
    
    const output = JSON.parse(result.stdout);
    
    // .env.local should override others
    assertEquals(output.TEST_VAR, "local_value");
    assertEquals(output.CLIENT_ONLY, "true");
    assertEquals(output.SERVER_ONLY, "true");
    assertEquals(output.LOCAL_ONLY, "true");
    
    // Default values
    assertEquals(output.MODE, "development");
    assertEquals(output.PROD, false);
    assertEquals(output.DEV, true);
    assertEquals(output.SSR, true);
  });

  await t.step("bft secrets sync creates env files", async () => {
    // Test the sync command (without 1Password)
    const syncScript = `
import { secretsTask } from "${Deno.cwd()}/infra/bft/tasks/secrets.bft.ts";

// Change to test directory
Deno.chdir("${testDir}");

// Run sync command
const exitCode = await secretsTask(["sync", "--force"]);
Deno.exit(exitCode);
`;

    await createTestFile("test-sync.ts", syncScript);
    
    const result = await runCommand([
      "deno", "run", 
      "--allow-read", "--allow-write", "--allow-env", "--allow-run",
      "--import-map", join(Deno.cwd(), "deno.jsonc"),
      "test-sync.ts"
    ]);
    
    assertEquals(result.code, 0, `Sync failed: ${result.stderr}`);
    
    // Check that files were created
    const clientEnv = await readTestFile(".env.client");
    const serverEnv = await readTestFile(".env.server");
    
    assertExists(clientEnv);
    assertExists(serverEnv);
    
    // Files should have the expected variables (empty values since no 1Password)
    assertEquals(clientEnv.includes("POSTHOG_API_KEY="), true);
    assertEquals(clientEnv.includes("LOG_LEVEL="), true);
    assertEquals(serverEnv.includes("DATABASE_URL="), true);
    assertEquals(serverEnv.includes("JWT_SECRET="), true);
  });

  await t.step("type generation creates correct TypeScript definitions", async () => {
    const genScript = `
import { generateEnvTypes } from "${Deno.cwd()}/packages/env/generate-types.ts";

// Change to test directory
Deno.chdir("${testDir}");

// Generate types
const types = await generateEnvTypes();
await Deno.writeTextFile("env.d.ts", types);
`;

    await createTestFile("test-generate.ts", genScript);
    
    const result = await runCommand([
      "deno", "run", 
      "--allow-read", "--allow-write",
      "test-generate.ts"
    ]);
    
    assertEquals(result.code, 0, `Generate failed: ${result.stderr}`);
    
    // Check generated types
    const types = await readTestFile("env.d.ts");
    
    // Should include client variables
    assertEquals(types.includes("readonly POSTHOG_API_KEY?: string;"), true);
    assertEquals(types.includes("readonly LOG_LEVEL?: string;"), true);
    
    // Should include server variables
    assertEquals(types.includes("readonly DATABASE_URL?: string;"), true);
    assertEquals(types.includes("readonly JWT_SECRET?: string;"), true);
    
    // Should have environment-aware interfaces
    assertEquals(types.includes("interface Client extends BaseImportMetaEnv"), true);
    assertEquals(types.includes("interface Server extends BaseImportMetaEnv"), true);
  });

  await t.step("vite plugin only exposes client variables", async () => {
    // This tests the security boundary
    const viteScript = `
import { boltFoundryEnvPlugin } from "${Deno.cwd()}/packages/env/vite-plugin.ts";

// Change to test directory
Deno.chdir("${testDir}");

// Create test env files
await Deno.writeTextFile(".env.client", "CLIENT_VAR=client_value\\n");
await Deno.writeTextFile(".env.server", "SERVER_SECRET=secret_value\\n");

// Mock Vite config
const mockConfig = { base: "/" };
const plugin = boltFoundryEnvPlugin();

// Call the config hook
const result = plugin.config(mockConfig, { mode: "development" });

// Check that only client vars are defined
const hasClientVar = "import.meta.env.CLIENT_VAR" in result.define;
const hasServerVar = "import.meta.env.SERVER_SECRET" in result.define;

console.log(JSON.stringify({
  hasClientVar,
  hasServerVar,
  clientValue: result.define["import.meta.env.CLIENT_VAR"],
}));
`;

    await createTestFile("test-vite.ts", viteScript);
    
    const result = await runCommand([
      "deno", "run", 
      "--allow-read", "--allow-write", "--allow-env",
      "--import-map", join(Deno.cwd(), "deno.jsonc"),
      "test-vite.ts"
    ]);
    
    assertEquals(result.code, 0, `Vite plugin test failed: ${result.stderr}`);
    
    const output = JSON.parse(result.stdout);
    
    // Client var should be included
    assertEquals(output.hasClientVar, true);
    assertEquals(output.clientValue, '"client_value"'); // JSON stringified
    
    // Server var should NOT be included (security boundary)
    assertEquals(output.hasServerVar, false);
  });

  await t.step("end-to-end workflow test", async () => {
    // Test the complete workflow
    const e2eScript = `
import "${Deno.cwd()}/packages/env/polyfill.ts";

// 1. Environment should be loaded
const logLevel = import.meta.env.LOG_LEVEL;
console.log("LOG_LEVEL:", logLevel || "not set");

// 2. Type checking should work (this is a compile-time check)
// The fact that this compiles means types are working
const typed: string | undefined = import.meta.env.POSTHOG_API_KEY;
console.log("Type check passed");

// 3. Server should have access to all vars
if (import.meta.env.SSR) {
  const dbUrl = import.meta.env.DATABASE_URL;
  console.log("Server can access DATABASE_URL:", dbUrl !== undefined);
}

console.log("SUCCESS");
`;

    await createTestFile("test-e2e.ts", e2eScript);
    
    const result = await runCommand([
      "deno", "run", 
      "--allow-read", "--allow-env",
      "--check",
      "test-e2e.ts"
    ]);
    
    assertEquals(result.code, 0, `E2E test failed: ${result.stderr}`);
    assertEquals(result.stdout.includes("SUCCESS"), true);
  });
});

// Cleanup
Deno.test("cleanup", () => {
  Deno.removeSync(testDir, { recursive: true });
});