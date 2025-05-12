import { BfNode, type InferProps } from "apps/bfDb/classes/BfNode.ts";

/* -------------------------------------------------------------------------- */
/*  Organisation                                                              */
/* -------------------------------------------------------------------------- */

export class BfExampleOrg extends BfNode<InferProps<typeof BfExampleOrg>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
      // ◀ inbound: many people → one organisation
      .in(
        "members",
        (b) => b.many("memberOf", () => BfExampleOrg),
      )
      // ▶ outbound: one primary owner → many organisations
      .one("primaryOwner", () => BfExamplePerson)
      // ◀ inbound: many pets → one vet organisation
      .in(
        "patients",
        (b) => b.many("vet", () => BfExamplePet),
      )
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("name")
      .string("domain")
      // @ts-expect-error – not set up yet
      .connection("members")
      .object("primaryOwner")
      .connection("patients")
  );
}

/* -------------------------------------------------------------------------- */
/*  Pet                                                                       */
/* -------------------------------------------------------------------------- */

export class BfExamplePet extends BfNode<InferProps<typeof BfExamplePet>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("type")
      // ◀ inbound: many owners → one pet
      .in(
        "owners",
        (b) => b.many("pets", () => BfExamplePerson),
      )
      // ▶ outbound: many sibling pets (self‑edge)
      .many("siblings", () => BfExamplePet)
      // ▶ outbound: one vet organisation
      .one("vet", () => BfExampleOrg)
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("name")
      .string("type")
      // @ts-expect-error – not set up yet
      .connection("owners")
      .connection("siblings")
      .object("vet")
  );
}

/* -------------------------------------------------------------------------- */
/*  Person                                                                    */
/* -------------------------------------------------------------------------- */

export class BfExamplePerson
  extends BfNode<InferProps<typeof BfExamplePerson>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("email")
      .string("name")
      // ▶ outbound: many organisations the person is a member of
      .many(
        "memberOf",
        () => BfExampleOrg,
        (edge) => edge.string("role"),
      )
      // ◀ inbound: many organisations where this person is the primary owner
      .in(
        "ownedOrganizations",
        (b) => b.many("primaryOwner", () => BfExampleOrg),
      )
      // ▶ outbound: many pets
      .many("pets", () => BfExamplePet)
      .string("isEvil")
      .string("currentOrgId")
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("email")
      .string("name")
      // @ts-expect-error – not set up yet
      .connection("memberOf")
      .connection("ownedOrganizations")
      .connection("pets")
  );
}
