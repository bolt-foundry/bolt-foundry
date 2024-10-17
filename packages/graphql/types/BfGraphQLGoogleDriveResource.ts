import { extendType, mutationField, objectType } from "nexus";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import type { GraphQLContext } from "packages/graphql/graphql.ts";
import { GraphQLError } from "packages/graphql/deps.ts";
import { toBfGid, toBfSid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

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
      deprecation: "Use the `watchFolders` field on `Collection` instead.",
      type: BfGraphQLGoogleDriveFolderType,
      resolve: async (_, args, { bfCurrentViewer }: GraphQLContext) => {
        const connection = await BfEdge.queryTargetsConnectionForGraphQL(
          bfCurrentViewer,
          BfGoogleDriveResource,
          toBfSid(bfCurrentViewer.organizationBfGid),
          {},
          args,
        );
        return connection;
      },
    });
  },
});

export const BfGraphQLPickGoogleDriveFolderMutation = mutationField(
  "pickGoogleDriveFolder",
  {
    type: BfGraphQLGoogleDriveFolderType,
    args: {
      resourceId: "String",
      name: "String",
    },
    resolve: async (
      _root,
      { resourceId, name },
      { bfCurrentViewer }: GraphQLContext,
    ) => {
      const organization = await BfOrganization.findX(
        bfCurrentViewer,
        bfCurrentViewer.organizationBfGid,
      );
      const folder = await organization.createTargetNode(
        BfGoogleDriveResource,
        {
          resourceId,
          name,
        },
      );

      return folder.toGraphql();
    },
  },
);

export const BfGraphQLDeleteGoogleDriveResourceMutation = mutationField(
  "deleteGoogleDriveResource",
  {
    type: BfGraphQLGoogleDriveFolderType,
    args: {
      resourceId: "String",
    },
    resolve: async (_root, { resourceId }, { bfCurrentViewer }) => {
      if (resourceId == null) {
        throw new GraphQLError("resourceId is required");
      }
      const folder = await BfGoogleDriveResource.findX(
        bfCurrentViewer,
        toBfGid(resourceId),
      );
      await folder.delete();
      return folder.toGraphql();
    },
  },
);
