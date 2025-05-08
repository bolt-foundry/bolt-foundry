#! /usr/bin/env -S bff test
/**
 * Consolidated "red" tests for the GraphQLObjectBase refactor.
 * All tests compile but **must fail** until the refactor lands.
 */

import { assert, assertExists } from "@std/assert";

/* -------------------------------------------------------------------------- */
/* 0.  Test-only imports / placeholders                                       */
/* -------------------------------------------------------------------------- */

// Path becomes valid after Step 1 (GraphQLObjectBase introduction)

// Existing class that will soon extend GraphQLObjectBase
import { makeSchema } from "nexus/dist/core.js";
import { printSchema } from "graphql";
import { BfNode } from "apps/bfDb/classes/BfNode.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { specsToNexusDefs } from "apps/bfDb/builders/graphql/fromSpec.ts";

/* -------------------------------------------------------------------------- */
/* 1. Basic GraphQLObjectBase behaviour                                       */
/* -------------------------------------------------------------------------- */

class Foo extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) => {
    field.string("bar");
  });
}

Deno.test({
  name: "GraphQLObjectBase › defineGqlNode caches & adds id helper",
  ignore: true, // Phase 2
}, () => {
  const first = Foo.gqlSpec;
  const second = Foo.defineGqlNode((_f) => {});

  assertExists(first, "defineGqlNode did not return a spec");
  if (first !== second) {
    throw new Error("defineGqlNode did not cache the spec");
  }

  const gqlSpecField = Foo.gqlSpec?.field ?? {};

  if (!("id" in gqlSpecField)) {
    throw new Error("id helper missing from gqlSpec");
  }
});

/* -------------------------------------------------------------------------- */
/* 2. BfNodeBase must inherit GraphQLObjectBase                               */
/* -------------------------------------------------------------------------- */

Deno.test({
  name: "BfNode extends GraphQLObjectBase",
  ignore: true, // Phase 2
}, () => {
  assert(
    BfNode.prototype instanceof GraphQLObjectBase,
    "BfNodeBase must inherit GraphQLObjectBase",
  );
  if (!("gqlSpec" in BfNode)) {
    throw new Error("gqlSpec vanished from BfNode");
  }
});

// /* -------------------------------------------------------------------------- */
// /* 3. CurrentViewer type & Query.me                                           */
// /* -------------------------------------------------------------------------- */

// Deno.test("Query.me exposes CurrentViewer with id field", async () => {
//   // Runtime imports (avoid compile-time path issues pre-refactor)
//   const { buildSchema } = await import("infra/graphql/buildSchema.ts");
//   const { printSchema } = await import("npm:graphql@^16");

//   const sdl = printSchema(await buildSchema());

//   if (!sdl.includes("type Query") || !sdl.includes("me: CurrentViewer!")) {
//     throw new Error("Query.me field missing from schema");
//   }
//   if (!sdl.includes("type CurrentViewer") || !sdl.includes("id: ID")) {
//     throw new Error("CurrentViewer type lacks id field");
//   }
// });

/* -------------------------------------------------------------------------- */
/* 5. Schema builder must pick up *all* subclasses                            */
/* -------------------------------------------------------------------------- */

/** Build an SDL string for one or more Nexus object types */
function sdlOf(...types: Array<ReturnType<typeof specsToNexusDefs>>): string {
  const schema = makeSchema({ types });
  return printSchema(schema);
}

Deno.test("Schema builder scans GraphQLObjectBase subclasses", () => {
  /** Throw-away subclass that should appear in the final SDL */
  class Extra extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("dummy");
    });
  }
  void Extra; // keep TS happy

  const printed = sdlOf(
    specsToNexusDefs({ "Extra": Extra.gqlSpec! }),
  );

  assert(
    printed.includes("type Extra"),
    "Schema builder did not include subclass Extra",
  );
});
