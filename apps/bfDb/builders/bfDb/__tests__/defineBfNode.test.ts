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
