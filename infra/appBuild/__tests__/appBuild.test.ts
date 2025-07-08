#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import * as esbuild from "esbuild";

// Helper function to create the import map resolver plugin
function createImportMapResolver(): esbuild.Plugin {
  return {
    name: "import-map-resolver",
    setup(build) {
      build.onResolve({ filter: /^@bfmono\// }, (args) => {
        const relativePath = args.path.replace(/^@bfmono\//, "");
        const absolutePath =
          new URL(`../../../${relativePath}`, import.meta.url).pathname;
        return { path: absolutePath, external: false };
      });

      build.onResolve({ filter: /^@iso$/ }, (_args) => {
        const absolutePath = new URL(
          "../../../apps/boltFoundry/__generated__/__isograph/iso.ts",
          import.meta.url,
        ).pathname;
        return { path: absolutePath, external: false };
      });

      build.onResolve({ filter: /^@iso\// }, (args) => {
        const relativePath = args.path.replace(/^@iso\//, "");
        const absolutePath = new URL(
          `../../../apps/boltFoundry/__generated__/__isograph/${relativePath}`,
          import.meta.url,
        ).pathname;
        return { path: absolutePath, external: false };
      });
    },
  };
}

Deno.test({
  name: "esbuild plugin resolves @bfmono imports correctly",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    // Test that @bfmono paths are resolved correctly by the plugin
    const testEntryContent = `
import { getLogger } from "@bfmono/packages/logger/logger.ts";
export const logger = getLogger(import.meta);
`;

    await Deno.writeTextFile("/tmp/test-bfmono-imports.tsx", testEntryContent);

    try {
      const testBuildOptions: esbuild.BuildOptions = {
        entryPoints: ["/tmp/test-bfmono-imports.tsx"],
        bundle: true,
        format: "esm",
        write: false,
        plugins: [createImportMapResolver()],
      };

      const result = await esbuild.build(testBuildOptions);

      // Verify the build succeeded without import resolution errors
      assertEquals(
        result.errors.length,
        0,
        "Should not have @bfmono import resolution errors",
      );
    } finally {
      await Deno.remove("/tmp/test-bfmono-imports.tsx").catch(() => {});
    }
  },
});

Deno.test({
  name: "esbuild plugin resolves @iso imports correctly",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    // Test that @iso paths are resolved correctly by the plugin
    const testEntryContent = `
import { iso } from "@iso";
import entrypointBlog from "@iso/Query/EntrypointBlog/entrypoint.ts";

iso(\`entrypoint Query.EntrypointBlog\`);
export { entrypointBlog };
`;

    await Deno.writeTextFile("/tmp/test-iso-imports.tsx", testEntryContent);

    try {
      const testBuildOptions: esbuild.BuildOptions = {
        entryPoints: ["/tmp/test-iso-imports.tsx"],
        bundle: true,
        format: "esm",
        write: false,
        plugins: [createImportMapResolver()],
      };

      const result = await esbuild.build(testBuildOptions);

      // Verify the build succeeded without import resolution errors
      assertEquals(
        result.errors.length,
        0,
        "Should not have @iso import resolution errors",
      );
    } finally {
      await Deno.remove("/tmp/test-iso-imports.tsx").catch(() => {});
    }
  },
});

// Clean up esbuild processes after all tests
Deno.test({
  name: "cleanup esbuild processes",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: () => {
    esbuild.stop();
  },
});
