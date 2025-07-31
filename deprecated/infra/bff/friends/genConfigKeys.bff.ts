#! /usr/bin/env -S bff
//
// Generate a key‑only helper file from 1Password.
//
//   ➜ deprecated/apps/boltFoundry/__generated__/configKeys.ts
//
// It exports:
//
//   PUBLIC_CONFIG_KEYS  – readonly array
//   PRIVATE_CONFIG_KEYS – readonly array
//   CONFIG_KEYS         – readonly array (public + private)
//   PublicConfigKey     – union of public keys
//   PrivateConfigKey    – union of private keys
//   ConfigKey           – union of *all* keys
//   PublicConfigMap     – {[K in PublicConfigKey]: string}
//   PrivateConfigMap    – {[K in PrivateConfigKey]: string}
//   ConfigMap           – PublicConfigMap & PrivateConfigMap
//   ClientEnvironment   – {[K in PublicConfigKey]?: string | boolean}
//
// Usage:
//   bff gen-config-keys
//     [--vault <vault>]                 (default "Shared" or $OP_VAULT)
//     [--publicTag bolt-foundry-frontend-public]
//     [--privateTag bolt-foundry-backend-private]
//
// Needs an authenticated `op` CLI session (or service-account token).

import { register } from "@bfmono/infra/bff/bff.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const td = new TextDecoder();
const logger = getLogger(import.meta);

let vaultId: string;
async function firstVault(): Promise<string> {
  if (vaultId) return vaultId;

  const { stdout } = await new Deno.Command("op", {
    args: ["vault", "list", "--format=json"],
    stdout: "piped",
  }).output();

  const vaults: Array<{ id: string }> = JSON.parse(td.decode(stdout));
  if (!vaults.length) throw new Error("No 1Password vaults visible");
  if (vaults.length > 1) {
    throw new Error("Multiple vaults visible; hard‑coding not yet supported");
  }
  vaultId = vaults[0].id;
  return vaultId;
}

export async function genConfigKeys(
  [vault, publicTag, privateTag]: Array<string>,
) {
  const VAULT = vault ?? await firstVault() ?? "Shared";
  const PUB_TAG = publicTag ?? "bolt-foundry-frontend-public";
  const PRIV_TAG = privateTag ?? "bolt-foundry-backend-private";

  // helper – list item titles (upper‑cased) for a given tag
  async function fetchKeys(tag: string): Promise<Array<string>> {
    const { success, stdout, stderr } = await new Deno.Command("op", {
      args: [
        "item",
        "list",
        "--vault",
        VAULT,
        "--format",
        "json",
        "--tags",
        tag,
      ],
      stdout: "piped",
      stderr: "piped",
    }).output();

    if (!success) throw new Error(td.decode(stderr));
    const items: Array<{ title: string }> = JSON.parse(td.decode(stdout));
    return items.map((i) => i.title.trim().toUpperCase()).sort();
  }

  const [pubKeys, privKeys] = await Promise.all([
    fetchKeys(PUB_TAG),
    fetchKeys(PRIV_TAG),
  ]);

  if (!pubKeys.length && !privKeys.length) {
    logger.warn(`No items found for either tag in vault "${VAULT}".`);
    return 1;
  }

  /* ------------------------------------------------------------------ */
  /*  Emit deprecated/apps/boltFoundry/__generated__/configKeys.ts       */
  /* ------------------------------------------------------------------ */
  const dest = "deprecated/apps/boltFoundry/__generated__/configKeys.ts";

  const lines: Array<string> = [
    "/* @generated */",
    "",
    `// Source vault: "${VAULT}"`,
    `// Public tag  : "${PUB_TAG}"  (${pubKeys.length} keys)`,
    `// Private tag : "${PRIV_TAG}" (${privKeys.length} keys)`,
    "",
    "export const PUBLIC_CONFIG_KEYS = [",
    ...pubKeys.map((k) => `  ${JSON.stringify(k)},`),
    "] as const;",
    "",
    "export const PRIVATE_CONFIG_KEYS = [",
    ...privKeys.map((k) => `  ${JSON.stringify(k)},`),
    "] as const;",
    "",
    "// All keys (public + private) – do *not* ship private values to the client!",
    "export const CONFIG_KEYS = [",
    "  ...PUBLIC_CONFIG_KEYS,",
    "  ...PRIVATE_CONFIG_KEYS,",
    "] as const;",
    "",
    "export type PublicConfigKey  = typeof PUBLIC_CONFIG_KEYS[number];",
    "export type PrivateConfigKey = typeof PRIVATE_CONFIG_KEYS[number];",
    "export type ConfigKey        = typeof CONFIG_KEYS[number];",
    "",
    "export type PublicConfigMap  = { [K in PublicConfigKey]: string };",
    "export type PrivateConfigMap = { [K in PrivateConfigKey]: string };",
    "export type ConfigMap        = PublicConfigMap & PrivateConfigMap;",
    "",
    "// Shape of globalThis.__ENVIRONMENT__ on the browser:",
    "export type ClientEnvironment = {",
    "  [K in PublicConfigKey]?: string | boolean;",
    "};",
    "",
  ];

  await Deno.writeTextFile(dest, lines.join("\n"));
  logger.info(
    `✅  ${dest} written with ${pubKeys.length + privKeys.length} key names`,
  );
  return 0;
}

register(
  "genConfigKeys",
  "Generate key‑only config helper from 1Password",
  genConfigKeys,
);
