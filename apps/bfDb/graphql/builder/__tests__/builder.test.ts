#! /usr/bin/env -S bff test
import { defineGqlNode, Direction } from "apps/bfDb/graphql/builder/builder.ts"; // adjust path
import { assertEquals, assertExists } from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";

Deno.test("defineGqlNode – full DSL", () => {
  const spec = defineGqlNode((field, relation, mutation) => {
    // — fields —
    field.id("id");
    field.string("name");
    field.nullable.int("age");
    field.boolean(
      "isFollowedByViewer",
      { viewerId: "id" },
      () => true,
    );

    // — relations —
    relation.one("account", () => BfNode); // one.out alias
    relation.many.in("followers", () => BfNode); // many.in explicit
    relation.one.in("likedByViewer", () => BfNode); // one.in explicit

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
  assertExists(spec.field.id);
  assertEquals(spec.field.age.nullable, true);
  assertEquals(spec.field.isFollowedByViewer.args?.viewerId, "id");

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
