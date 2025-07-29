#!/usr/bin/env -S bft run

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import type { TaskDefinition } from "../bft.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { formatEnvFile, parseEnvFile } from "@bfmono/packages/env/utils.ts";

const logger = getLogger(import.meta);

export const bftDefinition = {
  description: "Manage secrets and environment variables",
  aiSafe: (args: Array<string>) => {
    const subcommand = args[0];
    return ["list", "help"].includes(subcommand);
  },
  fn: secretsTask,
} satisfies TaskDefinition;

async function secretsTask(args: Array<string>): Promise<number> {
  if (args.length === 0) {
    ui.error("Usage: bft secrets <command> [args...]");
    ui.info("Commands:");
    ui.info(
      "  sync                 - Sync all variables to .env.client and .env.server",
    );
    ui.info(
      "  sync --client-only   - Sync only client variables to .env.client",
    );
    ui.info(
      "  sync --server-only   - Sync only server variables to .env.server",
    );
    ui.info(
      "  list                 - List all available environment variables",
    );
    ui.info(
      "  generate-types       - Generate TypeScript definitions from example files",
    );
    return 1;
  }

  const subcommand = args[0];
  const commandArgs = args.slice(1);

  switch (subcommand) {
    case "sync":
      return await syncSecretsFromOnePassword(commandArgs);
    case "list":
      return await listAvailableSecrets();
    case "generate-types":
      return await generateTypes();
    default:
      ui.error(`Unknown command: ${subcommand}`);
      return 1;
  }
}

