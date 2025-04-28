#! /usr/bin/env -S bff test

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { specsToNexusDefs } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import {
  type GraphQLField,
  type GraphQLObjectType,
  type GraphQLResolveInfo,
  printSchema,
} from "graphql";
import { assert, assertStringIncludes } from "@std/assert";
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

/* -------------------------------------------------------------------------- */
/*  Test – makeSchema must succeed once                                       */
/* -------------------------------------------------------------------------- */

class DummyTarget extends GraphQLObjectBase {
  static override gqlSpec = defineGqlNode((field) => {
    field.id("id");
    field.string("name");
  });

  constructor(private _name: string) {
    super();
  }

  /* simple resolver helpers */
  get name() {
    return this._name;
  }
}

/* -------------------------------------------------------------------------- */
/* 1. Nullable (default)                                                       */
/* -------------------------------------------------------------------------- */
Deno.test("field.object() emits nullable target type", () => {
  const spec = defineGqlNode((field) => {
    field.object("viewer", () => DummyTarget);
  });

  const types = specsToNexusDefs({
    QueryObj: spec,
    DummyTarget: DummyTarget.gqlSpec!,
  });
  const sdl = sdlOf(types);

  // Expect: viewer: DummyTarget
  assertStringIncludes(sdl, "viewer: DummyTarget");
});

/* -------------------------------------------------------------------------- */
/* 2. Non‑null variant                                                         */
/* -------------------------------------------------------------------------- */
Deno.test("field.nonNull.object() emits non‑null target type", () => {
  const spec = defineGqlNode((field) => {
    field.nonNull.object("viewer", () => DummyTarget);
  });

  const types = specsToNexusDefs({
    NNQuery: spec,
    DummyTarget: DummyTarget.gqlSpec!,
  });
  const sdl = sdlOf(types);

  // Expect: viewer: DummyTarget!
  assertStringIncludes(sdl, "viewer: DummyTarget!");
});

/* -------------------------------------------------------------------------- */
/* 3. Resolver returns correct instance type                                   */
/* -------------------------------------------------------------------------- */
Deno.test("object field resolver returns the target instance", async () => {
  const spec = defineGqlNode((field) => {
    field.object("viewer", () => DummyTarget, {
      resolve: () => new DummyTarget("Carol"),
    });
  });

  const types = specsToNexusDefs({
    Query: spec,
    DummyTarget: DummyTarget.gqlSpec!,
  });
  const schema = makeSchema({ types });

  // Minimal runtime execution: call the resolver manually
  const queryType = schema.getType("Query") as GraphQLObjectType; // 👈 1
  const fieldConfig = queryType.getFields().viewer as GraphQLField<
    unknown, // <TSource>
    unknown // <TContext>
  >;

  const result = await (fieldConfig.resolve as Exclude<
    typeof fieldConfig.resolve,
    undefined
  >)(
    null, // parent / source
    {}, // args
    {}, // context
    {} as GraphQLResolveInfo, // info
  );
  assert(result instanceof DummyTarget, "Resolver did not return DummyTarget");
});

class Viewer extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((_f, _r, m) => {
    m.custom("ping", {
      args: () => ({}),
      returns: (r) => r.string("pong"),
      resolve: () => ({ pong: "🏓" }),
    });
  });
}

class ViewerChild extends Viewer {} // no gqlSpec override

/* ----------------------------------------------------------------------- */
Deno.test("Only the owner class exposes its custom mutation", () => {
  const nexusTypes = specsToNexusDefs({
    Viewer: Viewer.gqlSpec!,
    ViewerChild: ViewerChild.gqlSpec!,
  });

  const sdl = printSchema(makeSchema({ types: nexusTypes }));

  /* parent OK … */
  assertStringIncludes(
    sdl,
    "pingViewer",
    "Parent mutation field is missing",
  );

  /* …child must NOT inherit it */
  assert(
    !sdl.includes("pingViewerChild"),
    "Subclass should not expose parent’s mutation",
  );
});

Deno.test("shared custom mutation payload emitted only once", () => {
  const nexusTypes = specsToNexusDefs({
    Viewer: Viewer.gqlSpec!,
    ViewerChild: ViewerChild.gqlSpec!,
  });

  // makeSchema used to throw here; now it should compile cleanly
  let threw = false;
  try {
    const schema = makeSchema({ types: nexusTypes });
    void printSchema(schema); // extra paranoia: print SDL to make sure build finished
  } catch (_err) {
    threw = true;
  }

  assert(!threw, "Duplicate payload type should not be generated");
});
