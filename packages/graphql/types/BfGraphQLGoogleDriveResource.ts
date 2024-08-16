import { extendType, mutationField, objectType } from "nexus";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";

export const BfGraphQLGoogleDriveFolderType = objectType({
  name: "BfGoogleDriveResource",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
  },
});

export const BfGraphQLPickGoogleDriveFolderQuery = extendType({
  type: "BfOrganization",
  definition(t) {
    t.connectionField("googleDriveFolders", {
      type: "BfGoogleDriveResource",
      resolve: (_, args, { bfCurrentViewer }) => {
        const folders = BfGoogleDriveResource.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: bfCurrentViewer.bfOid },
          {},
          args,
        );
        return folders;
      },
    });
  },
});

export const BfGraphQLPickGoogleDriveFolderMutation = mutationField(
  "pickGoogleDriveFolder",
  {
    type: "BfGoogleDriveResource",
    args: {
      resourceId: "String",
      name: "String",
    },
    resolve: async (_root, { resourceId, name }, { bfCurrentViewer }) => {
      const folder = await BfGoogleDriveResource.create(bfCurrentViewer, {
        resourceId,
        name,
      });
      return folder;
    },
  },
);

export const BfGraphQLDeleteGoogleDriveResourceMutation = mutationField(
  "deleteGoogleDriveResource",
  {
    type: "BfGoogleDriveResource",
    args: {
      resourceId: "String",
    },
    resolve: async (_root, { resourceId }, { bfCurrentViewer }) => {
      const folder = await BfGoogleDriveResource.shouldDelete(
        bfCurrentViewer,
        resourceId,
      );
      return folder;
    },
  },
);
