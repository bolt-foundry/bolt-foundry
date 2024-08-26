#! /usr/bin/env -S deno run -A

import * as esbuild from "esbuild";
import { getLogger } from "deps.ts";
import { generateBluey } from "lib/generateBluey.ts";
import {
  extractGraphqlTags,
  replaceTagsWithImports,
} from "infra/build/slimRelay.ts";

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

const slimRelay = {
  name: "slim-relay",
  setup(build: esbuild.PluginBuild) {
    build.onLoad({ filter: /\.(ts|js|tsx|jsx)$/ }, async (args) => {
      const source = await Deno.readTextFile(args.path);
      const graphqlTags = extractGraphqlTags(source);
      let contents = source;
      if (graphqlTags.length > 0) {
        const relativeLocation =
          args.path.split(Deno.env.get("BF_PATH") ?? "")[1];
        const rootDirectory = relativeLocation.split("/")[1];

        contents = await replaceTagsWithImports(
          source,
          graphqlTags,
          rootDirectory,
        );
      }
      const ext = args.path.match(/[^.]+$/);
      const loader = (ext ? ext[0] : "ts") as esbuild.Loader;

      logger.trace(`Loading local module: ${args.path}`);
      return { contents, loader };
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
      "infra/internalbf.com/client/Client.tsx",
      "packages/client/Client.tsx",
      "aws/client/main.tsx",
    ],
    write: true,
    outdir: "build",
    plugins: [
      // denoPlugin,
      denoFileResolver,
      slimRelay,
    ],
    format: "esm",
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
