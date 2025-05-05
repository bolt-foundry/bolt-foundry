#! /usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import {
  type BfDbSpecBuilder,
  RelationshipDirection,
} from "apps/bfDb/classes/BfDbSpecBuilder.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { BfEdgeBase } from "apps/bfDb/classes/BfEdgeBase.ts";
import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
import { AdapterRegistry } from "apps/bfDb/storage/AdapterRegistry.ts";
import { InMemoryAdapter } from "apps/bfDb/storage/InMemoryAdapter.ts";

// -----------------------------------------------------------------------------
// 🔧 Test‑only adapter registration
// -----------------------------------------------------------------------------
AdapterRegistry.register(new InMemoryAdapter());

// -----------------------------------------------------------------------------
// 🧩 Edge mocks used only in this spec file
// -----------------------------------------------------------------------------
class BfEdgeComment extends BfEdgeBase {}
class BfEdgeAvatar extends BfEdgeBase {}
class BfEdgeAccount extends BfEdgeBase {}

type GenericNameProps = { name: string };
// -----------------------------------------------------------------------------
// 🗂️ Mock node classes for coverage
// -----------------------------------------------------------------------------
class BfComment extends BfNode<GenericNameProps> {
  static override bfDbSpec = this.defineBfDbNode((n) => {
    // Comment ◄·· Person (strong back-link)
    n.linkTo(() => BfPerson).in().edge(BfEdgeComment);
  });
}

class BfAvatar extends BfNode<GenericNameProps> {}

class BfPerson extends BfNode<GenericNameProps> {
  static override bfDbSpec = this.defineBfDbNode((n: BfDbSpecBuilder) => {
    // 1️⃣ Person ►·· Comment*   (strong, cascade)
    n.linkTo(() => BfComment)
      .many()
      .edge(BfEdgeComment);

    // 2️⃣ Person ►·· Org*       (weak membership)
    n.linkTo(() => BfOrg)
      .many()
      .edge(BfEdgeAccount)
      .cascadeDelete(false);

    // 3️⃣ Person ► Avatar       (strong 1‑to‑1)
    n.linkTo(() => BfAvatar)
      .edge(BfEdgeAvatar);
  });
}

class BfOrg extends BfNode<GenericNameProps> {
  static override bfDbSpec = this.defineBfDbNode((n: BfDbSpecBuilder) => {
    // Org ◄·· Person* (weak back‑link)
    n.linkTo(() => BfPerson)
      .in()
      .many()
      .edge(BfEdgeAccount)
      .cascadeDelete(false);

    // Org ►·· Comment* (strong containment)
    n.linkTo(() => BfComment).many();
  });
}

// -----------------------------------------------------------------------------
// 🧪 Unit tests – builder pattern
// -----------------------------------------------------------------------------
Deno.test("BfDbSpecBuilder – BfPerson relationships", () => {
  const { relationships } = BfPerson.defineBfDbNode(() => {})!;

  const rels = relationships;
  assertEquals(rels.length, 3);

  const [commentRel, orgRel, avatarRel] = rels;

  // Comment link
  assertEquals((commentRel.target()).name, "BfComment");
  assertEquals(commentRel.isMany, true);
  assertEquals(commentRel.direction, RelationshipDirection.OUT);
  assertEquals(commentRel.edgeClass, BfEdgeComment);
  assertEquals(commentRel.isWeak, false);

  // Org link
  assertEquals((orgRel.target()).name, "BfOrg");
  assertEquals(orgRel.isMany, true);
  assertEquals(orgRel.direction, RelationshipDirection.OUT);
  assertEquals(orgRel.edgeClass, BfEdgeAccount);
  assertEquals(orgRel.isWeak, true);

  // Avatar link
  assertEquals((avatarRel.target()).name, "BfAvatar");
  assertEquals(avatarRel.isMany, false);
  assertEquals(avatarRel.direction, RelationshipDirection.OUT);
  assertEquals(avatarRel.edgeClass, BfEdgeAvatar);
  assertEquals(avatarRel.isWeak, false);
});

Deno.test("BfDbSpecBuilder – BfOrg relationships", () => {
  const { relationships } = BfOrg.defineBfDbNode(() => {})!;

  const rels = relationships;
  assertEquals(rels.length, 2);

  const [personRel, commentRel] = rels;

  // Person link (IN, many, weak)
  assertEquals((personRel.target()).name, "BfPerson");
  assertEquals(personRel.direction, RelationshipDirection.IN);
  assertEquals(personRel.isMany, true);
  assertEquals(personRel.edgeClass, BfEdgeAccount);
  assertEquals(personRel.isWeak, true);

  // Comment link (OUT, many, strong)
  assertEquals((commentRel.target()).name, "BfComment");
  assertEquals(commentRel.direction, RelationshipDirection.OUT);
  assertEquals(commentRel.isMany, true);
  assertEquals(commentRel.edgeClass, undefined);
  assertEquals(commentRel.isWeak, false);
});

// -----------------------------------------------------------------------------
// 🧩 Integration test – round‑trip through the in‑memory store
// -----------------------------------------------------------------------------
Deno.test("BfDbSpecBuilder – integration happy‑path", async () => {
  await withIsolatedDb(async () => {
    const cv = CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
      import.meta,
      "test",
      "test",
    );

    const person = await BfPerson.__DANGEROUS__createUnattached(cv, {
      name: "Alice",
    });
    const org = await BfOrg.__DANGEROUS__createUnattached(cv, { name: "ACME" });
    const comment = await BfComment.__DANGEROUS__createUnattached(cv, {
      name: "Hello",
    });
    const avatar = await BfAvatar.__DANGEROUS__createUnattached(cv, {
      name: "Pic",
    });

    await person.createTargetNode(BfComment, { name: "P‑Comment" }, undefined, {
      role: "author",
    });
    await person.createTargetNode(BfOrg, { name: "P‑Org" }, undefined, {
      role: "member",
    });
    await person.createTargetNode(BfAvatar, { name: "P‑Avatar" }, undefined, {
      role: "profile",
    });

    assertEquals((await person.queryTargets(BfComment)).length, 1);
    assertEquals((await person.queryTargets(BfOrg)).length, 1);
    assertEquals((await person.queryTargets(BfAvatar)).length, 1);

    // simple sanity checks so TS doesn't complain about unused vars
    void org;
    void comment;
    void avatar;
  });
});
