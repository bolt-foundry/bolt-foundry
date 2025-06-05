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
    engines: {
      node: ">=22.0.0",
    },
  },
  postBuild() {
    // Copy README.md to the npm package
    const readmePath = import.meta.resolve("../README.md").replace(
      "file://",
      "",
    );
    Deno.copyFileSync(readmePath, `${outDir}/README.md`);
  },
});
