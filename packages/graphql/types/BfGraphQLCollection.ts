import {
  idArg,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfGraphQLGoogleDriveFolderType } from "packages/graphql/types/mod.ts";
import {
  BfCollection,
  CollectionToGoogleDriveResourceEdgeRoles,
} from "packages/bfDb/models/BfCollection.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfError } from "lib/BfError.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";

export const BfGraphQLCollectionType = objectType({
  name: "BfCollection",
  definition(t) {
    t.implements(BfNodeGraphQLType);
    t.string("name");
    t.connectionField("watchedFolders", {
      type: BfGraphQLGoogleDriveFolderType,
      resolve: async ({ id }, args, { bfCurrentViewer }) => {
        const collection = await BfCollection.findX(bfCurrentViewer, id);
        return collection.queryTargetsConnectionForGraphQL(
          BfGoogleDriveResource,
          args,
          {},
          { role: CollectionToGoogleDriveResourceEdgeRoles.WATCHED_FOLDER },
        );
      },
    });
  },
});

export const createCollectionMutation = mutationField("addFolderToCollection", {
  type: BfGraphQLCollectionType,
  args: {
    googleDriveResourceId: nonNull(stringArg()),
    name: nonNull(stringArg()),
  },
  resolve: async (_, { googleDriveResourceId, name }, { bfCurrentViewer }) => {
    const org = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
    const collections = await org.queryTargetInstances(BfCollection);
    if (collections.length > 1) {
      throw new BfError("Don't know how to handle multiple collections");
    }
    let collection = collections[0];
    if (!collection) {
      collection = await org.createTargetNode(BfCollection, { name });
    }
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
