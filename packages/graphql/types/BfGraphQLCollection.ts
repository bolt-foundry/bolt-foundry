import {
  idArg,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfGraphQLSavedSearchType } from "packages/graphql/types/mod.ts";
import { BfCollection } from "packages/bfDb/models/BfCollection.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export const BfGraphQLCollectionType = objectType({
  name: "BfCollection",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("name");
  },
});

export const createCollectionMutation = mutationField("createCollection", {
  type: BfGraphQLCollectionType,
  args: {
    googleDriveResourceId: nonNull(stringArg()),
    name: nonNull(stringArg()),
  },
  resolve: async (_, { googleDriveResourceId, name }, { bfCurrentViewer }) => {
    const org = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
    const collection = await org.createTargetNode(BfCollection, { name });
    const _watchedFolder = await collection.addWatchedFolder(
      googleDriveResourceId,
    );
    return collection.toGraphql();
  },
});

export const searchCollectionMutation = mutationField("searchCollection", {
  type: "BfSavedSearch",
  args: {
    query: nonNull(stringArg()),
    collectionId: nonNull(idArg()),
  },
  async resolve(_, { query, collectionId }, { bfCurrentViewer }) {
    const collection = await BfCollection.findX(
      bfCurrentViewer,
      toBfGid(collectionId),
    );
    const savedSearch = await collection.createSavedSearch(query);
    return savedSearch.toGraphql();
  },
});
