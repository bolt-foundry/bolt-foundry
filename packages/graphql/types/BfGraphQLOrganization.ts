import { objectType } from "packages/graphql/deps.ts";
import { bfSavedSearchType } from "packages/graphql/types/BfGraphQLSavedSearch.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfSavedSearch } from "packages/bfDb/models/BfSavedSearch.ts";

export const BfGraphQLOrganizationType = objectType({
  name: "BfOrganization",
  description: "A collection of people working together",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
    t.nonNull.id("id");
    t.connectionField("savedSearches", {
      type: bfSavedSearchType,
      resolve: async (
        { id },
        args,
        { bfCurrentViewer }: GraphQLContext,
      ) => {
        const person = await BfOrganization.findX(
          bfCurrentViewer,
          toBfGid(id),
        );
        return person.queryTargetsConnectionForGraphQL(BfSavedSearch, args);
      },
    });
  },
});