async function syncSecretsFromOnePassword(
  args: Array<string>,
): Promise<number> {
  const clientOnly = args.includes("--client-only");
  const serverOnly = args.includes("--server-only");
  const force = args.includes("--force");

  // Read variable names from example files
  const clientKeys = await getExampleKeys(".env.client.example");
  const serverKeys = await getExampleKeys(".env.server.example");

  if (clientKeys.length === 0 && serverKeys.length === 0) {
    ui.error(
      "No .env.example files found. Create .env.client.example and .env.server.example first.",
    );
    return 1;
  }

  const allKeys = [...clientKeys, ...serverKeys];
  let keysToFetch = allKeys;
  if (clientOnly) keysToFetch = clientKeys;
  if (serverOnly) keysToFetch = serverKeys;

  // Check if target files exist and --force not used
  const filesToCheck = clientOnly
    ? [".env.client"]
    : serverOnly
    ? [".env.server"]
    : [".env.client", ".env.server"];

  if (!force) {
    for (const file of filesToCheck) {
      try {
        await Deno.stat(file);
        ui.error(`${file} already exists. Use --force to overwrite.`);
        return 1;
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
          throw error;
        }
      }
    }
  }

  // Get vault ID
  let vaultId = getConfigurationVariable("BF_VAULT_ID");

  if (!vaultId) {
    const selectedVault = await selectVault();
    if (!selectedVault) {
      ui.error("No vault selected. Set BF_VAULT_ID or select interactively.");
      return 1;
    }
    vaultId = selectedVault;
  }

  // Build template for op inject
  const template: Record<string, string> = {};
  keysToFetch.forEach((key) => {
    template[key] = `op://${vaultId}/${key}/value`;
  });

  try {
    // Check if 1Password CLI is available
    const opCheck = new Deno.Command("op", {
      args: ["--version"],
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const { code: opCheckCode } = await opCheck.output();

    if (opCheckCode !== 0) {
      logger.warn(
        "1Password CLI not available. Creating empty env files for development.",
      );
      await writeEnvFiles(
        keysToFetch,
        {},
        clientKeys,
        serverKeys,
        clientOnly,
        serverOnly,
      );
      ui.info(`Created empty env files for ${keysToFetch.length} variables`);
      ui.info(
        "Install 1Password CLI and run 'bft secrets sync --force' to populate with real values",
      );

      // Still generate types
      await generateTypes();
      return 0;
    }

    // Run op inject with template
    const child = new Deno.Command("op", {
      args: ["inject", "--format=json"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const writer = child.stdin.getWriter();
    await writer.write(new TextEncoder().encode(JSON.stringify(template)));
    await writer.close();

    const { code, stdout, stderr } = await child.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      logger.warn(`1Password injection failed: ${errorText}`);
      logger.info("Creating empty env files for development");

      // Create fallback files with empty values
      await writeEnvFiles(
        keysToFetch,
        {},
        clientKeys,
        serverKeys,
        clientOnly,
        serverOnly,
      );
      ui.info(`Created empty env files for ${keysToFetch.length} variables`);
      return 0;
    }

    // Parse successful result
    const injected = JSON.parse(new TextDecoder().decode(stdout));

    // Write secrets to appropriate files
    const successCount = await writeEnvFiles(
      keysToFetch,
      injected,
      clientKeys,
      serverKeys,
      clientOnly,
      serverOnly,
    );

    const filesWritten = clientOnly
      ? ".env.client"
      : serverOnly
      ? ".env.server"
      : ".env.client and .env.server";

    ui.info(`✅ Synced ${successCount} secrets to ${filesWritten}`);

    // Auto-generate TypeScript definitions
    await generateTypes();

    if (successCount < keysToFetch.length) {
      ui.warn(
        `⚠️  ${keysToFetch.length - successCount} secrets failed to sync`,
      );
    }

    return 0;
  } catch (error) {
    logger.error(
      `Failed to sync secrets: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 1;
  }
}

async function getExampleKeys(filePath: string): Promise<Array<string>> {
  try {
    const content = await Deno.readTextFile(filePath);
    return Object.keys(parseEnvFile(content));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      logger.info(`Example file ${filePath} not found`);
      return [];
    }
    throw error;
  }
}

async function writeEnvFiles(
  keysToFetch: ReadonlyArray<string>,
  injected: Record<string, string>,
  allClientKeys: Array<string>,
  allServerKeys: Array<string>,
  clientOnly: boolean,
  serverOnly: boolean,
): Promise<number> {
  let successCount = 0;

  // Separate keys into client and server groups
  const clientKeys = keysToFetch.filter((key) => allClientKeys.includes(key));
  const serverKeys = keysToFetch.filter((key) => allServerKeys.includes(key));

  // Write .env.client file
  if (!serverOnly && clientKeys.length > 0) {
    const clientVars: Record<string, string> = {};
    for (const key of clientKeys) {
      const value = injected[key];
      if (value && typeof value === "string") {
        clientVars[key] = value;
        successCount++;
      } else {
        clientVars[key] = "";
      }
    }
    await Deno.writeTextFile(".env.client", formatEnvFile(clientVars));
  }

  // Write .env.server file
  if (!clientOnly && serverKeys.length > 0) {
    const serverVars: Record<string, string> = {};
    for (const key of serverKeys) {
      const value = injected[key];
      if (value && typeof value === "string") {
        serverVars[key] = value;
        successCount++;
      } else {
        serverVars[key] = "";
      }
    }
    await Deno.writeTextFile(".env.server", formatEnvFile(serverVars));
  }

  return successCount;
}

async function listAvailableSecrets(): Promise<number> {
  const clientKeys = await getExampleKeys(".env.client.example");
  const serverKeys = await getExampleKeys(".env.server.example");

  if (clientKeys.length === 0 && serverKeys.length === 0) {
    ui.error("No .env.example files found.");
    ui.info(
      "Create .env.client.example and .env.server.example to define your environment variables.",
    );
    return 1;
  }

  ui.info("Available environment variables (from .env.example files):");
  ui.info("");

  if (clientKeys.length > 0) {
    ui.info("Client variables (safe for browser, from .env.client.example):");
    clientKeys.forEach((key) => {
      ui.info(`  ${key}`);
    });
    ui.info("");
  }

  if (serverKeys.length > 0) {
    ui.info("Server variables (backend only, from .env.server.example):");
    serverKeys.forEach((key) => {
      ui.info(`  ${key}`);
    });
    ui.info("");
  }

  const totalKeys = clientKeys.length + serverKeys.length;
  ui.info(
    `Total: ${totalKeys} variables (${clientKeys.length} client, ${serverKeys.length} server)`,
  );
  return 0;
}

async function selectVault(): Promise<string | null> {
  try {
    // List available vaults
    const child = new Deno.Command("op", {
      args: ["vault", "list", "--format=json"],
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const { code, stdout, stderr } = await child.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      logger.error(`Failed to list vaults: ${errorText}`);
      return null;
    }

    const vaults = JSON.parse(new TextDecoder().decode(stdout));

    if (vaults.length === 0) {
      ui.error(
        "No 1Password vaults found. Make sure you're signed in with 'op signin'",
      );
      return null;
    }

    if (vaults.length === 1) {
      ui.info(`Using vault: ${vaults[0].name} (${vaults[0].id})`);
      return vaults[0].id;
    }

    // Look for Bolt Foundry vault first
    // deno-lint-ignore no-explicit-any
    const bfVault = vaults.find((v: any) =>
      v.name.toLowerCase().includes("bolt") ||
      v.name.toLowerCase().includes("foundry") ||
      v.name.toLowerCase().includes("bf")
    );

    if (bfVault) {
      ui.info(
        `Auto-selected Bolt Foundry vault: ${bfVault.name} (${bfVault.id})`,
      );
      return bfVault.id;
    }

    // Interactive selection for multiple vaults
    ui.info("Multiple vaults found. Please select one:");
    // deno-lint-ignore no-explicit-any
    vaults.forEach((v: any, index: number) => {
      ui.info(`  ${index + 1}. ${v.name} (${v.id})`);
    });

    const input = prompt("Enter vault number (1-" + vaults.length + "):");
    const selection = parseInt(input || "0", 10);

    if (selection >= 1 && selection <= vaults.length) {
      const selectedVault = vaults[selection - 1];
      ui.info(`Selected vault: ${selectedVault.name} (${selectedVault.id})`);
      ui.info(
        `To avoid this prompt, set: export BF_VAULT_ID=${selectedVault.id}`,
      );
      return selectedVault.id;
    }

    ui.error("Invalid selection");
    return null;
  } catch (error) {
    logger.error(
      `Failed to select vault: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}

async function generateTypes(): Promise<number> {
  try {
    const { generateEnvTypes } = await import(
      "@bfmono/packages/env/generate-types.ts"
    );
    const types = await generateEnvTypes();
    await Deno.writeTextFile("env.d.ts", types);
    ui.info("✅ Generated environment-aware TypeScript definitions");
    return 0;
  } catch (error) {
    ui.warn(
      `⚠️  Failed to generate TypeScript definitions: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 1;
  }
}

// When run directly as a script
if (import.meta.main) {
  Deno.exit(await secretsTask(Deno.args));
}
