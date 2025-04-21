#! /usr/bin/env -S bff test

import { defineGqlNode, Direction } from "apps/bfDb/graphql/builder/builder.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";

// Dummy enum for testing
enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

Deno.test("defineGqlNode – full DSL inc. date & enum", () => {
  const spec = defineGqlNode((field, relation, mutation) => {
    // — scalar + nullable variants —
    field.id("id");
    field.string("name");
    field.nullable.int("age");
    field.boolean("isFollowedByViewer", { viewerId: "id" }, () => true);

    // NEW: date + enum
    field.date("createdAt");
    field.nullable.date("deletedAt");
    field.enum("role", Role);

    // — relations —
    relation.one("account", () => BfNode);
    relation.many.in("followers", () => BfNode);

    // — mutations —
    mutation.update()
      .delete()
      .custom(
        "greet",
        { to: "string" },
        (src, { to }) => `hi ${to}, I'm ${src.props.name}`,
      );
  });

  // ------------------------------------------------------------------
  //  Field store checks
  // ------------------------------------------------------------------
  assertExists(spec.field.createdAt);
  assertEquals(spec.field.createdAt.type, "date");
  assertEquals(spec.field.deletedAt.nullable, true);
  assertEquals(spec.field.role.type, "enum");
  assertEquals(spec.field.role.enumRef?.OWNER, "OWNER");

  // ------------------------------------------------------------------
  //  Relation store checks
  // ------------------------------------------------------------------
  assertEquals(spec.relation.account.direction, Direction.OUT);
  assertEquals(spec.relation.followers.many, true);
  assertEquals(spec.relation.followers.direction, Direction.IN);

  // ------------------------------------------------------------------
  //  Mutation spec checks
  // ------------------------------------------------------------------
  assertEquals(spec.mutation.standard.update, true);
  assertEquals(spec.mutation.standard.delete, true);
  assertEquals(spec.mutation.customs.length, 1);
  assertEquals(spec.mutation.customs[0].name, "greet");
});
