#! /usr/bin/env -S bff test
/**
 * makeFieldBuilder / makeSpec – compile-time + runtime guarantees
 *
 * These tests no longer rely on `defineBfNode`; they exercise the new
 * `makeSpec` helper directly.
 */

import { assertEquals } from "@std/assert";
import { makeSpec } from "../makeSpec.ts";
import type { AnyBfNodeCtor } from "apps/bfDb/classes/BfNode.ts";
import type { PropsFromFieldSpec } from "apps/bfDb/builders/bfDb/types.ts";

/* -------------------------------------------------------------------------- */
/*  Minimal dummy node for relation targets                                   */
/* -------------------------------------------------------------------------- */

// We only need something that satisfies `AnyBfNodeCtor` at *type* level.
const DummyNode = class {} as unknown as AnyBfNodeCtor;

/* -------------------------------------------------------------------------- */
/*  1. Pure-field spec                                                        */
/* -------------------------------------------------------------------------- */

const PureFieldSpec = makeSpec((f) =>
  f
    .string("name")
    .number("age")
);

/* compile-time assertions */
type PureFieldMap = typeof PureFieldSpec.fields;
type PureExpected = { name: { kind: "string" }; age: { kind: "number" } };
const _pureCheck: PureExpected = {} as PureFieldMap;

/* props helper still works */
type PureProps = PropsFromFieldSpec<PureFieldMap>;
const _ok1: PureProps = { name: "Alice", age: 30 };
// @ts-expect-error age has wrong type
const _notok: PureProps = { name: "Alice", age: "30" };
// @ts-expect-error extra field
const _notok2: PureProps = { name: "Alice", age: 30, extra: "x" };

/* runtime */
Deno.test("collects plain fields", () => {
  assertEquals(PureFieldSpec.fields, {
    name: { kind: "string" },
    age: { kind: "number" },
  });
  assertEquals(PureFieldSpec.relations, {});
});

/* -------------------------------------------------------------------------- */
/*  2. Spec with relations + edge props                                       */
/* -------------------------------------------------------------------------- */

const WithRelationsSpec = makeSpec((f) =>
  f
    .one("bestFriend", () => DummyNode)
    .many("friends", () => DummyNode, (e) => e.string("since"))
);

type RelMap = typeof WithRelationsSpec.relations;
type ExpectedRel = {
  bestFriend: { cardinality: "one" };
  friends: { cardinality: "many"; props: { since: { kind: "string" } } };
};
// structural‐type check
const _relCheck: ExpectedRel = {} as RelMap;

Deno.test("collects relations with cardinality and props", () => {
  const { relations } = WithRelationsSpec;

  assertEquals(relations.bestFriend.cardinality, "one");
  assertEquals(relations.friends.cardinality, "many");
  assertEquals(relations.friends.props, { since: { kind: "string" } });
});
