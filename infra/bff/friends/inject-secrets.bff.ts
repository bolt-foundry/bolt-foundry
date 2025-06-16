import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { KNOWN_KEYS } from "packages/get-configuration-var/get-configuration-var.ts";
import { getLogger } from "packages/logger/logger.ts";
import { register } from "infra/bff/bff.ts";

const logger = getLogger(import.meta);

register(
  "inject-secrets",
  "Inject secrets from 1Password into .env.local file",
  async (args) => {
    const vaultArg = args.includes("--vault")
      ? args[args.indexOf("--vault") + 1]
      : undefined;
    const force = args.includes("--force");
    const output = ".env.local";
    const template = ".env.local.template";

    // Check if output file already exists
    if (!force) {
      try {
        await Deno.stat(output);
        logger.error(
          `${output} already exists. Use --force to overwrite or delete it manually.`,
        );
        return 1;
      } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
          throw e;
        }
        // File doesn't exist, we can proceed
      }
    }

    // Get vault ID from env or argument
    const vaultId = vaultArg || getConfigurationVariable("BF_VAULT_ID");

    // If no vault ID provided, try to discover it
    let vault = vaultId;
    if (!vault) {
      logger.info("No vault ID provided, discovering available vaults...");

      const { success, stdout, stderr } = await new Deno.Command("op", {
        args: ["vault", "list", "--format=json"],
        stdout: "piped",
        stderr: "piped",
      }).output();

      if (!success) {
        logger.error(
          `Failed to list vaults: ${new TextDecoder().decode(stderr).trim()}`,
        );
        return 1;
      }

      const vaults = JSON.parse(new TextDecoder().decode(stdout)) as Array<{
        id: string;
        name: string;
      }>;

      if (!vaults.length) {
        logger.error(
          "No 1Password vaults found. Make sure you're signed in with 'op signin'",
        );
        return 1;
      }

      // Look for Bolt Foundry vault
      const bfVault = vaults.find((v) =>
        v.name.toLowerCase().includes("bolt") ||
        v.name.toLowerCase().includes("foundry") ||
        v.name.toLowerCase().includes("bf")
      );

      if (bfVault) {
        vault = bfVault.id;
        logger.info(
          `Using Bolt Foundry vault: ${bfVault.name} (${bfVault.id})`,
        );
      } else {
        vault = vaults[0].id;
        logger.warn(
          `No Bolt Foundry vault found, using first vault: ${vaults[0].name}`,
        );
        logger.info("Available vaults:");
        vaults.forEach((v) => logger.info(`  ${v.name} (${v.id})`));
        logger.info(
          "Set BF_VAULT_ID environment variable to use a specific vault",
        );
      }
    }

    // Create template content
    const templateContent: Record<string, string> = {};

    // Check if a template file exists
    let keysToInject = KNOWN_KEYS;
    try {
      const existingTemplate = await Deno.readTextFile(template);
      // Parse existing template to get keys
      const lines = existingTemplate.split("\n");
      const templateKeys: Array<typeof KNOWN_KEYS[number]> = [];
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)=/);
        if (match) {
          templateKeys.push(match[1] as typeof KNOWN_KEYS[number]);
        }
      }
      if (templateKeys.length > 0) {
        keysToInject = templateKeys;
        logger.info(`Using keys from existing template: ${template}`);
      }
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) {
        throw e;
      }
      // Template doesn't exist, use all known keys
      logger.info(`No template found at ${template}, using all known keys`);
    }

    // Build template for op inject
    keysToInject.forEach((key) => {
      templateContent[key] = `op://${vault}/${key}/value`;
    });

    logger.info(`Injecting ${keysToInject.length} secrets from 1Password...`);

    // Run op inject
    const child = new Deno.Command("op", {
      args: ["inject", "--format=json"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    const writer = child.stdin.getWriter();
    await writer.write(
      new TextEncoder().encode(JSON.stringify(templateContent)),
    );
    await writer.close();

    const { success, stdout, stderr } = await child.output();

    if (!success) {
      logger.error(
        `1Password injection failed: ${new TextDecoder().decode(stderr)}`,
      );
      return 1;
    }

    const injected = JSON.parse(new TextDecoder().decode(stdout));

    // Write .env.local file
    const envLines: Array<string> = [];
    let successCount = 0;
    let failureCount = 0;

    for (const [key, value] of Object.entries(injected)) {
      if (value && value !== `op://${vault}/${key}/value`) {
        envLines.push(`${key}=${value}`);
        successCount++;
      } else {
        logger.debug(`Secret not found in 1Password: ${key}`);
        failureCount++;
      }
    }

    await Deno.writeTextFile(output, envLines.join("\n") + "\n");

    logger.info(`✅ Created ${output} with ${successCount} secrets`);
    if (failureCount > 0) {
      logger.warn(`⚠️  ${failureCount} secrets were not found in 1Password`);
    }

    // Also create/update template file if it doesn't exist
    if (!(await Deno.stat(template).catch(() => false))) {
      const templateLines = keysToInject.map((key) => `${key}=`);
      await Deno.writeTextFile(template, templateLines.join("\n") + "\n");
      logger.info(`✅ Created template file: ${template}`);
    }

    return 0;
  },
);
