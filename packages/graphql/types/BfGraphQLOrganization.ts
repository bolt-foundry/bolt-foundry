import { objectType } from "packages/graphql/deps.ts";
import { BfGraphQLSavedSearchType } from "packages/graphql/types/BfGraphQLSavedSearch.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfSavedSearch } from "packages/bfDb/models/BfSavedSearch.ts";
import { BfGraphQLCollectionType } from "packages/graphql/types/mod.ts";
import { BfCollection } from "packages/bfDb/models/BfCollection.ts";

export const BfGraphQLOrganizationType = objectType({
  name: "BfOrganization",
  description: "A collection of people working together",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
    t.nonNull.id("id");
    t.connectionField("savedSearches", {
      type: BfGraphQLSavedSearchType,
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
    t.connectionField("collections", {
      type: BfGraphQLCollectionType,
      async resolve({ id }, args, { bfCurrentViewer }) {
        const org = await BfOrganization.findX(
          bfCurrentViewer,
          toBfGid(id),
        );
        const collectionsConnection = await org
          .queryTargetsConnectionForGraphQL(
            BfCollection,
            args,
          );
        return collectionsConnection;
      },
    });
    t.field("defaultCollection", {
      type: BfGraphQLCollectionType,
      resolve: async ({ id }, _, { bfCurrentViewer }) => {
        const org = await BfOrganization.findX(bfCurrentViewer, toBfGid(id));
        const [defaultCollection] = await org.queryTargetInstances(BfCollection);
        return defaultCollection.toGraphql();
      }
    });
  },
});
