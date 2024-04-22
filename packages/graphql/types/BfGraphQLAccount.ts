import { objectType } from "packages/graphql/deps.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";

export const BfGraphQLAccountType = objectType({
  name: "BfAccount",
  description: "A person who uses our system on behalf of an orginization",
  definition(t) {
    t.implements("BfNode");
    t.string("displayName");
    t.id("organizationBfGid");
    t.field("organization", {
      type: "BfOrganization",
      resolve: async (source, _args, { bfCurrentViewer }: GraphQLContext) => {
        const org = await BfOrganization.findX(
          bfCurrentViewer,
          // @ts-expect-error even though it's not on the graphql public api, it's available for using in this specific way.
          source.organizationBfGid,
        );
        return org.toGraphql();
      },
    });
    t.id("personBfGid");
    t.field("person", {
      type: "BfPerson",
      resolve: async (source, _args, { bfCurrentViewer }: GraphQLContext) => {
        const person = await BfPerson.findX(
          bfCurrentViewer,
          // @ts-expect-error even though it's not on the graphql public api, it's available for using in this specific way.
          source.personBfGid,
        );
        return person.toGraphql();
      },
    });
    t.field("role", {
      type: "AccountRole",
    });
  },
});
