import { assert, assertEquals } from "@std/assert";
import { GraphQLString } from "graphql";
import { makeGqlBuilder } from "../makeGqlBuilder.ts";

/** Helper to reach into the builder’s private spec                         */
const specOf = (b: unknown) => (b as any)._spec;

Deno.test("scalar fields are recorded correctly", () => {
  const builder = makeGqlBuilder();
  builder.string("title");
  builder.int("count");

  assertEquals(specOf(builder).fields, {
    title: { type: "String" },
    count: { type: "Int" },
  });
});

Deno.test("nonNull wrapper sets nonNull: true", () => {
  const builder = makeGqlBuilder();
  builder.nonNull.boolean("isPublished");

  assertEquals(specOf(builder).fields, {
    isPublished: { type: "Boolean", nonNull: true },
  });
});

Deno.test("connection helper records Connection type", () => {
  const builder = makeGqlBuilder();
  builder.connection("posts");
  assertEquals(specOf(builder).fields, {
    posts: { type: "Connection" },
  });
});

Deno.test("mutation helper records args and returns", () => {
  const builder = makeGqlBuilder();
  builder.mutation("createPost", {
    args: () => ({ title: GraphQLString }),
    returns: "Post",
  });

  const mutations = specOf(builder).mutations;
  assert("createPost" in mutations);
  assertEquals(mutations.createPost.returns, "Post");
});

Deno.test("builders are chainable", () => {
  const builder = makeGqlBuilder()
    .string("name")
    .nonNull.id("id")
    // .connection("friends");

  assertEquals(Object.keys(specOf(builder).fields), ["name", "id", "friends"]);
});
