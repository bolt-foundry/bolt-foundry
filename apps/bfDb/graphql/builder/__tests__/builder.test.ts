#! /usr/bin/env -S bff test
// @ts-nocheck – Red tests

import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import {
  assert,
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";
import { BfNodeBase } from "apps/bfDb/classes/BfNodeBase.ts";
import { getLogger } from "packages/logger/logger.ts";

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
    field.nullable.int("age");

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

    // List payload + nullable wrapper (list → nullable order)
    mutation.custom("listNames", {
      args: () => ({}),
      returns: (r) => r.list.string("names").nullable(),
      resolve: (): NameListPayload | null => ({ names: [] }),
    });

    // Same nullable list but declared nullable → list order
    mutation.custom("maybeNames", {
      args: () => ({}),
      returns: (r) => r.nullable.list.string("maybeNames"),
      resolve: (): MaybeNameListPayload => ({ maybeNames: ["x", "y"] }),
    });

    // Non‑nullable list payload
    mutation.custom("allNames", {
      args: () => ({}),
      returns: (r) => r.list.string("allNames"),
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

Deno.test("specToNexusObject – update mutation args", () => {
  const spec = defineGqlNode((field, _rel, mutation) => {
    field.id("id");
    field.string("name");
    mutation.update();
  });

  const Dummy = specToNexusObject("UpdDummy", spec);
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
  assertEquals(spec.implements?.[0], (ParentNode as typeof BfNodeBase).gqlSpec);
});

Deno.test("subclass setting gqlSpec = null disables GraphQL", () => {
  class SilentNode extends BfNodeBase {
    static override gqlSpec = this.defineGqlNode(null);
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
  const parentSpec = BaseNode.gqlSpec;

  logger.debug("Spec implements:", spec?.implements);

  const implementsParent = spec?.implements?.includes(parentSpec);
  assert(
    implementsParent,
    "Subclass should include parent spec in 'implements'",
  );
});
