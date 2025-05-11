#! /usr/bin/env -S bff test
/**
 * makeFieldBuilder – type-safety *and* runtime smoke-tests
 */

import { assertEquals } from "@std/assert";
import { type FieldSpec, makeFieldBuilder } from "../makeFieldBuilder.ts";

import { BfNode } from "apps/bfDb/classes/BfNode.ts";

/* -------------------------------------------------------------------------- */
/*  Dummy target node for the relation                                        */
/* -------------------------------------------------------------------------- */
class Dummy extends BfNode<Record<string, never>> {
  static override bfNodeSpec = BfNode.defineBfNode((f) => f);
}

/* -------------------------------------------------------------------------- */
/*  Build spec: two scalars + one relation                                    */
/* -------------------------------------------------------------------------- */
const fieldStore: Record<string, FieldSpec> = {};

const builder = makeFieldBuilder(fieldStore)
  .string("email")
  .number("age")
  .relation("memberOf", () => Dummy, (edge) => edge.string("role"))
  .one(); // flip multiplicity (default is "many")

/* -------------------------------------------------------------------------- */
/*  Compile-time checks                                                       */
/* -------------------------------------------------------------------------- */
type Spec = typeof builder._spec;
type ExpectSpec = { email: { kind: "string" }; age: { kind: "number" } };
const specCheck: ExpectSpec = {} as Spec;
void specCheck;

type Rels = typeof builder._rels;
type ExpectRels = {
  memberOf: {
    target: () => typeof Dummy;
    props: { role: { kind: "string" } }; // ← FieldSpec
    multiplicity: "one";
  };
};
const relCheck: ExpectRels = {} as Rels;
void relCheck;

/* -------------------------------------------------------------------------- */
/*  Runtime assertions                                                        */
/* -------------------------------------------------------------------------- */
Deno.test("builder mutates field & relation stores", () => {
  assertEquals(fieldStore, {
    email: { kind: "string" },
    age: { kind: "number" },
  });

  const rel = builder._rels.memberOf;
  assertEquals(rel.target(), Dummy); // thunk works
  assertEquals(rel.props, { role: { kind: "string" } });
  assertEquals(rel.multiplicity, "one");
});
