#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlBuilder } from "../makeGqlBuilder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import type { RelationSpec } from "../types.ts";

/** Helper to reach into the builder's private spec */
const specOf = <T extends Record<string, unknown>>(b: unknown): T => {
  type WithSpec = { _spec: T };
  return (b as WithSpec)._spec;
};

type FieldSpec = {
  type: string;
  nonNull?: boolean;
  args?: Record<string, unknown>;
  resolve?: (...args: unknown[]) => unknown;
};

type MutationSpec = {
  returns: string;
  args?: Record<string, unknown>;
  resolve?: (...args: unknown[]) => unknown;
};

interface BuilderSpec extends Record<string, unknown> {
  fields: Record<string, FieldSpec>;
  mutations: Record<string, MutationSpec>;
  relations: Record<string, RelationSpec>;
}

Deno.test("scalar fields are recorded correctly", () => {
  const builder = makeGqlBuilder();
  builder.string("title");
  builder.int("count");

  const fields = specOf<BuilderSpec>(builder).fields;
  assert(fields.title, "title field should exist");
  assert(fields.count, "count field should exist");
  assertEquals(fields.title.type, "String", "title should have String type");
  assertEquals(fields.count.type, "Int", "count should have Int type");
});

Deno.test("nonNull wrapper sets nonNull: true", () => {
  const builder = makeGqlBuilder();
  builder.nonNull.boolean("isPublished");

  const fields = specOf<BuilderSpec>(builder).fields;
  assert(fields.isPublished, "isPublished field should exist");
  assertEquals(
    fields.isPublished.type,
    "Boolean",
    "isPublished should have Boolean type",
  );
  assertEquals(
    fields.isPublished.nonNull,
    true,
    "isPublished should be nonNull",
  );
});

Deno.test("mutation helper records args and returns", () => {
  const builder = makeGqlBuilder();
  builder.mutation("createPost", {
    args: (a) => a.string("title"),
    returns: "Post",
  });

  const mutations = specOf<BuilderSpec>(builder).mutations;
  assert("createPost" in mutations);
  assertEquals(mutations.createPost.returns, "Post");
});

Deno.test("mutation helper accepts factory for returns", () => {
  const builder = makeGqlBuilder();

  // Create a real GraphQLObjectBase-extending class
  class Post extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql.id("id").string("title")
    );
  }

  builder.mutation("createPost", {
    args: (a) => a.string("title"),
    returns: () => Post,
  });

  const mutations = specOf<BuilderSpec>(builder).mutations;
  assert("createPost" in mutations);
  assertEquals(mutations.createPost.returns, "Post");
});

Deno.test("mutation helper accepts string for returns", () => {
  const builder = makeGqlBuilder();

  builder.mutation("updatePost", {
    args: (a) => a.id("id").string("title"),
    returns: "Post",
  });

  const mutations = specOf<BuilderSpec>(builder).mutations;
  assert("updatePost" in mutations);
  assertEquals(mutations.updatePost.returns, "Post");
});

Deno.test("builders are chainable", () => {
  const builder = makeGqlBuilder()
    .string("name")
    .nonNull.id("id");

  const spec = specOf<BuilderSpec>(builder);
  assertEquals(Object.keys(spec.fields), ["name", "id"]);
});

Deno.test("object method records relations with factory pattern", () => {
  const builder = makeGqlBuilder();

  // Create real GraphQLObjectBase-extending classes
  class BfPerson extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql.id("id").string("email").string("name")
    );
  }

  // With factory function
  builder.object("owner", () => BfPerson);

  // With options object
  builder.object("member", { type: "BfPerson" });

  const spec = specOf<BuilderSpec>(builder);

  // Use consistent relationship pattern
  assert(spec.relations.owner, "owner relation should exist");
  assertEquals(
    spec.relations.owner.type,
    "BfPerson",
    "owner should have correct type from factory",
  );
  assert(spec.relations.owner.targetFn, "owner should have targetFn stored");

  assert(spec.relations.member, "member relation should exist");
  assertEquals(
    spec.relations.member.type,
    "BfPerson",
    "member should have explicit type",
  );
});

Deno.test("object method accepts factory pattern like bfDb", () => {
  // Create a real GraphQLObjectBase-extending class
  class MockNode extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql.id("id").string("name")
    );
  }

  const builder = makeGqlBuilder();

  // Use factory pattern like bfDb
  builder.object("bestFriend", () => MockNode);

  // Use string type pattern for circular imports
  builder.object("stringTypeFriend", "MockNode");

  const spec = specOf<BuilderSpec>(builder);

  assert(spec.relations.bestFriend, "bestFriend relation should exist");
  assertEquals(
    spec.relations.bestFriend.type,
    "MockNode",
    "bestFriend should use actual class name",
  );
  assert(spec.relations.bestFriend.targetFn, "targetFn should be stored");

  assert(
    spec.relations.stringTypeFriend,
    "stringTypeFriend relation should exist",
  );
  assertEquals(
    spec.relations.stringTypeFriend.type,
    "MockNode",
    "stringTypeFriend should use string type",
  );
  assert(
    !spec.relations.stringTypeFriend.targetFn,
    "targetFn should not be stored for string type",
  );
});
