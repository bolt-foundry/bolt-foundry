#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };

const outDir = import.meta.resolve("../npm").replace("file://", "");

// Define all entry points that should be exported
const entryPoints = [
  // Main entry
  {
    name: ".",
    path: import.meta.resolve("../bolt-foundry.ts").replace("file://", ""),
  },
  // Evals submodules
  {
    name: "./evals/eval",
    path: import.meta.resolve("../evals/eval.ts").replace("file://", ""),
  },
  {
    name: "./evals/makeGraderDeckBuilder",
    path: import.meta.resolve("../evals/makeGraderDeckBuilder.ts").replace(
      "file://",
      "",
    ),
  },
  {
    name: "./evals",
    path: import.meta.resolve("../evals/evals.ts").replace("file://", ""),
  },
  // Builders submodule
  {
    name: "./builders",
    path: import.meta.resolve("../builders/builders.ts").replace("file://", ""),
  },
  // Client
  {
    name: "./BfClient",
    path: import.meta.resolve("../BfClient.ts").replace("file://", ""),
  },
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
