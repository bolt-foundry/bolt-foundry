#! /usr/bin/env -S bff test

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { assertValidSchema, buildSchema } from "graphql";
import {
  assert,
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { specsToNexusDefs } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { BfNodeBase } from "apps/bfDb/classes/BfNodeBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { makeLoggedInCv } from "apps/bfDb/utils/testUtils.ts";

const logger = getLogger(import.meta);
/* -------------------------------------------------------------------------- */
/*  Dummy node classes for relation targets                                   */
/* -------------------------------------------------------------------------- */

type AccountProps = { balance: number };
type PersonProps = { firstName: string; lastName: string };

class AccountNode extends BfNode<AccountProps> {
  static override gqlSpec = this.defineGqlNode((field) => {
    field.float("balance");
  });
}

class PersonNode extends BfNode<PersonProps> {
  static override gqlSpec = this.defineGqlNode((field) => {
    field.string("firstName");
    field.string("lastName");
  });
}

/* -------------------------------------------------------------------------- */
/*  Payload types                                                              */
/* -------------------------------------------------------------------------- */

type GreetPayload = { greeting: string };
type NameListPayload = { names: string[] };
type MaybeNameListPayload = { maybeNames: string[] } | null;
type ViewerPersonPayload = { person: InstanceType<typeof PersonNode> };
type AllNamesPayload = { allNames: string[] };
type FollowersConnPayload = {
  followers: { edges: Array<{ node: InstanceType<typeof PersonNode> }> };
};

/* -------------------------------------------------------------------------- */
/*  Comprehensive builder DSL test                                            */
/* -------------------------------------------------------------------------- */

Deno.test("defineGqlNode – rich returns DSL with order‑agnostic nullable/list", () => {
  const spec = defineGqlNode((field, relation, mutation) => {
    /* ── scalar fields ─────────────────────────────────────────────── */
    field.id("id");
    field.string("name");
    field.int("age"); // default is nullable now

    field.boolean("isFollowedByPerson", {
      args: (arg) => arg.id("followerId"),
      resolve: () => true,
    });

    /* ── relations ─────────────────────────────────────────────────── */
    relation.one("account", () => AccountNode);
    relation.many.in("followers", () => PersonNode);
    relation.one.in("likedByViewer", () => PersonNode);

    /* ── mutations ─────────────────────────────────────────────────── */
    mutation.update().delete();

    // Scalar payload with implicit key { value }
    mutation.custom("hello", {
      args: (a) => a.string("name"),
      returns: (r) => r.string(),
      resolve: (_src, { name }): { value: string } => ({
        value: `hello ${name}`,
      }),
    });

    // Object payload
    mutation.custom("viewer", {
      args: () => ({}),
      returns: (r) => r.object(PersonNode, "person"),
      resolve: (src): ViewerPersonPayload => ({
        person: src as InstanceType<typeof PersonNode>,
      }),
    });

    // List payload + nullable wrapper (list defaults to nullable now)
    mutation.custom("listNames", {
      args: () => ({}),
      returns: (r) => r.list.string("names"), // already nullable by default
      resolve: (): NameListPayload | null => ({ names: [] }),
    });

    // Same nullable list but using default nullability
    mutation.custom("maybeNames", {
      args: () => ({}),
      returns: (r) => r.list.string("maybeNames"), // already nullable by default
      resolve: (): MaybeNameListPayload => ({ maybeNames: ["x", "y"] }),
    });

    // Non‑nullable list payload
    mutation.custom("allNames", {
      args: () => ({}),
      returns: (r) => r.nonNull.list.string("allNames"),
      resolve: (): AllNamesPayload => ({ allNames: ["a", "b"] }),
    });

    // Collection (connection) payload
    mutation.custom("followersConnection", {
      args: () => ({}),
      returns: (r) => r.collection(PersonNode, "followers"),
      resolve: (): FollowersConnPayload => ({ followers: { edges: [] } }),
    });

    // Original greet example with explicit key
    mutation.custom("greet", {
      args: (a) => a.string("to"),
      returns: (r) => r.string("greeting"),
      resolve: (src, { to }): GreetPayload => ({
        greeting: `hi ${to}, I'm ${src.props.name}`,
      }),
    });
  });

  /* ── custom mutation output specs ── */
  const byName = Object.fromEntries(
    spec.mutation.customs.map((m) => [m.name, m]),
  );

  // viewer.output.person should be a function returning PersonNode
  const viewerOut = byName.viewer.output as { person: unknown };
  assertExists(viewerOut.person, "viewer.output.person missing");
  assert(
    typeof viewerOut.person === "function" && viewerOut.person() === PersonNode,
    "viewer.output.person should be a function returning PersonNode",
  );
});

/* -------------------------------------------------------------------------- */
/*  SDL checks for the standard update helper                                 */
/* -------------------------------------------------------------------------- */

Deno.test("specsToNexusDefs – update mutation args", () => {
  const spec = defineGqlNode((field, _rel, mutation) => {
    field.id("id");
    field.string("name");
    mutation.update();
  });

  const Dummy = specsToNexusDefs({ "UpdDummy": spec });
  const schema = makeSchema({ types: [Dummy] });
  const sdl = printSchema(schema);

  assertStringIncludes(sdl, "updateUpdDummy");
  assertStringIncludes(sdl, "id: ID");
  assertStringIncludes(sdl, "params: JSON");
});

Deno.test("inherits parent's gqlSpec when subclass omits its own", () => {
  class ParentNode extends BfNodeBase {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("parentField");
    });
  }

  class ChildNode extends ParentNode {}

  const inheritedSpec = (ChildNode as typeof BfNodeBase).gqlSpec;
  assertExists(inheritedSpec, "Child should inherit gqlSpec from parent");
  assertEquals(inheritedSpec, (ParentNode as typeof BfNodeBase).gqlSpec);
});

