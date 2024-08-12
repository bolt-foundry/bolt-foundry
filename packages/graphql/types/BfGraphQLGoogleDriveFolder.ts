import { extendType, mutationField, objectType } from "nexus";
import { BfGoogleDriveFolder } from "packages/bfDb/models/BfGoogleDriveFolder.ts";

export const BfGraphQLGoogleDriveFolderType = objectType({
  name: "BfGoogleDriveFolder",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
  }
})

export const BfGraphQLPickGoogleDriveFolderQuery = extendType({
  type: "BfOrganization",
  definition(t) {
    t.connectionField("googleDriveFolders", {
      type: "BfGoogleDriveFolder",
      resolve: (_, args, { bfCurrentViewer }) => {
        const folders = BfGoogleDriveFolder.queryConnectionForGraphQL(
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

export const BfGraphQLPickGoogleDriveFolderMutation = mutationField("pickGoogleDriveFolder", {
  type: "BfGoogleDriveFolder",
  args: {
    folderId: "String",
    name: "String",
  },
  resolve: async (_root, { folderId, name }, { bfCurrentViewer }) => {
    const folder = await BfGoogleDriveFolder.create(bfCurrentViewer, {folderId, name});
    return folder;
  }
})

export const BfGraphQLDeleteGoogleDriveFolderMutation = mutationField("deleteGoogleDriveFolder", {
  type: "BfGoogleDriveFolder",
  args: {
    folderId: "String",
  },
  resolve: async (_root, { folderId }, { bfCurrentViewer }) => {
    const folder = await BfGoogleDriveFolder.delete(bfCurrentViewer, folderId);
    return folder;
  }
})