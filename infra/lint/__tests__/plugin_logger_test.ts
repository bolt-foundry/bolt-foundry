import { assertEquals } from "testing/asserts.ts";
import { lint } from "deno/lint/mod.ts";
import boltFoundryPlugin from "../bolt-foundry.ts";

Deno.test("no-logger-set-level rule with logger variable", async () => {
  const source = `
  import { getLogger } from "packages/logger/logger.ts";
  
  const logger = getLogger(import.meta);
  logger.setLevel(logger.levels.DEBUG);
  
  function someFunction() {
    console.log("Hello world");
  }
  `;

  const result = await lint(source, {
    rules: {
      "no-logger-set-level": true,
    },
    include: ["**/*.ts"],
    exclude: [],
    root: ".",
    plugins: [boltFoundryPlugin],
  });

  assertEquals(result.length, 1);
  assertEquals(result[0].rule, "no-logger-set-level");
  assertEquals(
    result[0].message,
    "Avoid committing logger.setLevel() - this should be managed through environment variables.",
  );
});

Deno.test("no-logger-set-level rule with custom logger name but using levels", async () => {
  const source = `
  import { getLogger } from "packages/logger/logger.ts";
  
  const myCustomLogger = getLogger(import.meta);
  myCustomLogger.setLevel(myCustomLogger.levels.DEBUG);
  
  function someFunction() {
    console.log("Hello world");
  }
  `;

  const result = await lint(source, {
    rules: {
      "no-logger-set-level": true,
    },
    include: ["**/*.ts"],
    exclude: [],
    root: ".",
    plugins: [boltFoundryPlugin],
  });

  // Should trigger the lint rule since we're now matching both the variable name
  // pattern and checking if it's using .levels
  assertEquals(result.length, 1);
  assertEquals(result[0].rule, "no-logger-set-level");
});

Deno.test("no-logger-set-level rule should not trigger for non-logger setLevel calls", async () => {
  const source = `
  // Not importing our logger module
  
  class SomeClass {
    constructor() {
      this.level = 0;
    }
    
    setLevel(level) {
      this.level = level;
    }
  }
  
  const instance = new SomeClass();
  instance.setLevel(5);
  `;

  const result = await lint(source, {
    rules: {
      "no-logger-set-level": true,
    },
    include: ["**/*.ts"],
    exclude: [],
    root: ".",
    plugins: [boltFoundryPlugin],
  });

  // Should not trigger the lint rule since there's no logger import and no .levels usage
  assertEquals(result.length, 0);
});