Deno.test("child gqlSpec implements parent's gqlSpec as interface", () => {
  class ParentNode extends BfNodeBase {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("parentField");
    });
  }

  class ChildNode extends ParentNode {
    static override gqlSpec = this.defineGqlNode((field) => {
      field.string("childField");
    });
  }

  const spec = (ChildNode as typeof BfNodeBase).gqlSpec;
  assertExists(spec, "Child should define its own gqlSpec");
  assertExists(spec.implements, "Child spec should implement parent interface");
  assertEquals(
    spec.implements?.[0],
    (ParentNode as typeof BfNodeBase).__typename,
  );
});

Deno.test("subclass setting gqlSpec = null disables GraphQL", () => {
  class SilentNode extends BfNodeBase {
    static override gqlSpec = null;
  }

  assertEquals(
    SilentNode.gqlSpec,
    null,
    "Subclass explicitly disables gqlSpec",
  );
});

Deno.test("BfNode exposes ID field via GraphQL", () => {
  const spec = BfNode.gqlSpec;
  assertExists(spec, "BfNode should define a GraphQL spec");
  assert(spec.field?.id, "GraphQL spec should include 'id' field");
});

Deno.test("Subclass gqlSpec should implement parent class", () => {
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

  const spec = SubNode.gqlSpec;

  logger.debug("Spec implements:", spec?.implements);

  const implementsParent = spec?.implements?.includes(BaseNode.__typename);
  assert(
    implementsParent,
    "Subclass should include parent spec in 'implements'",
  );
});

Deno.test("the GraphQL schema in schema.graphql is valid", async () => {
  const sdl = await Deno.readTextFile(
    new URL(
      import.meta.resolve("apps/bfDb/graphql/__generated__/schema.graphql"),
    ),
  );
  const schema = buildSchema(sdl);

  assertValidSchema(schema);
});

/* -------------------------------------------------------------------------- */
/*  nonNull() arg-builder behaviour                                           */
/* -------------------------------------------------------------------------- */

/** Quick helper to turn a Nexus type array into printed SDL */
function sdlOfTypes(types: unknown[]) {
  const schema = makeSchema({ types });
  return printSchema(schema);
}

Deno.test("ArgBuilder.nonNull makes the argument non-nullable", () => {
  const spec = defineGqlNode((field) => {
    field.boolean("isFriendWithViewer", {
      args: (a) => a.nonNull.id("viewerId"),
    });
  });

  const Dummy = specsToNexusDefs({ DummyNN: spec });
  const sdl = sdlOfTypes([Dummy]);

  // Expect “viewerId: ID!” instead of default nullable “ID”
  assertStringIncludes(sdl, "isFriendWithViewer(viewerId: ID!): Boolean");
});

