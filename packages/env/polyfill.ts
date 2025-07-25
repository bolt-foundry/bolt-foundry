// Deno polyfill for import.meta.env
if (typeof Deno !== "undefined" && !import.meta.env) {
  const env = loadEnvironmentVariables();

  Object.defineProperty(import.meta, "env", {
    value: new Proxy({
      MODE: env.NODE_ENV || env.DENO_ENV || "development",
      BASE_URL: "/",
      PROD: (env.NODE_ENV || env.DENO_ENV) === "production",
      DEV: (env.NODE_ENV || env.DENO_ENV) !== "production",
      SSR: true,
    }, {
      get(target: any, key: string) {
        if (key in target) return target[key];
        const value = env[key];
        return value === "true" ? true : value === "false" ? false : value;
      },
    }),
    writable: false,
    configurable: false,
  });
}

function loadEnvironmentVariables(): Record<string, string> {
  const env: Record<string, string> = {};

  // Load .env files in priority order (lowest to highest)
  const envFiles = [".env.client", ".env.server", ".env.local"];

  for (const file of envFiles) {
    try {
      const content = Deno.readTextFileSync(file);
      Object.assign(env, parseEnvFile(content));
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }

  // System environment variables have highest priority and override all file-based values
  Object.assign(env, Deno.env.toObject());

  return env;
}

function parseEnvFile(content: string): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      let value = valueParts.join("=");
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  }

  return vars;
}