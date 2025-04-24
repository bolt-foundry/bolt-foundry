#! /usr/bin/env -S bff test

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { specsToNexusDefs } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { assertStringIncludes } from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { BfNodeBase } from "apps/bfDb/classes/BfNodeBase.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";

/** Build an SDL string for one or more Nexus object types */
function sdlOf(...types: Array<ReturnType<typeof specsToNexusDefs>>): string {
  const schema = makeSchema({ types });
  return printSchema(schema);
}

Deno.test("specToNexusObject – maps scalar fields", () => {
  const spec = defineGqlNode((field, _relation, _mutation) => {
    field.nonNull.id("id");
    field.string("name");
    field.int("age"); // default is nullable now
  });

  const Dummy = specsToNexusDefs({ "Dummy": spec });
  const sdl = sdlOf(Dummy);

  assertStringIncludes(sdl, "type Dummy");
  assertStringIncludes(sdl, "id: ID!");
  assertStringIncludes(sdl, "name: String");
  assertStringIncludes(sdl, "age: Int"); // still nullable, but by default now
});

Deno.test("specToNexusObject – maps field args & resolvers", () => {
  class Thingy extends GraphQLObjectBase {
    static override gqlSpec = defineGqlNode((field, _relation, _mutation) => {
      field.boolean(
        "isFollowedByViewer",
        {
          args: (a) => a.id("viewerId"),
        },
      );
    });

    viewerId(id: BfGid) {
      return id;
    }
  }
  const spec = Thingy.gqlSpec;

  const DummyArgs = specsToNexusDefs({ "DummyArgs": spec });
  const sdl = sdlOf(DummyArgs);

  assertStringIncludes(sdl, "isFollowedByViewer(viewerId: ID): Boolean");
});

Deno.test("specToNexusObject – maps one & many relations", () => {
  // Minimal target node spec so the SDL has a concrete type to reference
  const TargetSpec = defineGqlNode((field) => {
    field.id("id");
  });
  const TargetType = specsToNexusDefs({ "BfNode": TargetSpec });

  const spec = defineGqlNode((field, relation, _mutation) => {
    field.id("id");
    relation.one("account", () => BfNode);
    relation.many("followers", () => BfNode);
  });

  const Dummy = specsToNexusDefs({ "RelDummy": spec });
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
    // Fields are nullable by default now, no need for .nullable
    field.json("tags");
  });
  const Dummy = specsToNexusDefs({ "NullableDummy": spec });
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

  const Dummy = specsToNexusDefs({ "MutDummy": spec });
  const sdl = sdlOf(Dummy);

  // Root mutation type should include at least these placeholders once implemented
  assertStringIncludes(sdl, "type Mutation");
  assertStringIncludes(sdl, "updateMutDummy");
  assertStringIncludes(sdl, "deleteMutDummy");
  assertStringIncludes(sdl, "greetMutDummy");
});

Deno.test("fromSpec should preserve implements chain", () => {
  class BaseNode extends BfNodeBase {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("baseField");
    });
  }

  class SubNode extends BaseNode {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("subField");
    });
  }

  // 🟢  One call that contains *both* specs
  const types = specsToNexusDefs({
    BaseNode: BaseNode.gqlSpec!,
    SubNode: SubNode.gqlSpec!,
  });

  const sdl = sdlOf(types);

  assertStringIncludes(sdl, "type SubNode implements BaseNode");
});
