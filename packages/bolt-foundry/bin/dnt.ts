#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./bolt-foundry.ts"],
  outDir: "./npm",
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
