#! /usr/bin/env -S deno run -A

import { esbuild } from "infra/build/deps.ts";
import { generateBluey } from "lib/generateBluey.ts";
import { denoPlugin } from "infra/build/bffEsbuild.ts";
import { getLogger } from "deps.ts";
import { generateBluey } from "lib/generateBluey.ts";

const logger = getLogger(import.meta);

const denoFileResolver = {
  name: "deno-file-resolver",
  setup(build: esbuild.PluginBuild) {
    build.onResolve({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
      if (args.kind === "entry-point") {
        return;
      }
      const path = import.meta.resolve(args.path).split("file://")[1];
      const fileExists = await Deno.lstat(path).then(() => true).catch(() =>
        false
      );
      if (fileExists) {
        return {
          path,
        };
      }
      return null;
    });
  },
};

export async function build(
  buildOptions = {
    minify: true,
    sourcemap: "inline" as const,
    sourceRoot: `${Deno.cwd()}`,
  },
) {
  logger.info("Building...");
  await esbuild.build({
    bundle: true,
    entryPoints: [
      "packages/client/Client.tsx",
      "infra/internalbf.com/client/Client.tsx",
    ],
    write: true,
    outdir: "build/infra/internalbf.com/client",
    plugins: [
      // denoPlugin,
      denoFileResolver,
    ],
    format: "esm",
    external: ["npm:posthog-node@3.2.0", "/build/vcs/dev_bf.bundle.js"],
    treeShaking: true,
    ...buildOptions,
  });

  esbuild.stop();
  logger.info("Building complete.");
}

if (import.meta.main) {
  try {
    await Deno.mkdir("build", { recursive: true });
  } catch (e) {
    if (e.name !== "AlreadyExists") {
      throw e;
    }
  }
  try {
    await build();
  } catch (e) {
    // deno-lint-ignore no-console
    console.warn(
      generateBluey(`Biscuts... Failed initial build: ${e.message}`),
    );
  }
}
