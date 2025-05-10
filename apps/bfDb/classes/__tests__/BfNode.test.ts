#! /usr/bin/env -S bff test
/**
 * BfNode – type-inference *and* runtime smoke-tests
 *
 * Groups
 *   1. Compile-time assertions  (no DB touches)
 *   2. Runtime persistence for a single node
 *   3. Query / cache helpers
 */

import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "apps/bfDb/utils/testUtils.ts";
import { BfNode, type InferProps } from "../BfNode.ts";

/* -------------------------------------------------------------------------- */
/*  Test fixtures                                                             */
/* -------------------------------------------------------------------------- */

class BfTestOrg extends BfNode<InferProps<typeof BfTestOrg>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f
      .string("name")
      .string("domain")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("name")
      .string("domain")
  );
}

class BfTestPerson extends BfNode<InferProps<typeof BfTestPerson>> {
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
      .relation(
        "memberOf",
        () => BfTestOrg,
        (edge) => edge.string("role"),
      )
  );
}

/* -------------------------------------------------------------------------- */
/*  Group 1 – compile-time DSL assertions                                     */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode DSL infers strict Props type (compile-time only)", () => {
  const spec = BfTestPerson.bfNodeSpec; // <F extends FieldSpec>
  type FieldMap = typeof spec.fields; // { email:…, name:…, age:… }

  // Expected describes the *shape* we want
  type Expected = {
    email: { kind: "string" };
    name: { kind: "string" };
    age: { kind: "number" };
  };

  // If the DSL ever stops emitting correct FieldMap, TS will flag it here
  const fieldCheck: Expected = {} as FieldMap;

  // Inferred Props should be usable as a value-object
  type Props = InferProps<typeof BfTestPerson>;
  const ok: Props = { email: "a@b.c", name: "Alice", age: 30 };
  // @ts-expect-error – “isEvil” wasn’t declared
  const bad: Props = { email: "x@y.z", name: "X", age: 99, isEvil: "yes" };
  void ok;
  void bad;
  void fieldCheck;
});

/* -------------------------------------------------------------------------- */
/*  Helpers for runtime groups                                                */
/* -------------------------------------------------------------------------- */

const cv = makeLoggedInCv(); // deterministic org/person IDs
const newCache = () => new Map<string, BfTestPerson>(); // simple in-mem cache
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------- */
/*  Group 2 – create / save / load round-trip                                 */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode lifecycle – create → dirty → save → load", async () => {
  await withIsolatedDb(async () => {
    const p = await BfTestPerson.__DANGEROUS__createUnattached(cv, {
      email: "dev@example.com",
      name: "Dev",
      age: 42,
    });

    assertEquals(p.isDirty(), false, "freshly-saved node not dirty");

    // mutate
    p.props = { age: 43 };
    assertEquals(p.isDirty(), true, "prop change marks node dirty");

    const beforeSave = p.metadata.lastUpdated;
    await delay(5); // ensure clock tick
    await p.save();

    assertEquals(p.isDirty(), false, "save resets dirty flag");
    assert(p.metadata.lastUpdated > beforeSave, "`lastUpdated` bumped");

    // load into a *new* instance to prove persistence
    const reloaded = await new BfTestPerson(cv, p.props, {
      bfGid: p.metadata.bfGid,
    }).load();
    assertEquals(reloaded.props.age, 43);
    assertEquals(reloaded.metadata.bfGid, p.metadata.bfGid);
  });
});

/* -------------------------------------------------------------------------- */
/*  Group 3 – find / query helpers + cache                                    */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode.find & .query use cache when provided", async () => {
  await withIsolatedDb(async () => {
    // create two people
    const alice = await BfTestPerson.__DANGEROUS__createUnattached(cv, {
      email: "alice@test.io",
      name: "Alice",
      age: 30,
    });
    await BfTestPerson.__DANGEROUS__createUnattached(cv, {
      email: "bob@test.io",
      name: "Bob",
      age: 31,
    });

    const cache = newCache();

    // --- find (miss → db) ---
    const fetched = await BfTestPerson.find(cv, alice.metadata.bfGid, cache);
    assertInstanceOf(fetched, BfTestPerson);
    assertEquals(cache.size, 1, "find populated cache on miss");

    // --- find (hit → cache, no db call) ---
    const again = await BfTestPerson.find(cv, alice.metadata.bfGid, cache);
    assertEquals(again, fetched, "same instance returned from cache");

    // --- query populates cache for each hit ---
    const [first] = await BfTestPerson.query(
      cv,
      { className: "BfTestPerson" },
      {},
      [],
      cache,
    );
    assert(first);
    assertEquals(cache.size, 2, "query added all nodes to cache");
  });
});
