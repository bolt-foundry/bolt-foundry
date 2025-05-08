#!/usr/bin/env -S bff test
import { compileSpecs } from "apps/bfDb/graphql/builder/compiler.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { assertEquals, assertStringIncludes } from "@std/assert";

/** Build an SDL string from the compiled Nexus types */
function sdlOf(types: Array<unknown>): string {
  const schema = makeSchema({ types });
  return printSchema(schema);
}

type Props = { name: string };

/** Dummy node classes with GraphQL specs */
class TestA extends BfNode<Props> {
  static override gqlSpec = defineGqlNode((field) => {
    field.string("name");
  });
}

class TestB extends BfNode<Props> {
  static override gqlSpec = defineGqlNode((field) => {
    field.string("name");
  });
}

Deno.test("compileSpecs – generates Nexus object types for each node class", () => {
  // compileSpecs now expects a { typeName: spec } map, not an array of classes
  const types = compileSpecs({
    TestA: TestA.gqlSpec,
    TestB: TestB.gqlSpec,
  });

  // 1. Should return one definition per node class (arrays flattened) and includes the json spec
  assertEquals(types.length, 3);

  // 2. SDL should contain both object definitions and their fields
  const sdl = sdlOf(types);
  assertStringIncludes(sdl, "type TestA");
  assertStringIncludes(sdl, "type TestB");
  assertStringIncludes(sdl, "name: String");
});
