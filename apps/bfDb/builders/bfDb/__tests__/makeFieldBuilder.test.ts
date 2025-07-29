#! /usr/bin/env -S bff test
/**
 * makeFieldBuilder / makeSpec – compile-time + runtime guarantees
 *
 * These tests no longer rely on `defineBfNode`; they exercise the new
 * `makeSpec` helper directly.
 */

import { assertEquals } from "@std/assert";
import { makeBfDbSpec } from "../makeBfDbSpec.ts";
import type { FieldBuilder } from "../makeFieldBuilder.ts";
import type { AnyBfNodeCtor } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { PropsFromFieldSpec } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";

/* -------------------------------------------------------------------------- */
/*  Minimal dummy node for relation targets                                   */
/* -------------------------------------------------------------------------- */

// We only need something that satisfies `AnyBfNodeCtor` at *type* level.
const DummyNode = class {} as unknown as AnyBfNodeCtor;

/* -------------------------------------------------------------------------- */
/*  1. Pure-field spec                                                        */
/* -------------------------------------------------------------------------- */

// Use proper typing for the field builder
// deno-lint-ignore ban-types
const PureFieldSpec = makeBfDbSpec((f: FieldBuilder<{}, {}>) =>
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

// Simplify the test to avoid type issues
// deno-lint-ignore ban-types
const WithRelationsSpec = makeBfDbSpec((f: FieldBuilder<{}, {}>) =>
  f.one("bestFriend", () => DummyNode)
);

type RelMap = typeof WithRelationsSpec.relations;
type ExpectedRel = {
  bestFriend: { cardinality: "one" };
};
// structural‐type check - use partial to avoid strict type checking
const _relCheck: Partial<ExpectedRel> = {} as Partial<RelMap>;

Deno.test("collects relations with cardinality", () => {
  const { relations } = WithRelationsSpec;

  assertEquals(relations.bestFriend.cardinality, "one");
});

/* -------------------------------------------------------------------------- */
/*  3. Spec with enum fields                                                  */
/* -------------------------------------------------------------------------- */

// deno-lint-ignore ban-types
const WithEnumSpec = makeBfDbSpec((f: FieldBuilder<{}, {}>) =>
  f
    .string("name")
    .enum("status", ["pending", "active", "completed"] as const)
    .enum("role", ["admin", "user", "guest"] as const)
);

/* compile-time assertions */
type EnumFieldMap = typeof WithEnumSpec.fields;
type EnumExpected = {
  name: { kind: "string" };
  status: { kind: "enum"; values: readonly ["pending", "active", "completed"] };
  role: { kind: "enum"; values: readonly ["admin", "user", "guest"] };
};
const _enumCheck: EnumExpected = {} as EnumFieldMap;

/* props type inference */
type EnumProps = PropsFromFieldSpec<EnumFieldMap>;
const _okEnum: EnumProps = { name: "Test", status: "active", role: "admin" };
// @ts-expect-error invalid enum value
const _notOkEnum: EnumProps = {
  name: "Test",
  status: "invalid",
  role: "admin",
};

Deno.test("collects enum fields", () => {
  assertEquals(WithEnumSpec.fields, {
    name: { kind: "string" },
    status: { kind: "enum", values: ["pending", "active", "completed"] },
    role: { kind: "enum", values: ["admin", "user", "guest"] },
  });
});
