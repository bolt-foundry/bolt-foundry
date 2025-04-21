#! /usr/bin/env -S bff test

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { assertStringIncludes } from "@std/assert";

// Helper ⇒ SDL string from generated Nexus types
function sdlOf(defs: unknown): string {
  const types: unknown[] = Array.isArray(defs) ? defs : [defs];
  const schema = makeSchema({ types });
  return printSchema(schema);
}

enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
}

Deno.test("specToNexusObject – maps date scalar & enum fields", () => {
  const spec = defineGqlNode((field) => {
    field.id("id");
    field.date("createdAt");
    field.enum("role", Role);
  });

  const defs = specToNexusObject("Dummy", spec);
  const sdl = sdlOf(defs);

  // Ensure scalar & enum appear in output
  assertStringIncludes(sdl, "createdAt: Date!");
  assertStringIncludes(sdl, "enum Dummy_role_Enum");
  assertStringIncludes(sdl, "role: Dummy_role_Enum!");
});
