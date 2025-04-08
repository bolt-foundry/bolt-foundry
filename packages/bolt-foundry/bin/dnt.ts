#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };

const outDir = import.meta.resolve("../npm").replace("file://", "");
const entryPoints = [
  import.meta.resolve("../bolt-foundry.ts").replace("file://", ""),
];

await emptyDir(outDir);

await build({
  entryPoints,
  outDir,
  shims: {
    deno: true,
  },
  test: false,
  typeCheck: false,
  package: {
    // package.json properties
    name: denoJson.name,
    version: denoJson.version,
    description: denoJson.description,
    license: denoJson.license,
    repository: {
      type: "git",
      url: "git+https://github.com/bolt-foundry/bolt-foundry.git",
    },
    dependencies: {
      "posthog-node": "^4.11.2",
    },
  },
});

// Read the generated package.json
const pkgJson = JSON.parse(await Deno.readTextFile(`${outDir}/package.json`));

// Update the paths to include the src directory
pkgJson.main = pkgJson.main.replace("./script/", "./script/src/");
pkgJson.module = pkgJson.module.replace("./esm/", "./esm/src/");
pkgJson.exports["."].import = pkgJson.exports["."].import.replace(
  "./esm/",
  "./esm/src/",
);
pkgJson.exports["."].require = pkgJson.exports["."].require.replace(
  "./script/",
  "./script/src/",
);

// Write the modified package.json back to the file
await Deno.writeTextFile(
  `${outDir}/package.json`,
  JSON.stringify(pkgJson, null, 2),
);
