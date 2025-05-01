type Maybe<T> = T | undefined;

const isSet = (v: string | undefined): v is string => !!v?.trim();
const cache = new Map<string, Promise<string | undefined>>();

function cachedResolve(ref: string): Promise<string | undefined> {
  if (cache.has(ref)) return cache.get(ref)!; // 🏦 hit

  const cmd = new Deno.Command("op", {
    args: ["read", ref],
    stdout: "piped",
    stderr: "piped",
  });

  const promise = cmd.output().then(({ success, stdout, stderr }) => {
    if (!success) {
      cache.delete(ref);
      const errorMsg = new TextDecoder().decode(stderr);
      throw new Error(`Failed to resolve ${ref}: ${errorMsg}`);
    }
    return new TextDecoder().decode(stdout).trim();
  });

  cache.set(ref, promise);
  return promise;
}

function browserEnv(name: string): Maybe<string> {
  // @ts-expect-error: we haven't typed the environment, it's in the browser.
  return globalThis.window && globalThis.__ENVIRONMENT__?.[name];
}

function runtimeEnv(name: string): Maybe<string> {
  if (typeof Deno !== "undefined") return Deno.env.get(name);
  return undefined;
}

const text = new TextDecoder();

async function firstVault(): Promise<string> {
  const { stdout } = await new Deno.Command("op", {
    args: ["vault", "list", "--format", "json"],
    stdout: "piped",
  }).output();
  const vaults = JSON.parse(text.decode(stdout));
  if (!vaults.length) throw new Error("No vaults visible to this account");
  if (vaults.length > 1) {
    throw new Error("Multiple vaults visible to this account");
  }
  return vaults[0].id;
}

async function onePasswordEnv(name: string): Promise<Maybe<string>> {
  const vault = await firstVault();
  const secretRef = `op://${vault}/${name}/value`;

  return cachedResolve(secretRef);
}

export function getConfigurationVariable(
  name: string,
): Maybe<string> {
  const fromBrowser = browserEnv(name);
  if (isSet(fromBrowser)) return fromBrowser;

  const fromRuntime = runtimeEnv(name);
  if (isSet(fromRuntime)) return fromRuntime;
}

export async function fetchConfigurationVariable(
  name: string,
): Promise<string | undefined> {
  const fromSync = getConfigurationVariable(name);
  if (isSet(fromSync)) return fromSync;
  const fromVault = await onePasswordEnv(name);
  return isSet(fromVault) ? fromVault : undefined;
}
