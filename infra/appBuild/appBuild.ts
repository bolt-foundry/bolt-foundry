#!/usr/bin/env -S deno run -A

import * as esbuild from "esbuild";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

const logger = getLogger(import.meta);

import mdx from "@mdx-js/esbuild";

const defaultOptions: esbuild.BuildOptions = {
  outdir: "static/build",
  bundle: true,
  splitting: true,
  format: "esm",
  jsx: "automatic",
  minify: getConfigurationVariable("BF_ENV") === "PRODUCTION",
  sourcemap: "inline",
  sourceRoot: getConfigurationVariable("BF_PATH"),
  write: true,

  // So that file-loader references become "/static/build/assets/..."
  publicPath: "/static/build",
  assetNames: "assets/[name]-[hash]",
  plugins: [
    mdx(),
  ],
  treeShaking: true,

  entryPoints: [
    "apps/boltFoundry/ClientRoot.tsx",
  ],
  external: [
    "posthog-node",
  ],
};

export async function build(
  buildOptions: esbuild.BuildOptions = defaultOptions,
) {
  logger.info("Building...");

  const result = await esbuild.build({
    ...defaultOptions,
    ...buildOptions,
  });

  esbuild.stop();
  logger.info("Building complete!!!");
  return result;
}

if (import.meta.main) {
  try {
    await Deno.mkdir("build", { recursive: true });
  } catch (e) {
    if ((e as Error).name !== "AlreadyExists") {
      throw e;
    }
  }
  try {
    await build();
  } catch (e) {
    throw e;
  }
}
