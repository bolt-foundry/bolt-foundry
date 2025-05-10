#! /usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import { BfNode, type InferProps } from "../BfNode.ts";

/* -------------------------------------------------------------------------- */
/*  Sample nodes for testing                                                   */
/* -------------------------------------------------------------------------- */

class BfExampleOrg extends BfNode<InferProps<typeof BfExampleOrg>> {
  static override gqlSpec = this.defineGqlNode((f) => f.string("name"));
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("email").string("name").number("age")
  );
}

class BfExamplePerson extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override gqlSpec = this.defineGqlNode((f) => f.string("name"));
  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .string("email")
      .string("name")
      .number("age")
      .relation("organizations", () =>
        BfExampleOrg, (e) =>
        e.string("role").string("source").many())
  );
}

/* -------------------------------------------------------------------------- */
/*  Type‑safety compile‑time smoke tests                                       */
/* -------------------------------------------------------------------------- */

// ✅ allowed props – should compile
const person = new BfExamplePerson();
const org = new BfExampleOrg();

person.connectTo(org, { role: "admin", source: "import" });

// ❌ missing required edge prop should fail type‑check
// @ts-expect-error – "role" is required
person.connectTo(org, { source: "import" });

// ❌ invalid target type should fail type‑check
class BfNonsense extends BfNode<InferProps<typeof BfNonsense>> {
  static override bfNodeSpec = this.defineBfNode((f) => f.string("slug"));
}
const nonsense = new BfNonsense();
// @ts-expect-error – BfNonsense is not an allowed target for "organizations"
person.connectTo(nonsense, { role: "oops", source: "bad" });

/* -------------------------------------------------------------------------- */
/*  Runtime behaviour (minimal)                                               */
/* -------------------------------------------------------------------------- */

Deno.test("props accessor works", () => {
  const p = new BfExamplePerson({
    email: "p@example.com",
    name: "Alice",
    age: 30,
  });
  assertEquals(p.props.email, "p@example.com");
});

Deno.test("connectTo returns edge instance with props", async () => {
  const edge = await person.connectTo(org, { role: "member", source: "ui" });
  // Edge should expose its props at runtime
  assertEquals(edge.props.role, "member");
});
