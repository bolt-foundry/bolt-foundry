import { extendType, mutationField, objectType } from "nexus";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { GraphQLError } from "packages/graphql/deps.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export const BfGraphQLGoogleDriveFolderType = objectType({
  name: "BfGoogleDriveResource",
  definition(t) {
    t.implements("BfNode");
    t.string("name");
  }
})

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

export const BfGraphQLPickGoogleDriveFolderMutation = mutationField("pickGoogleDriveFolder", {
  type: "BfGoogleDriveResource",
  args: {
    resourceId: "String",
    name: "String",
  },
  resolve: async (_root, { resourceId, name }, { bfCurrentViewer }: GraphQLContext) => {
    const folder = await BfGoogleDriveResource.create(bfCurrentViewer, {resourceId, name});
    const organization = await BfOrganization.findX(bfCurrentViewer, bfCurrentViewer.organizationBfGid)
    const _edge = await BfEdge.createEdgeBetweenNodes(bfCurrentViewer, organization, folder);
    return folder.toGraphql();
  }
})

export const BfGraphQLDeleteGoogleDriveFolderMutation = mutationField("deleteGoogleDriveFolder", {
  type: "BfGoogleDriveResource",
  args: {
    resourceId: "String",
  },
  resolve: async (_root, { resourceId }, { bfCurrentViewer }) => {
    if (resourceId == null) {
      throw new GraphQLError("resourceId is required");
    }
    const folder = await BfGoogleDriveResource.findX(bfCurrentViewer, toBfGid(resourceId));
    await folder.delete();
    return folder.toGraphql();
  }
})