Deno.test("nonNull flag resets after each scalar call", () => {
  const spec = defineGqlNode((field) => {
    field.boolean("doTheyKnowEachOther", {
      // First arg is non-null, second arg should fall back to nullable
      args: (a) => a.nonNull.id("viewerId").string("context"),
    });
  });

  const Dummy = specsToNexusDefs({ DummyReset: spec });
  const sdl = sdlOfTypes([Dummy]);

  // First arg non-null
  assertStringIncludes(sdl, "viewerId: ID!");
  // Second arg nullable (default)
  assertStringIncludes(sdl, "context: String");
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  Field.nonNull                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
Deno.test("field.nonNull.<scalar>() makes the field non-nullable", () => {
  const spec = defineGqlNode((field) => {
    field.nonNull.string("name");
    field.string("nickname"); // control
  });

  const Dummy = specsToNexusDefs({ DummyNNField: spec });
  const sdl = sdlOfTypes([Dummy]);

  assertStringIncludes(sdl, "name: String!");
  assertStringIncludes(sdl, "nickname: String"); // still nullable
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  Returns.nonNull                                                            */
/* ────────────────────────────────────────────────────────────────────────── */
Deno.test(
  "returns.nonNull.<scalar>() makes the mutation payload non-nullable",
  () => {
    const spec = defineGqlNode((_field, _rel, mutation) => {
      mutation.custom("echo", {
        args: (a) => a.string("msg"),
        returns: (r) => r.nonNull.string("answer"),
        resolve: (_src, { msg }) => ({ answer: msg }),
      });
    });

    const Dummy = specsToNexusDefs({ DummyNNReturn: spec });
    const sdl = sdlOfTypes([Dummy]);

    // Generated payload type is <MutationName>Payload – assert on its SDL
    assertStringIncludes(sdl, "type EchoPayload");
    assertStringIncludes(sdl, "answer: String!");
  },
);

Deno.test("returns.<scalar>() is nullable by default", () => {
  const spec = defineGqlNode((_f, _r, m) => {
    m.custom("ping", {
      args: () => ({}),
      returns: (r) => r.string("message"),
      resolve: () => ({ message: null }),
    });
  });

  const Dummy = specsToNexusDefs({ DummyNullable: spec });
  const sdl = sdlOfTypes([Dummy]);

  // Generated payload type PingPayload { message: String }
  assertStringIncludes(sdl, "type PingPayload");
  assertStringIncludes(sdl, "message: String"); // **no bang**
  assert(!sdl.includes("message: String!"));
});

Deno.test("returns.nonNull.<scalar>() flips nullable → non-null", () => {
  const spec = defineGqlNode((_f, _r, m) => {
    m.custom("save", {
      args: () => ({}),
      returns: (r) => r.nonNull.boolean("success"),
      resolve: () => ({ success: true }),
    });
  });

  const Dummy = specsToNexusDefs({ DummyNN: spec });
  const sdl = sdlOfTypes([Dummy]);

  assertStringIncludes(sdl, "success: Boolean!");
});

Deno.test("custom mutation payload uses concrete node, not BfNode", () => {
  const testCv = makeLoggedInCv();
  class DummyViewer extends BfNode<
    { email: string }
  > {
    static override gqlSpec = defineGqlNode((_f, _rel, mutation) => {
      mutation.custom("loginDev", {
        args: (a) => a.nonNull.string("email"),
        returns: (r) => r.object(DummyViewer, "currentViewer"),
        resolve: (_src, { email }) => ({
          currentViewer: new DummyViewer(testCv, { email }),
        }),
      });
    });
  }
  const types = specsToNexusDefs({
    BfNode: BfNode.gqlSpec!,
    DummyViewer: DummyViewer.gqlSpec,
  });
  const schema = makeSchema({ types });
  const sdl = printSchema(schema);

  // Payload type should read `currentViewer: DummyViewer!`
  // The broken implementation prints `BfNode!`
  assertStringIncludes(
    sdl,
    "currentViewer: DummyViewer!",
    "Expected concrete node type in payload, got fallback BfNode",
  );
});
