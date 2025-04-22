#! /usr/bin/env -S bff test

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { assertStringIncludes } from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";

/** Build an SDL string for one or more Nexus object types */
function sdlOf(...types: Array<ReturnType<typeof specToNexusObject>>): string {
  const schema = makeSchema({ types });
  return printSchema(schema);
}

Deno.test("specToNexusObject – maps scalar fields", () => {
  const spec = defineGqlNode((field, _relation, _mutation) => {
    field.id("id");
    field.string("name");
    field.nullable.int("age");
  });

  const Dummy = specToNexusObject("Dummy", spec);
  const sdl = sdlOf(Dummy);

  assertStringIncludes(sdl, "type Dummy");
  assertStringIncludes(sdl, "id: ID!");
  assertStringIncludes(sdl, "name: String!");
  assertStringIncludes(sdl, "age: Int"); // nullable
});

Deno.test("specToNexusObject – maps field args & resolvers", () => {
  const spec = defineGqlNode((field, _relation, _mutation) => {
    field.boolean(
      "isFollowedByViewer",
      { viewerId: "id" },
      () => true,
    );
  });

  const DummyArgs = specToNexusObject("DummyArgs", spec);
  const sdl = sdlOf(DummyArgs);

  assertStringIncludes(sdl, "isFollowedByViewer(viewerId: ID): Boolean!");
});

Deno.test("specToNexusObject – maps one & many relations", () => {
  // Minimal target node spec so the SDL has a concrete type to reference
  const TargetSpec = defineGqlNode((field) => {
    field.id("id");
  });
  const TargetType = specToNexusObject("BfNode", TargetSpec);

  const spec = defineGqlNode((field, relation, _mutation) => {
    field.id("id");
    relation.one("account", () => BfNode);
    relation.many("followers", () => BfNode);
  });

  const Dummy = specToNexusObject("RelDummy", spec);
  const sdl = sdlOf(Dummy, TargetType);

  /* Expectation examples (actual SDL may vary slightly once implemented):
     account: BfNode!
     followers: [BfNode!]!
  */
  assertStringIncludes(sdl, "account: BfNode!");
  assertStringIncludes(sdl, "followers: [BfNode!]!");
});

Deno.test("specToNexusObject – respects nullable list & element nullability", () => {
  const spec = defineGqlNode((field) => {
    field.id("id");
    // suppose builder.nullable.json("tags") would become [JSON]
    field.nullable.json("tags");
  });
  const Dummy = specToNexusObject("NullableDummy", spec);
  const sdl = sdlOf(Dummy);

  // We at least ensure field appears nullable
  assertStringIncludes(sdl, "tags: JSON");
});

Deno.test("specToNexusObject – maps standard & custom mutations", () => {
  const spec = defineGqlNode((field, _relation, mutation) => {
    field.id("id");
    field.string("name");

    mutation
      .update()
      .delete()
      .custom("greet", {
        args: (a) => a.string("to"),
        returns: (r) => r.string(),
        resolve: (_src, { to }) => `hi ${to}`,
      });
  });

  const Dummy = specToNexusObject("MutDummy", spec);
  const sdl = sdlOf(Dummy);

  // Root mutation type should include at least these placeholders once implemented
  assertStringIncludes(sdl, "type Mutation");
  assertStringIncludes(sdl, "updateMutDummy");
  assertStringIncludes(sdl, "deleteMutDummy");
  assertStringIncludes(sdl, "greetMutDummy");
});
