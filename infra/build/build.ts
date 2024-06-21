#! /usr/bin/env -S deno run -A

import { esbuild } from "infra/build/deps.ts";
import { generateBluey } from "lib/generateBluey.ts";
import { denoPlugin } from "infra/build/bffEsbuild.ts";
import esbuildDenoMdxPlugin from "infra/build/esbuildDenoMdxPlugin.ts";
import { workerList } from "infra/build/workerList.ts";

export async function build(
  buildOptions = {
    // minify: true,
    sourcemap: "inline",
    sourceRoot: `${Deno.cwd()}`,
  },
) {
  await esbuild.build({
    bundle: true,
    entryPoints: [
      ...workerList,
      "packages/client/Client.tsx",
      "infra/internalbf.com/client/Client.tsx",
      "aws/client/main.tsx",
    ],
    write: true,
    outdir: "build",
    plugins: [
      denoPlugin,
      esbuildDenoMdxPlugin,
    ],
    format: "esm",
    external: ["npm:posthog-node@3.2.0", "/build/vcs/dev_bf.bundle.js"],
    treeShaking: true,
    ...buildOptions,
  });

  esbuild.stop();
}

const BF_PATH = Deno.env.get("BF_PATH") ?? "/bf/.";
let lastBuilt = 0;
// @ts-expect-error #techdebt
async function watchedBuild(buildOptions) {
  const timeSinceLastBuild = Date.now() - lastBuilt;
  const includedPaths = [
    "packages",
    "infra",
    "resources",
    "experimental",
    "content",
  ];
  const watcher = Deno.watchFs(".", { recursive: true });
  for await (const event of watcher) {
    const { paths } = event;
    for (const path of paths) {
      if (
        !includedPaths.some((p) => path.startsWith(`${BF_PATH}/./${p}`)) ||
        timeSinceLastBuild < 1000
      ) {
        // console.log(
        //   `Skipping build due to change in ${path} -- ${timeSinceLastBuild}ms since last build -- ${BF_PATH}`,
        // );
        continue;
      }
      // deno-lint-ignore no-console
      console.log("Building due to change in", path);
      try {
        await build(buildOptions);
      } catch (e) {
        // deno-lint-ignore no-console
        console.warn(generateBluey(`Biscuts... Failed to build: ${e.message}`));
        lastBuilt = Date.now();
        continue;
      }

      // deno-lint-ignore no-console
      console.log(generateBluey("Hooray!! Rebuilt the client.") + "\n");
      lastBuilt = Date.now();
    }
  }
}

if (import.meta.main) {
  let buildOptions;
  const isLocalDevserver = Deno.env.get("IS_LOCAL_DEVSERVER");
  if (isLocalDevserver === "true") {
    buildOptions = { minify: false, sourcemap: true };
  }
  try {
    await Deno.mkdir("build", { recursive: true });
  } catch (e) {
    if (e.name !== "AlreadyExists") {
      throw e;
    }
  }
  try {
    await build(buildOptions);
  } catch (e) {
    // deno-lint-ignore no-console
    console.warn(
      generateBluey(`Biscuts... Failed initial build: ${e.message}`),
    );
  }

  if (Deno.args.includes("--watch")) {
    await watchedBuild(buildOptions);
  }
}
