#! /usr/bin/env -S bff test
/**
 * BfNode – builder & InferProps smoke-tests
 *
 * Based on apps/bfDb/builders/bfDb/__examples__/SimpleBfNode.ts
 * (no runtime persistence or GraphQL needed).
 */

import { assertEquals } from "@std/assert";
import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";

class BfExamplePerson extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f
      .string("email")
      .string("name")
      .int("age")
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("email")
      .string("name")
      .number("age")
      .string("isEvil")
  );
}

/* -------------------------------------------------------------------------- */
/*  1.  Builder collects the declared fields                                  */
/* -------------------------------------------------------------------------- */

Deno.test("defineBfNode captures declared field specs", () => {
  const { fields } = BfExamplePerson.bfNodeSpec;

  assertEquals(
    Object.keys(fields).sort(),
    ["email", "name", "age", "isEvil"].sort(),
  );

  assertEquals(fields.email.kind, "string");
  assertEquals(fields.age.kind, "number");
});

/* -------------------------------------------------------------------------- */
/*  2.  InferProps produces the right compile-time shape                      */
/* -------------------------------------------------------------------------- */

Deno.test("InferProps generates correct TypeScript shape", () => {
  // ── this should compile fine ────────────────────────────────────────────
  type OrgProps = InferProps<typeof BfExamplePerson>;
  const ok: OrgProps = {
    email: "hi@example.com",
    name: "Acme Inc.",
    age: 42,
    isEvil: "probably",
  };

  // quick runtime check so the variable is “used”
  assertEquals(ok.age, 42);
  // @ts-expect-error – foo doesn’t exist
  ok.foo;

  // ── this *must* raise a TS error (compile-time only) ────────────────────
  // @ts-expect-error – age must be a number and isEvil is required
  const bad: OrgProps = { email: "x", name: "y", age: "not-a-number" };
  // @ts-expect-error – isEvil is required
  const bad2: OrgProps = { email: "x", name: "y", age: 42 };
  void bad; // suppress unused-var warning
  void bad2;
});

Deno.test("props accessor returns plain scalar values", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv(); // establish a default viewer for this test

    const alice = await BfExamplePerson.__DANGEROUS__createUnattached(cv, {
      name: "Alice",
      email: "alice@example.com",
    });

    // @ts-expect-error – foo doesn’t exist
    alice.props.foo;

    assertEquals(alice.props.name, "Alice");
    assertEquals(alice.props.email, "alice@example.com");
  });
});
