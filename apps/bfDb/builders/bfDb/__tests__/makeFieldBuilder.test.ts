#! /usr/bin/env -S bff test
/**
 * makeFieldBuilder – type-safety *and* runtime smoke-tests
 */

import { assertEquals } from "@std/assert";
import {
  makeFieldBuilder,
  type PropsFromFieldSpec,
} from "../makeFieldBuilder.ts";
import type { FieldSpec } from "../makeFieldBuilder.ts";

/* -------------------------------------------------------------------------- */
/*  Compile-time assertions                                                   */
/* -------------------------------------------------------------------------- */

const target: Record<string, FieldSpec> = {}; // <- will hold runtime data
const builder = makeFieldBuilder(target) // <- pass the target map in
  .string("email")
  .number("age");

type Spec = typeof builder._spec;
type ExpectSpec = {
  email: { kind: "string" };
  age: { kind: "number" };
};

// ✅ should compile
const _typeCheck: ExpectSpec = {} as Spec;

type Props = PropsFromFieldSpec<Spec>;
const okProps: Props = { email: "a@example.com", age: 42 };
// @ts-expect-error – “foo” isn’t declared
okProps.foo = "bar";

/* -------------------------------------------------------------------------- */
/*  Runtime assertion                                                         */
/* -------------------------------------------------------------------------- */

Deno.test("makeFieldBuilder mutates the supplied target map", () => {
  assertEquals(target, {
    email: { kind: "string" },
    age: { kind: "number" },
  });
});
