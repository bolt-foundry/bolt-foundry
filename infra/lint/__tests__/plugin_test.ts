#! /usr/bin/env -S bff test
/// <reference lib="deno.unstable" />

// plugin_test.ts
// deno-lint-ignore-file no-explicit-any
import { assertEquals } from "@std/assert";
import plugin from "../bolt-foundry.ts";

Deno.test("auto-fix adds import and replaces call", () => {
  const src = 'console.log(Deno.env.get("FOO"));';
  const [diag] = (Deno as any).lint.runPlugin(plugin, "demo.ts", src);

  // replacement
  assertEquals(
    diag.fix?.some((f: any) => f.text?.includes("getConfigurationVariable")),
    true,
  );
  // import insertion
  assertEquals(
    diag.fix?.some((f: any) =>
      f.text?.includes(
        'import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";',
      )
    ),
    true,
  );
});

Deno.test("auto-fix replaces Deno.env.get()", () => {
  const src = 'console.log(Deno.env.get("FOO"));';
  const [d] = (Deno as any).lint.runPlugin(plugin, "demo.ts", src);
  assertEquals(d.fix?.[0].text, 'getConfigurationVariable("FOO")');
});
