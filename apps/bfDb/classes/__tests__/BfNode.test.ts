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

import type { InferProps } from "apps/bfDb/classes/BfNode.ts";
import { BfExamplePerson } from "apps/bfDb/__fixtures__/Nodes.ts";

/* -------------------------------------------------------------------------- */
/*  Group 1 – compile-time DSL assertions                                     */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode DSL infers strict Props type (compile-time only)", () => {
  const spec = BfExamplePerson.bfNodeSpec; // <F extends FieldSpec>
  type FieldMap = typeof spec.fields; // { email:…, name:…, isEvil:…, currentOrgId: … }

  // Expected describes the *shape* we want
  type Expected = {
    email: { kind: "string" };
    name: { kind: "string" };
    isEvil: { kind: "string" };
    currentOrgId: { kind: "string" };
  };

  // If the DSL ever stops emitting correct FieldMap, TS will flag it here
  const fieldCheck: Expected = {} as FieldMap;

  // Inferred Props should be usable as a value-object
  type Props = InferProps<typeof BfExamplePerson>;
  const ok: Props = {
    email: "a@b.c",
    name: "Alice",
    isEvil: "no",
    currentOrgId: "org_1",
  };
  // @ts-expect-error – "age" wasn't declared
  const bad: Props = { ...ok, age: 99 };
  void ok;
  void bad;
  void fieldCheck;
});

/* -------------------------------------------------------------------------- */
/*  Helpers for runtime groups                                                */
/* -------------------------------------------------------------------------- */

const cv = makeLoggedInCv(); // deterministic org/person IDs
const newCache = () => new Map<string, BfExamplePerson>(); // simple in-mem cache
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------- */
/*  Group 2 – create / save / load round-trip                                 */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode lifecycle – create → dirty → save → load", async () => {
  await withIsolatedDb(async () => {
    const p = await BfExamplePerson.__DANGEROUS__createUnattached(cv, {
      email: "dev@example.com",
      name: "Dev",
      isEvil: "no",
      currentOrgId: "org_dev",
    });

    assertEquals(p.isDirty(), false, "freshly-saved node not dirty");

    // mutate
    p.props = { currentOrgId: "org_dev_2" };
    assertEquals(p.isDirty(), true, "prop change marks node dirty");

    const beforeSave = p.metadata.lastUpdated;
    await delay(5); // ensure clock tick
    await p.save();

    assertEquals(p.isDirty(), false, "save resets dirty flag");
    assert(p.metadata.lastUpdated > beforeSave, "`lastUpdated` bumped");

    // load into a *new* instance to prove persistence
    const reloaded = await new BfExamplePerson(cv, p.props, {
      bfGid: p.metadata.bfGid,
    }).load();
    assertEquals(reloaded.props.currentOrgId, "org_dev_2");
    assertEquals(reloaded.metadata.bfGid, p.metadata.bfGid);
  });
});

/* -------------------------------------------------------------------------- */
/*  Group 3 – find / query helpers + cache                                    */
/* -------------------------------------------------------------------------- */

Deno.test("BfNode.find & .query use cache when provided", async () => {
  await withIsolatedDb(async () => {
    // create two people
    const alice = await BfExamplePerson.__DANGEROUS__createUnattached(cv, {
      email: "alice@test.io",
      name: "Alice",
      isEvil: "no",
      currentOrgId: "org_a",
    });
    await BfExamplePerson.__DANGEROUS__createUnattached(cv, {
      email: "bob@test.io",
      name: "Bob",
      isEvil: "no",
      currentOrgId: "org_b",
    });

    const cache = newCache();

    // --- find (miss → db) ---
    const fetched = await BfExamplePerson.find(cv, alice.metadata.bfGid, cache);
    assertInstanceOf(fetched, BfExamplePerson);
    assertEquals(cache.size, 1, "find populated cache on miss");

    // --- find (hit → cache, no db call) ---
    const again = await BfExamplePerson.find(cv, alice.metadata.bfGid, cache);
    assertEquals(again, fetched, "same instance returned from cache");

    // --- query populates cache for each hit ---
    const [first] = await BfExamplePerson.query(
      cv,
      { className: "BfExamplePerson" },
      {},
      [],
      cache,
    );
    assert(first);
    assertEquals(cache.size, 3, "query added all nodes to cache");
  });
});
