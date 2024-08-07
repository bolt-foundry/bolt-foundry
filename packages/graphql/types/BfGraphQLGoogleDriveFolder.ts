import { mutationField, objectType } from "nexus";
import { BfGoogleDriveFolder } from "packages/bfDb/models/BfGoogleDriveFolder.ts";

export const BfGraphQLGoogleDriveFolderType = objectType({
  name: "BfGoogleDriveFolder",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
  }
})

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
