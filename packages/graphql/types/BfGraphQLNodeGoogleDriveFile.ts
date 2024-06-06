import {
  objectType,
  mutationField,
  nonNull,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfMediaGraphQLType } from "packages/graphql/types/BfGraphQLMedia.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import { BfNodeGoogleDriveFile } from "packages/bfDb/models/BfNodeGoogleDriveFile.ts";

export const BfNodeGoogleDriveFileGraphQLType = objectType({
  name: "BfNodeGoogleDriveFile",
  definition(t) {
    t.implements(BfMediaGraphQLType);
  },
});

export const BfNodeGoogleDriveFileCreateMutation = mutationField(
  "createBfNodeGoogleDriveFile",
  {
    type: BfNodeGoogleDriveFileGraphQLType,
    args: {
      googleDriveFileId: nonNull(stringArg()),
    },
    resolve: async (
      _root,
      { googleDriveFileId },
      { bfCurrentViewer }: GraphQLContext,
    ) => {
      return await BfNodeGoogleDriveFile.create(bfCurrentViewer, {
        googleDriveFileId,
      })
    },
  },
);