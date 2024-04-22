import { objectType } from "packages/graphql/deps.ts";

export const BfGraphQLOrganizationType = objectType({
  name: "BfOrganization",
  description: "A collection of people working together",
  definition(t) {
    t.implements("Actor");
    t.string("name");
  },
});
