#! /usr/bin/env -S bff test
/**
 * defineBfNode – type-safety *and* runtime smoke-tests
 */

import { assertEquals } from "@std/assert";
import { defineBfNode } from "../defineBfNode.ts";
import type { PropsFromFieldSpec } from "../makeFieldBuilder.ts";

/* -------------------------------------------------------------------------- */
/*  Compile-time assertions                                                   */
/* -------------------------------------------------------------------------- */

const spec = defineBfNode((f) =>
  f
    .string("name")
    .number("age")
);

type FieldMap = typeof spec.fields;
type ExpectedMap = {
  name: { kind: "string" };
  age: { kind: "number" };
};
const fieldCheck: ExpectedMap = {} as FieldMap;

type Props = PropsFromFieldSpec<FieldMap>;
const ok: Props = { name: "Alice", age: 30 };
// @ts-expect-error – “email” not declared
const bad: Props = { name: "Bob", age: 22, email: "x@y.z" };
void ok;
void bad;
void fieldCheck;

/* -------------------------------------------------------------------------- */
/*  Runtime assertion                                                         */
/* -------------------------------------------------------------------------- */

Deno.test("defineBfNode exposes its field map at runtime", () => {
  assertEquals(spec.fields, {
    name: { kind: "string" },
    age: { kind: "number" },
  });
});

const personSpec = defineBfNode((f: FieldBuilder, r: RelationBuilder) =>
  f
    .string("email")
    .string("name")
    .number("age")
    .relation("memberOf", () => BfOrganization, (edge) =>
      edge.string("role"),
    ) // one-to-many by default
);

/* -------------------------------------------------------------------------- */
/*  Compile-time checks                                                       */
/* -------------------------------------------------------------------------- */

type PersonFields = typeof personSpec.fields;
/*                                        -------------- should compile */
type _CheckFields = {
  email: { kind: "string" };
  name: { kind: "string" };
  age: { kind: "number" };
};

type PersonRelations = typeof personSpec.relations;
/*                                           --------------- should exist */
type _CheckRels = {
  memberOf: {
    target: typeof BfOrganization;
    props: { role: string };
    multiplicity: "many";
  };
};

/* -------------------------------------------------------------------------- */
/*  Runtime smoke-test (very light)                                           */
/* -------------------------------------------------------------------------- */

Deno.test("relation spec exposes edge fields at runtime", () => {
  assertEquals(
    personSpec.relations.memberOf.props.role.kind,
    "string",
  );
});