#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlBuilder } from "../makeGqlBuilder.ts";

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
  relations: Record<string, unknown>;
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

Deno.test("builders are chainable", () => {
  const builder = makeGqlBuilder()
    .string("name")
    .nonNull.id("id");

  const spec = specOf<BuilderSpec>(builder);
  assertEquals(Object.keys(spec.fields), ["name", "id"]);
});
