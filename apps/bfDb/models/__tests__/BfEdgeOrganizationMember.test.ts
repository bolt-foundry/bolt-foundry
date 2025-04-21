#! /usr/bin/env -S bff test

import { BfEdgeOrganizationMember } from "apps/bfDb/models/BfEdgeOrganizationMember.ts";
import { OrganizationRole } from "apps/bfDb/enums/OrganizationRole.ts";
import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { assertEquals, assertStringIncludes } from "@std/assert";

// Helper to build SDL from compiled Nexus defs
function sdlOf(raw: unknown): string {
  const types: unknown[] = Array.isArray(raw) ? raw : [raw];
  const schema = makeSchema({ types });
  return printSchema(schema);
}

Deno.test("BfEdgeOrganizationMember – builder spec integrity", () => {
  const spec = BfEdgeOrganizationMember.gqlSpec;

  // Field: role
  const roleField = spec.field.role as { type: string; enumRef?: unknown };
  assertEquals(roleField.type, "enum");
  assertEquals(roleField.enumRef, OrganizationRole);

  // Field: joinedAt
  const joinedAt = spec.field.joinedAt as { type: string };
  assertEquals(joinedAt.type, "date");
});

Deno.test("BfEdgeOrganizationMember – SDL contains enum & date scalar", () => {
  const sdl = sdlOf(
    specToNexusObject(
      "BfEdgeOrganizationMember",
      BfEdgeOrganizationMember.gqlSpec,
    ),
  );

  assertStringIncludes(sdl, "scalar Date");
  assertStringIncludes(sdl, "enum BfEdgeOrganizationMember_role_Enum");
  assertStringIncludes(sdl, "role: BfEdgeOrganizationMember_role_Enum!");
  assertStringIncludes(sdl, "joinedAt: Date!");
});
