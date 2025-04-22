#! /usr/bin/env -S bff test

import { defineGqlNode, Direction } from "apps/bfDb/graphql/builder/builder.ts";
import { assertEquals, assertExists, assertStringIncludes } from "@std/assert";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { specToNexusObject } from "apps/bfDb/graphql/builder/fromSpec.ts";
import { makeSchema } from "nexus";
import { printSchema } from "graphql";

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

  /* ── basic field checks ──────────────────────────────────────────── */
  assertExists(spec.field.id);
  assertEquals(spec.field.age.nullable, true);
  assertEquals(spec.field.isFollowedByPerson.args?.followerId, "id");

  /* ── relation checks ─────────────────────────────────────────────── */
  assertEquals(spec.relation.account.target(), AccountNode);
  assertEquals(spec.relation.followers.target(), PersonNode);
  assertEquals(spec.relation.likedByViewer.target(), PersonNode);
  assertEquals(spec.relation.followers.direction, Direction.IN);

  /* ── custom mutation output specs ─────────────────────────────────- */
  const byName = Object.fromEntries(
    spec.mutation.customs.map((m) => [m.name, m]),
  );
  assertEquals(byName.hello.output, { value: "string" } as const);
  assertEquals(byName.viewer.output, { person: () => PersonNode } as const);
  assertEquals(
    byName.listNames.output,
    { names: { list: true, of: "string", nullable: true } } as const,
  );
  assertEquals(
    byName.maybeNames.output,
    { maybeNames: { list: true, of: "string", nullable: true } } as const,
  );
  assertEquals(
    byName.allNames.output,
    { allNames: { list: true, of: "string" } } as const,
  );
  assertEquals(
    byName.followersConnection.output,
    { followers: { connection: true, node: () => PersonNode } } as const,
  );
  assertEquals(byName.greet.output, { greeting: "string" } as const);
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
